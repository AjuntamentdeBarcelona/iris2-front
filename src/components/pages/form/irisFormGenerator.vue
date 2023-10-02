<template lang="pug">
div.vue-form-generator(v-if='schema != null')
	fieldset(v-if="schema.fields", :is='tag')
		div.row
			div.col-12.col-lg-4
				template(v-for='field in schema.fields')
					form-group(v-if='fieldVisible(field)', :vfg="vfg", :field="field", :errors="allErrors", :model="model", :options="options", @validated="onFieldValidated", @model-updated="onModelUpdated")

	template(v-for='group in groups')
		form-fieldset(:group="group", :vfg="vfg", :errors="allErrors", :model="model", :options="options", @validated="onFieldValidated", @model-updated="onModelUpdated")
</template>


<script>
import VueFormGenerator from 'vue-form-generator'
import IrisFormGroup from '~/components/form-generator/irisFormGroup.vue'
import FormFieldset from '~/components/form-generator/layout/FormFieldset.vue'
import { get as objGet, forEach, isFunction, isNil, isArray } from 'lodash'
import _ from 'lodash'

/**
 * Extends the VueFormGenerator with new functionalities specific for IRIS.
 * * Add external field errors, useful for extending with global validation errors from server or another component.
 * * class option to form groups, it allows to define additional css classes manually
 * * Added the possibility of structuring the forms on various levels with the FormFieldSet classes
 * * Added field identification by uid, rather than direct object comparission
 *
 * @todo render full form with form-fieldsets recursivelly
 */
export default {
  components: {
    'form-group': IrisFormGroup,
    'form-fieldset': FormFieldset,
  },
  extends: VueFormGenerator.component,
  props: {
    externalErrors: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    allErrors: {
      get: function() {
        return this.errors.concat(this.externalErrors)
      },
      set: function(newValue) {
        this.errors = newValue
      },
    },
  },
  methods: {
    // Child field executed validation
    onFieldValidated(res, errors, field) {
      // Remove old errors for this field
      this.errors = this.errors.filter(e => {
        // The field can be identified by its uid or by direct comparission from field
        return (
          e.field !== field.schema &&
          (!e.field.uid || e.field.uid !== field.schema.uid)
        )
      })
      if (!res && errors && errors.length > 0) {
        // Add errors with this field
        forEach(errors, err => {
          this.errors.push({
            field: field.schema,
            error: err,
          })
        })
      }

      let isValid = this.errors.length === 0
      this.$emit('validated', isValid, this.errors, this)
    },
    getFieldsetRowClasses(group) {
      return [group.class].concat(this.getFieldRowClasses(group))
    },
    onModelUpdated(newVal, schema) {
      this.$emit('model-updated', newVal, schema)
    },
  },
}
</script>
