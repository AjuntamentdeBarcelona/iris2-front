<template lang="pug">
  tr(class="iris-table-form")
    slot(name="before-form")
    td(v-for='field in fields')
      form-group(v-if='fieldVisible(field)', :vfg="vfg", :field="field", :errors="allErrors", :model="model", :options="options", @validated="onFieldValidated", @model-updated="onModelUpdated")
    slot(name="after-form")
</template>

<script>
import IrisFormGenerator from './irisFormGenerator.vue'

export default {
  extends: IrisFormGenerator,
  computed: {
    fields() {
      return this.getFields()
    },
  },
  methods: {
    getFields(schema) {
      let fields = Array.isArray(this.schema) ? this.schema : this.schema.fields
      if (Array.isArray(this.schema.groups)) {
        throw Error(
          'TableForm currently not supports nested form schema or groups.'
        )
      }
      return fields
    },
  },
}
</script>

<style>
.iris-table-form .form-group:not(.field-checkbox) {
  margin-bottom: 0px;
}
.iris-table-form .form-group:not(.field-checkbox) label:not(.vue-js-switch) {
  display: none;
}
</style>
