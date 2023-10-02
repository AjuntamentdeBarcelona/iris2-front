<template lang="pug">
  fieldset(:is='fieldsetTag', :class='getFieldsetRowClasses(group)')
    div(:class="{row: !group.customLayout}")
      div.col-12(v-if='group.legend')
          legend(v-if='group.legend') {{ group.legend }}
      template(v-for='field in group.fields')
          form-group(v-if='fieldVisible(field)', :vfg="vfg", :field="field", :errors="errors", :model="internalModel", :options="options",
                    :active="active", @validated="onFieldValidated", @model-updated="onModelUpdated")
      component(:is="group.component || 'form-fieldset'", :key="group.title" v-for='group in group.groups', :group="group", :vfg="vfg"
                :errors="errors", :model="internalModel", :options="options", :active="active", @validated="onFieldValidated", @model-updated="onModelUpdated")
</template>

<script>
import { get as objGet, forEach, isFunction, isNil, isArray } from 'lodash'
import VueFormGenerator from 'vue-form-generator'
import IrisFormGroup from '~/components/form-generator/irisFormGroup.vue'
import { getFieldsFromSchema } from '~/assets/js/forms/Schema.js'

/**
 * Implements the Fieldset concept inside the IrisFormGenerator (that extends VueFormGenerator). Mainly, a Fieldset is the
 * component responsible of rendering schema Groups.
 *
 * This recursive component allows to create complex and rich forms, divided in many blocks with different
 * approaches. With this component the IrisFormGenerator component tree is something like:
 *
 * - IrisFormGenerator
 * ---- FormFieldset
 * --------- IrisFormGroup
 * --------- IrisFormGroup
 * ---- FormFieldset
 * --------- FormFieldSet
 * ------------- IrisFormGroup
 *
 * Inside the concepts of VueFormGenerator, is implemented as something intemedium between VueFormGenerator and FormGroup.
 * In VueFormGenerator both the FormGenerator and FormFieldset concepts are mixed, this components makes a clearer separtion
 * of concerns and extends the possibilities for richer form layouts. So, this component inherits from FormMixin
 *
 * @todo allow to define a custom FormFieldset component for a subgroup
 */
export default {
  name: 'FormFieldset',
  components: {
    'form-group': IrisFormGroup,
  },
  mixins: [].concat(VueFormGenerator.component.mixins),
  props: {
    /**
     * Group that will be rendered in this Fieldset.
     */
    group: {
      type: Object,
      required: true,
    },
    /**
     * VueFormGenerator instance.
     */
    vfg: {
      type: Object,
      required: true,
    },
    /**
     * Model being edited.
     */
    model: {
      type: Object,
      required: true,
    },
    /**
     * Current errors of the form.
     */
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
    /**
     * Additional form options.
     */
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    /**
     * HTML tag used for rendering the fieldset.
     */
    tag: {
      type: String,
      default: 'fieldset',
      validator: function(value) {
        return value.length > 0
      },
    },
    /**
     * Defines if the form FieldSet is active and available for the user.
     */
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
  },
  computed: {
    internalModel() {
      return this.model
    },
    /**
     * @returns HTML tag used for rendering the fieldset
     */
    fieldsetTag() {
      return this.group.tag || this.tag
    },
    /**
     * @returns List of field schema working inside this Fieldset
     */
    fieldList() {
      return getFieldsFromSchema(this.group)
    },
    /**
     * @returns List of attribute name being edited inside this Fieldset
     */
    modelFieldList() {
      return this.fieldList.map(field => field.model)
    },
    /**
     * @returns List of fields with errors inside this Fieldset.
     */
    errorFields() {
      return this.errors.filter(
        error =>
          error.field && this.modelFieldList.indexOf(error.field.model) >= 0
      )
    },
  },
  methods: {
    /**
     * @param {Object} Group
     * @returns List of css classes for the given group
     */
    getFieldsetRowClasses(group) {
      this.fieldList
      return [group.class].concat(this.getFieldRowClasses(group))
    },
    onFieldValidated(isValid, errors, vm) {
      this.$emit('validated', isValid, errors, vm)
    },
    onModelUpdated(newVal, schema) {
      this.$emit('model-updated', newVal, schema)
    },
    clearValidationErrors() {
      if (this.$refs.child) {
        return this.$refs.child.clearValidationErrors()
      }
    },
    /**
     * @param {Object} field schema
     * @returns True if the field must be visible
     */
    fieldVisible(field) {
      if (isFunction(field.visible))
        return field.visible.call(this, this.model, field, this)

      if (isNil(field.visible)) return true

      return field.visible
    },
  },
}
</script>
