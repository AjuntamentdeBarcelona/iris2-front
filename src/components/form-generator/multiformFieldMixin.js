import _ from 'lodash'
import IrisFormGenerator from '~/components/pages/form/irisTableFormGenerator.vue'

/**
 * Mixin for creating fields composed of many form generators.
 *
 * This mixin can work with different schemas for each value or with
 * a fixed schema for all of them.
 *
 * # Fixed item schema
 * Fixed schemas can be set with the itemFormDef property.
 *
 * # Multischema
 * The multischema property allos to set item inside an object indexed
 * by the uid of each inline item.
 */
export default {
  props: {
    extraErrors: {
      type: Array,
      default() {
        return []
      },
      validator(value) {
        if (value && (!Array.isArray(value) || value.length > 1)) {
          console.error(
            'MultiFormFields only accept extra errors in form of array of one element. ' +
              'The only element of the array must be dict mapping (subform uid => errors). ' +
              'Example [{22: {fieldA: [], fieldB: []}]. Received' +
              value
          )
          return false
        }
        return true
      },
    },
  },
  data() {
    return {
      schemas: {},
      formErrors: {},
      initialSchema: this.schema,
      forms: [],
    }
  },
  watch: {
    extraErrors(newErrors, oldErrors) {
      if (!_.isEmpty(newErrors) || !_.isEmpty(oldErrors)) {
        this.setFormErrors()
      }
    },
  },
  computed: {
    formComponent() {
      return IrisFormGenerator
    },
    fixedSchema() {
      if (this.initialSchema.itemFormDef) {
        return this.initialSchema.itemFormDef.getFormSchema()
      }
    },
    orderBy() {
      return _.get(this.initialSchema, 'orderBy', undefined)
    },
    currentOrder() {
      if (this.orderBy) {
        const order = _.max(this.getInlineItems().map(item => item.order))
        return order >= 0 ? order : -1
      }
      return -1
    },
    allowAdd() {
      return this.initialSchema.allowAdd
    },
    /**
     * Options passed to the form generator for inline items
     */
    itemFormOptions() {
      return Object.assign(
        {
          validateAfterChanged: true,
        },
        this.initialSchema.formOptions || {}
      )
    },
    canDelete() {
      return this.initialSchema.canDelete
    },
    labelField() {
      return this.initialSchema.labelField
    },
    inlineIdName() {
      return this.schema.inlineIdName || this.schema.uniqueField || 'id'
    },
  },
  mounted() {
    if (this.orderBy) {
      this.adjustIndexes()
    }
    this.setForms()
    this.setFormErrors()
    if (!this.schema.validator) {
      this.schema.validator = function(value, schema) {
        if (schema.required && value.length == 0) {
          return this.$t('required')
        }
      }
    }
    if (this.schema.initialValidation) {
      this.validate()
    }
  },
  methods: {
    setForms() {
      let forms = this.getInlineItems().map(inlineItem => {
        const uid = this.getItemInlineUid(inlineItem)
        const schema = this.getSchemaForItem(inlineItem)
        if (this.labelField) {
          inlineItem[this.labelField] = inlineItem[this.labelField].trim()
        }
        this.schemas[uid] = schema
        try {
          return {
            schema: schema,
            uid: uid,
            model: inlineItem,
            label: this.getItemLabel(inlineItem),
            options: Object.assign(
              {
                validateDebounceTime: 500,
              },
              this.itemFormOptions
            ),
            canDelete: this.canDelete,
            errors: this.formErrors ? this.formErrors[uid] : [],
          }
        } catch (e) {
          console.log(e)
        }
      })
      this.sort(forms)
      this.forms = forms
    },
    /**
     * Sets the order attribute to match the array index.
     */
    adjustIndexes() {
      this.sortSelected()
      this.getInlineItems().forEach((item, index) => {
        item.order = index
      })
    },
    /**
     * Swaps one item position.
     * @param item {Object} Item being swapper
     * @param positions {Number} Integer number of positions beign moved. If the position exceeds the array boundaries, it will fail.
     */
    swapPosition(itemIndex, positions) {
      const selected = this.getInlineItems()
      const item = selected[itemIndex],
        swapped = selected[itemIndex + positions]
      swapped.order = itemIndex
      item.order = itemIndex + positions
      this.sortSelected()
    },
    moveToPosition(itemIndex, newPosition) {
      const selected = this.getInlineItems()
      const item = selected[itemIndex]
      item.order = newPosition - 0.5 // Use decimal as temporal value for ordering and adjusting
      this.adjustIndexes()
    },
    /**
     * Retrives the uid of a given item
     * @param {*} item
     */
    getItemInlineUid(item) {
      return item[this.inlineIdName]
    },
    /**
     * Retrieves the schema for editing a given InlineItem
     * @param {*} inlineItem
     */
    getSchemaForItem(inlineItem) {
      if (this.fixedSchema) {
        return this.fixedSchema
      }
      const schema = this.initialSchema.multischema[
        this.getItemInlineUid(inlineItem)
      ]
      if (schema == null) {
        throw Error(
          `Missing schema for item with uid ${this.getItemInlineUid(
            inlineItem
          )} in multischema conf`
        )
      }
      return schema
    },
    /**
     * Hook method for setting the final value of the field.
     */
    setValue() {},
    isValid() {
      return this.formErrors.keys().length == 0
    },
    /**
     * Returns the list of inline items being edited
     */
    getInlineItems() {
      return this.value || []
    },
    /**
     * Adds a new inline item to the list
     */
    addInlineItem() {
      if (!this.value) {
        this.value = []
      }
      this.value.push({
        order: this.orderBy ? this.currentOrder + 1 : undefined,
      })
      this.setForms()
    },
    deleteItem(item, idx) {
      this.value.splice(idx, 1)
      this.onItemUpdated(item)
      this.setForms()
    },
    /**
     * Allows to sort the values in order to show them always in the same order.
     */
    sort(forms) {
      forms.sort((a, b) => {
        let aL = this.getItemOrderField(a.model),
          bL = this.getItemOrderField(b.model)
        if (aL < bL) {
          return -1
        }
        if (aL > bL) {
          return 1
        }
        return 0
      })
    },
    sortSelected() {
      this.getInlineItems().sort((a, b) => {
        const aL = a[this.orderBy],
          bL = b[this.orderBy]
        if (aL < bL) {
          return -1
        }
        if (aL > bL) {
          return 1
        }
        return 0
      })
      this.setValue()
    },
    /**
     * Detects changes in the form-generator children and assigns the value
     * @param {*} inlineItem
     */
    onItemUpdated(inlineItem) {
      this.setValue(inlineItem)
      this.$emit('model-updated', this.value, this.initialSchema.model)
    },
    /**
     * Process errors for every form in the group
     * @param {*} isValid
     * @param {*} formErrors
     * @param {*} formGenerator
     */
    onItemFormValidated(isValid, formErrors, formGenerator) {
      this.$emit(
        'validated',
        isValid,
        [this.$t('multiform_all_records_must_be_valid')],
        this
      )
    },
    getItemLabel(item) {
      return item[this.initialSchema.labelField]
    },
    /**
     * Returns the order value for the item, used for setting the order of the forms.
     * By default is the labelField value, unless you define the orderBy attribute of the
     * schema.
     * @param {*} item
     */
    getItemOrderField(item) {
      return this.initialSchema.orderBy
        ? item[this.initialSchema.orderBy]
        : item[this.initialSchema.labelField]
    },
    setFormErrors() {
      this.formErrors = this.processFormErrors(this.extraErrors)
    },
    orderChanged(move) {
      if (move.moved) {
        this.moveToPosition(move.moved.oldIndex, move.moved.newIndex)
      }
    },
    /**
     * Process form errors in array style.
     * @param {*} errorList
     */
    processFormErrors(errorList) {
      const newErrors =
        Array.isArray(errorList) && errorList.length > 0 ? errorList[0] : null
      const errors = {}
      // Skip if errors are generated by the form itself
      if (newErrors && _.isString(newErrors)) {
        return this.formErrors
      }
      if (newErrors) {
        Object.keys(newErrors).forEach(uid => {
          errors[uid] = [].concat.apply(
            [],
            Object.keys(newErrors[uid]).map(key => {
              return newErrors[uid][key].map(value => {
                const field = this.schemas[uid].fields.filter(
                  field => field.model == key
                )
                return {
                  error: value,
                  field: field.length > 0 ? field[0] : null,
                }
              })
            })
          )
        })
      }
      return errors
    },
  },
}
