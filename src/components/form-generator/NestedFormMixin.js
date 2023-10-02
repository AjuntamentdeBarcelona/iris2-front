import irisFormGenerator from '~/components/pages/form/irisFormGenerator.vue'

/**
 * NestedForms are form components that exists inside another form
 *  and which value is typically another object. This mixin allows to implement
 * NestedFormComponents that can be used within a NestedFormField.
 *
 * For example, given an object like this:
 * {
 *   id: '1',
 *   name: 'Peter',
 *   town: {
 *      id: '1',
 *      name: 'París',
 *   }
 * }
 *
 * We can express the edition of this object with two separate definitions,
 * since they represent different concepts:
 * - CitizenForm
 * ---- inputField: name = A
 * ---- FieldNestedForm: form = TownForm
 *
 * This way we ensure modularity and reusability, since TownForm can work with CitizenForm or indepently.
 * Also, we obtain smaller FormDefinition and we avoid to create custom fields each time we need to edit
 * a subobject.
 *
 * This mixin helps to implement this kind of form components. Even non VueFormGenerator components can
 * extend this mixin, and many others, to configure custom behaviour and be used in composition with the
 * NestedFormField component. So, this component imitates the VueFormGenerator interface.
 *
 * The implementation has two important details:
 * - CitizenForm is valid only if the TownForm is valid
 * - The valid of the nested form value is updated at the moment, even if the form is not valid, since
 * validation errors are raised to the parent field and form components.
 *
 * This mixin is compatible, both with v-model (Vue simple field) or model prop of VueFormGenerator.
 */
export default {
  props: {
    extraErrors: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      formModel: {},
      subformOptions: this.getFormOptions(),
      hasErrors: false,
      lastAttached: null,
    }
  },
  computed: {
    formSchema() {
      return this.getSchema()
    },
    /**
     * The nested errors area passed to the field components as a list
     * with only one element. For example:
     * [
     *   {
     *     field: {...}
     *     error: {
     *       fieldA: "ERROR"
     *     }
     *   }
     * ]
     */
    errorDict() {
      return this.extraErrors.length > 0 ? this.extraErrors[0] : {}
    },
    formExternalErrors() {
      return this.processExternalErrors()
    },
    sync() {
      return _.get(this.schema, 'sync', true)
    },
    formComponent() {
      return this.schema.formComponent || irisFormGenerator
    },
  },
  watch: {
    value() {
      this.valuePropUpdated()
    },
  },
  methods: {
    /**
     * @return {Object} the schema for the underliying VueFormGenerator
     */
    getSchema() {
      return {}
    },
    /**
     * This method must be called for adjust the component state each time
     * a prop value has changed.
     */
    valuePropUpdated() {
      if (this.lastAttached != this.value && this.sync) {
        this.attachValue()
        this.checkRequired()
        this.lastAttached = this.value
      }
    },
    /**
     * Each time a model value changes, this method must be called in order to work
     * both with the v-model approach.
     */
    valueChanged() {
      const value = this.getValue()
      this.$emit('input', value)
      this.$emit('model-updated', value)
    },
    /**
     * Validation handler for the underliying form.
     * The final result is a combination of checking all required
     * and the form validation errors.
     * @param {*} isValid
     * @param {*} formErrors
     * @param {*} formGenerator
     */
    validated(isValid, formErrors, formGenerator) {
      this.checkRequired()
      this.hasErrors = isValid && this.hasAllRequired
      formErrors = [this.$t('form_fill_all')]
      this.$emit('validated', this.hasErrors, formErrors, this)
    },
    /**
     * Performs and stores in the state the hasAllRequiredFields field check.
     */
    checkRequired() {
      this.hasAllRequired = this.hasAllRequiredFields()
    },
    /**
     * Checks if has all the field required. Also can be used for extending the
     * validation checks with new conditions independent of the form.
     */
    hasAllRequiredFields() {
      const required = this.getRequiredFormFields()
      if (!this.formModel) {
        return required.length == 0
      }
      for (let field of required) {
        if (!this.formModel[field]) {
          return false
        }
      }
      return this.hasAllExtraFields()
    },
    /**
     * Returns all the required fields for the form.
     * @return {Array} List of property names that must be present on the form.
     */
    getRequiredFormFields() {
      return []
    },
    /**
     * Hook method for extending the hasAllRequiredField checks.
     * @return {Boolean} True if extra data or fields not belonging to form are valid.
     */
    hasAllExtraFields() {
      return true
    },
    /**
     * Process errors received from parent components. For example, server errors.
     * @return {Array} Errors converted to VueFormGenerator format
     */
    processExternalErrors() {
      if (!_.isObject(this.errorDict)) {
        return []
      }
      return Object.keys(this.errorDict).map(errorKey => {
        const field = this.definition.fields[errorKey]
        return field ? { field: field, error: this.errorDict[errorKey] } : null
      })
    },
    /**
     * Assigns the external values to the underliying VueFormGenerator model.
     */
    attachValue() {
      Object.assign(this.formModel, this.value != null ? this.value : {})
    },
    /**
     * Maps the nested form value back to it's final value.
     * This method can ve overriden in order to customize this mapping.
     * @return {*}
     */
    getValue() {
      return this.formModel
    },
    /**
     * Options for the underliying VueFormGenerator
     */
    getFormOptions() {
      return {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateDebounceTime: true,
      }
    },
  },
}
