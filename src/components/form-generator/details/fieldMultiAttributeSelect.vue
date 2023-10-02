<template>
  <span>
    <field-select
      :model="internalModel"
      :schema="internalSchema"
      @model-updated="modelUpdated"
    />
  </span>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import irisField from '~/components/form-generator/irisField.js'
import { abstractField } from 'vue-form-generator'

/**
 * Select component that associates n attributes of an object to each option.
 *
 * For example, given an object {a: 0, b: 0, c: 0}:
 * - Option A --> {a: 1, b: 2}
 * - Option B --> {a :2, b: 3}
 * If the user selects Option B, the associated dict will be assigned to the object,
 * resulting in {a: 2, b: 3, c: 0}.
 */
export default {
  name: 'FieldMultiAttributeSelect',
  components: {
    'field-select':
      VueFormGenerator.component.components.formGroup.components.fieldSelect,
  },
  extends: abstractField,
  data() {
    return {
      internalModel: { value: this.getValueFromModel() },
    }
  },
  computed: {
    internalSchema() {
      return {
        model: 'value',
        values: this.getOptions(),
        selectOptions: {
          noneSelectedText: this.$t('form_select_none_selected'),
        },
      }
    },
  },
  methods: {
    getOptions() {
      const options = this.schema.options
      return Object.keys(options).map(key => {
        return { id: key, name: this.$t(options[key].name) }
      })
    },
    getValueFromModel() {
      return Object.keys(this.schema.options).find(key => {
        let isValue = true
        Object.keys(this.schema.options[key].modelValue).forEach(attrName => {
          const attrVal = this.schema.options[key].modelValue[attrName]
          if (this.model[attrName] != attrVal) {
            isValue = false
          }
        })
        return isValue
      })
    },
    modelUpdated() {
      const value =
        this.internalModel.value != null
          ? this.schema.options[this.internalModel.value].modelValue
          : this.schema.default
      Object.assign(this.model, value)
      this.value = this.internalModel.value
    },
  },
}
</script>
