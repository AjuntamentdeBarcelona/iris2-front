<template>
  <div class="nested-form">
    <div 
      v-if="loading" 
      class="loading">
      Cargando...
    </div>
    <component
      v-if="formSchema && !loading"
      ref="subform"
      :is="formComponent"
      :schema="formSchema"
      :model="formModel"
      :options="subformOptions"
      :external-errors="formExternalErrors"
      @model-updated="valueChanged"
      @validated="validated" />
  </div>
</template>


<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import NestedFormMixin from './NestedFormMixin.js'

/**
 * NestedForm fields are meant to edit subobject with its own schema, within
 * a bigger form editing a outer object.
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
 * The schema for editing the subobject can be passed in the schema object as the
 * schema property. For example:
 *
 * {
 *  model: 'town',
 *  schema: {
 *    input: 'text',
 *    model: 'name',
 *  }
 * }
 *
 * In addition you can extend this component and override the getSchema method for complex
 * logic, like async or inferred schema creation. The component will check if the schema
 * is ready or if its loading attribute is set to true.
 *
 * If loading is set to true, the component will be consired on an invalid state.
 */
export default {
  name: 'FieldNestedForm',
  mixins: [irisField, abstractField, NestedFormMixin],
  data() {
    return {
      loading: false,
    }
  },
  watch: {
    loading() {
      if (this.loading) {
        this.$emit('validated', !this.loading, [this.$t('field_loading')], this)
      }
    },
  },
  methods: {
    /**
     * * The schema for editing the subobject can be passed in the schema object as the
     * schema property. For example:
     *
     * {
     *  model: 'town',
     *  schema: {
     *    input: 'text',
     *    model: 'name',
     *  }
     * }
     */
    getSchema() {
      return this.schema.schema
    },
    validate() {
      if (this.$refs.subform) {
        this.$refs.subform.validate()
      }
    },
    valueChanged() {
      this.value = this.getValue()
    },
  },
}
</script>
