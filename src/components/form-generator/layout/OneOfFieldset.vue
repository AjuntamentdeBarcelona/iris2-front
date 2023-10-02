<script>
import TabbedFieldset from './TabbedFieldset.vue'
import _ from 'lodash'

/**
 * Fieldset for constructing layout in which only one of a set of fields must have value.
 *
 * Only the selected option can be edited. The rest will remain rendered but disabled and its
 * value, validations or value changes will be ignored. Each time an option is disabled, its
 * value will be set to false.
 *
 * Due to its nature, this fieldset only accepts fields, not subgroups.
 *
 * @todo extend to accept groups
 */
export default {
  name: 'OneOfFielset',
  extends: TabbedFieldset,
  props: {
    group: {
      type: Object,
      required: true,
      validator(value) {
        if (value.groups != null) {
          console.error(
            'TabbedFieldset component does not accept groups, only fields.'
          )
        }
        const titles = value.fields.map(field => field.title)
        if (_.uniq(titles).length !== titles.length) {
          console.error(
            'TabbedFieldset does not allow duplicate titles in fields.'
          )
          return false
        }
        return value.groups == null && Array.isArray(value.fields)
      },
    },
  },
  data() {
    return {
      internalModelStore: _.cloneDeep(this.model),
    }
  },
  computed: {
    internalModel() {
      return this.internalModelStore
    },
    /**
     * Groups from the schema expanded with additional info for being displayed in tabs.
     */
    groups() {
      return this.group.fields.map(field => {
        return {
          title: field.title,
          modelAttr: field.model,
          customLayout: true,
          fields: [field],
        }
      })
    },
    /**
     * Field definition for the active tab.
     */
    activeField() {
      if (this.groups && this.activeIndex != null && this.activeIndex >= 0) {
        return this.groups[this.activeIndex].modelAttr
      }
    },
    /**
     * EmptyValue defined in the schema.
     */
    emptyValue() {
      return this.group.emptyValue || null
    },
  },
  /**
   * When the component is created, it must set the active tab according to the initial value.
   */
  created() {
    this.setActive()
  },
  /**
   * Once the component is mounted, it must set as empty values the fields for the non selected tabs.
   */
  mounted() {
    this.resetNonActiveValues()
  },
  methods: {
    /**
     * Sets the active tab according to the actual model value
     */
    setActive() {
      if (this.model) {
        this.groups.forEach((group, idx) => {
          if (!_.isEqual(this.model[group.modelAttr], this.emptyValue)) {
            this.activeIndex = idx
          }
        })
      }
    },
    /**
     * When the tab changes, all the values that not belong to the selected tab must be
     * set to null. Each value changed will emit a model-updated event.
     */
    resetNonActiveValues() {
      if (this.activeIndex == null) {
        return
      }
      let modelUpdate = {}
      this.groups.forEach((group, idx) => {
        if (idx == this.activeIndex) {
          if (this.internalModel[group.modelAttr]) {
            this.applyModelUpdate(modelUpdate, group.modelAttr)
          }
        } else {
          // Set empty fields to unactive tabs
          const field = group.fields[0]
          this.applyEmptyUpdate(modelUpdate, group.modelAttr, group, field)
          // Emit valid events for removing old errors created when it was active
          this.onGroupFieldValidated(group, [true, [], { schema: field }])
        }
      })
      Object.assign(this.model, modelUpdate)
    },
    applyModelUpdate(modelUpdate, attr) {
      modelUpdate[attr] = this.internalModel[attr]
    },
    applyEmptyUpdate(modelUpdate, attr, group, field) {
      if (this.model[group.modelAttr] != null) {
        modelUpdate[attr] = this.emptyValue
        this.$emit('model-updated', this.model[group.modelAttr], field)
      }
    },
    /**
     * Filter errors from non active fields
     */
    onGroupFieldValidated(group, eventArguments) {
      // eventArguments ---> (isValid, errors, field)
      if (group.modelAttr == this.activeField || eventArguments[0]) {
        TabbedFieldset.methods.onGroupFieldValidated.apply(this, arguments)
      }
    },
    /**
     * Override onModelUpdated for only send the active tab events.
     */
    onModelUpdated(newVal, schema) {
      if (schema == this.activeField) {
        this.model[this.activeField] = newVal
        this.$emit('model-updated', newVal, schema)
      }
    },
    /**
     * When the tab is changed, and with it the selected field, the previous value must be saved and then
     * reset.
     */
    tabChanged() {
      this.resetNonActiveValues()
    },
  },
}
</script>
