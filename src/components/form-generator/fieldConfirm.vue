<template>
  <div
    v-if="schema"
    :class="{small: !big}"
    class="confirm-field"
    @paste.prevent
  >
    <div
      :class="[firstFieldHidden ? 'hidden-field' : '', classes]"
      @focus.capture="onFocus"
      @blur.capture="onBlur"
    >
      <component
        ref="value"
        :is="groupFieldComponent"
        :vfg="vfg"
        :model="submodel"
        :field="fieldSchema"
        :options="formOptions"
        :class="[{ ready: canConfirmValue}, 'm-0']"
        @model-updated="subValueUpdated"
        @validated="subValueValidated"
      />
    </div>
    <div
      v-if="changed"
      :class="[secondFieldHidden ? 'hidden-field' : '', classes]"
    >
      <component
        ref="confirmation"
        :is="groupFieldComponent"
        :vfg="vfg"
        :model="submodel"
        :field="confirmSchema"
        :options="formOptions"
        @model-updated="subValueUpdated"
      />
    </div>
  </div>
</template>


<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import irisFormGroup from './irisFormGroup.vue'
import WrapperFieldMixin from './WrapperFieldMixin.js'

/**
 * This field allows requires to confirm twice the value of a subfield.
 * The cannonicall example is the email and email confirmation. This field acts
 * as a wrapper, receives the schema for the confirme field and paints it two
 * times. By the way implements the logic for the confirmation validation.
 *
 * Since the field acts a wrapper, the value and the interface is the same of the
 * undeliying field, so its transparent for the both the form and the subfield itself.
 *
 * An example of field schema for this field is:
 * {
 *  type: 'confirm',
 *  validateRelation: function (a, b) { return a == b ? null : 'Must be equal' }
 *  schema: {
 *   type: 'input',
 *  }
 * }
 *
 * By default, the field will check the relation of the two fields as equal, but you can
 * define your own relation with the validateRelation attribute of the schema.
 *
 * The complete list of schema options is:
 * - validateRelation: function that receives the values of the fields and returns an error
 * message if the required condition is not met.
 * - defaultRelationError
 */
export default {
  name: 'FieldConfirm',
  mixins: [irisField, abstractField, WrapperFieldMixin],
  data() {
    return {
      firstFieldFocus: this.schema.allwaysConfirm && this.value ? true : null,
      initial: this.value,
      submodel: {
        original: this.value,
        confirmation: this.schema.allwaysConfirm ? this.value : '',
      },
    }
  },
  computed: {
    changed() {
      if (this.schema.allwaysConfirm) {
        return true
      }
      return !this.initial || this.initial != this.submodel.original
    },
    fieldSchema() {
      return { ...this.schema.schema, model: 'original' }
    },
    canConfirmValue() {
      return this.submodel.original != null && this.errors.length == 0
    },
    firstFieldHidden() {
      return (
        this.firstFieldFocus === false && this.canConfirmValue && this.changed
      )
    },
    secondFieldHidden() {
      if (this.canConfirmValue) {
        return this.firstFieldFocus === true && this.submodel.confirmation
      } else {
        return false
      }
    },
    confirmSchema() {
      return {
        ...this.schema.schema,
        model: 'confirmation',
        validator: null,
        disabled: !this.canConfirmValue,
        label: this.$t('confirmation'),
      }
    },
    big() {
      return this.$el && this.$el.clientWidth > 700
    },
    classes() {
      return this.big ? 'col p-0' : 'col-12 p-0'
    },
    groupFieldComponent() {
      return irisFormGroup
    },
  },
  watch: {
    value: {
      handler() {
        if (this.value !== this.submodel.original) {
          this.initial = this.value
          if (!this.setInitial()) {
            this.value = ''
          }
        }
      },
      immediate: true,
    },
    canConfirmValue(val, oldVal) {
      if (val === false) {
        this.submodel.confirmation = ''
      }
    },
  },
  methods: {
    onFocus() {
      this.firstFieldFocus = true
    },
    onBlur() {
      this.firstFieldFocus = false
    },
    setInitial() {
      this.submodel.original = this.value
      this.submodel.confirmation =
        this.submodel.confirmation == this.value
          ? this.submodel.confirmation
          : ''
      if (this.submodel.original) {
        return this.validate()
      }
      return true
    },
    subValueUpdated() {
      const value = this.getValue()
      if (value) {
        this.value = value
      }
    },
    getValue() {
      if (this.validate()) {
        return this.submodel.original
      }
    },
    validate() {
      const error = this.validateRelation()
      this.$emit('validated', error == null, [error], this)
      return error === null
    },
    validateRelation() {
      if (!this.changed) {
        return null
      }
      if (this.schema.validateRelation) {
        return this.schema.validateRelation(
          this.submodel.original,
          this.submodel.confirmation
        )
      }
      return this.submodel.original == this.submodel.confirmation
        ? null
        : this.schema.defaultRelationError || 'Error'
    },
    subValueValidated(isValid, errors, field) {
      if (isValid) {
        this.errors = []
        this.validate()
      } else {
        this.errors = errors.map(error => {
          return { error: error, field: this.schema }
        })
        this.$emit('validated', isValid, errors, this)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .hidden-field input {
  color: transparent;
  background-color: rgb(147, 168, 145);
}
</style>

<style>
.confirm-field {
  display: inline-flex;
  width: 100%;
}

.confirm-field.small {
  display: block;
}

.field-confirm .confirm-field .form-group:not(.field-checkbox):first-of-type {
  padding-left: 0px;
}

.field-confirm .confirm-field .form-group {
  margin-bottom: 0;
}
</style>
