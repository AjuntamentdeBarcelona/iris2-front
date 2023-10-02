<template>
  <component 
    :is="tag"
    :class="valueClasses"
    :value="readValue"
    class="readonly-value"
    disabled="true">
    {{ readValue }}
  </component>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import irisField from './irisField.js'

/**
 * Field for displaying read only value inside the form.
 *
 * # Schemas options
 * - getReadValue(value): if defined, this function will be called for obtaining the read value.
 * - valueClasses: special css classes applied to the read only value tag
 * - tag (default = span): html tag for the value container
 */
export default {
  name: 'FieldReadOnlyValue',
  mixins: [irisField, abstractField],
  computed: {
    readValue() {
      if (this.schema.getReadValue) {
        return this.schema.getReadValue(this.value, this.model)
      }
      if (this.value == null) {
        return ''
      }
      return this.value
    },
    valueClasses() {
      return this.schema.valueClasses || ''
    },
    tag() {
      return this.schema.tag || 'span'
    },
  },
}
</script>

<style lang="scss">
.time-picker {
  select.form-control {
    display: inline-block;
    width: 80px;
  }
  white-space: nowrap;
}
</style>
