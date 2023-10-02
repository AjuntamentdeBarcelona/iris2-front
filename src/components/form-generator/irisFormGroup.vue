<template>
  <div
    :class="getComponentFieldRowClasses(field)"
    class="form-group mt-auto mb-1">
    <label
      v-if="fieldTypeHasLabel(field) && (isField || field.renderLabel)"
      :for="getFieldID(field)"
      :class="field.labelClasses">
      <span
        v-html="field.label"/>
      <span
        v-if="field.help"
        class="help">
        <i class="icon"/>
        <div
          class="helpText"
          v-html="field.help"/>
      </span>
    </label>

    <div
      :class="field.wrapClasses"
      class="field-wrap">
      <component
        ref="child"
        :is="getFieldComponent(field)"
        :vfg="vfg"
        :model="model"
        :schema="field"
        :group="field"
        :form-options="options"
        :active="active"
        :disabled="isDisabled"
        :extra-errors="realFieldErrors(field)"
        @model-updated="onModelUpdated"
        @validated="onFieldValidated"/>
      <div
        v-if="buttonVisibility(field) && isField"
        class="buttons">
        <button
          v-for="(btn, index) in field.buttons"
          :class="btn.classes"
          :key="index"
          @click="buttonClickHandler(btn, field, $event)"
          v-text="btn.label"/>
      </div>
    </div>

    <div
      v-if="field.hint && isField"
      class="hint"
      v-html="fieldHint(field)"/>

    <div
      v-if="fieldErrors(field).length > 0 && isField"
      class="errors help-block">
      <span
        v-for="(error, index) in fieldErrors(field)"
        :key="index"
        v-html="error"/>
    </div>
  </div>
</template>
<script>
import VueFormGenerator from 'vue-form-generator'
import irisFormMixin from '~/components/form-generator/irisFormMixin'

/**
 * Custom FormGroup component that extends VueFormGenerator with new
 * functionalities meant for IRIS2.
 *
 * The new features are (placed in the schema):
 * - hideGroupErrors: if the schema activates this options, the form group won't show validation errors.
 * - component: allows to render a component with a Vue Component instances, rather than a key referecing the VueFormGenerator field register
 * - isField: if false, the component will be included in the form, but it won't manage error o modify the model value.
 * - renderLabel: if true, will render a label even if it's not a field
 * - wrapClasses: custom classes for the field-wrap div
 * - labelClasses: custom classes for the label tag
 * - requiredFields: fields which the field needs to become enabled
 * - resetIfNotAllRequired: if such fields are not present, field's value is set to null
 * This option is useful for placing components in the form layout.
 */
export default {
  name: 'IrisFormGroup',
  extends: VueFormGenerator.component.components.formGroup,
  mixins: [irisFormMixin],
  props: {
    /**
     * Defines if the form FormGroup is active and available for the user.
     */
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
  },
  computed: {
    isField() {
      return this.field.isField != null ? this.field.isField : true
    },
    isDisabled() {
      let disabled = this.disabled || this.field.disabled || !this.requiredReady
      this.disable()
      return disabled
    },
    requiredReady() {
      return this.hasAllRequired()
    },
  },
  watch: {
    requiredReady() {
      if (!this.requiredReady && this.field.resetIfNotAllRequired) {
        this.model[this.field.model] = null
        this.$emit('model-updated', null, this.field.model)
      }
    },
  },
  methods: {
    /**
     * Decides which component must be used for rendering the field bassed on the field schema (field prop).
     * If the prop has a component instance, then will be rendered with that component.
     * @return {Object|String} Component for rendering the field
     */
    getFieldComponent(field) {
      if (field.component) {
        return field.component
      } else {
        return this.getFieldType(field)
      }
    },
    /**
     * Extend field errors in order to add the hideGroupErrors option,
     * meant for work with subforms and inline forms fields.
     */
    fieldErrors(field) {
      if (!field.hideGroupErrors) {
        return this.realFieldErrors(field)
      }
      return []
    },
    realFieldErrors(field) {
      let res = this.errors.filter(
        e => e.field != null && e.field.model === field.model
      )
      return res.map(item => item.error)
    },
    getRequired() {
      return this.field.requiredFields || []
    },
    hasAllRequired() {
      let fields = this.getRequired()
      const hasAllRequired =
        fields.length == 0 ||
        fields.find(field => this.isEmptyValue(this.model[field])) === undefined

      return hasAllRequired
    },
    isEmptyValue(obj) {
      if (typeof obj == 'object' && obj != null) {
        return Object.keys(obj).length == 0
      } else if (Array.isArray(obj)) {
        return obj.length == 0
      } else {
        return obj == null
      }
    },
    /**
     * Hook method for implementing custom logic on disabling
     */
    disable() {},
  },
}
</script>

<style>
.form-group .hint,
.form-group .helpText {
  font-size: 0.8rem;
}

.help-block > span:not(:last-of-type) {
  padding-right: 1ch;
}
</style>
