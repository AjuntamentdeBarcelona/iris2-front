<template>
  <span>
    <tag-selector
      :value="value"
      :id="schema.id"
      :regex="schema.tagRegex"
      :regex-error="schema.regexErrorMsg || $t('invalid_format')"
      classes="theme-material"
    />
  </span>
</template>

<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import TagSelector from 'vue-tag-selector'

/**
 * Extra schema options:
 * - tagRegex: Regex to validate each individual tag
 * - regexErrorMsg: Error message
 */
export default {
  name: 'FieldTagSelector',
  components: {
    'tag-selector': TagSelector,
  },
  mixins: [irisField, abstractField],
}
</script>

<style lang="scss">
.theme-material .tag-selector--input {
  border: none;
  border-bottom: 1px dotted $gray-700;
  margin-bottom: 1.2em;
}
.theme-material .tag-selector--item {
  background: $gray-100;
  color: dark;
  margin-right: 8px;
  padding-left: 12px;
  border-radius: 32px;
  svg {
    vertical-align: top;
  }
}
.theme-material .tag-selector--item:hover {
  background: $dark;
  color: $gray-100;
}
.theme-material .tag-selector--item:hover .tag-selector--remove {
  color: $gray-400;
}
.theme-material .tag-selector--remove {
  width: 24px;
  height: 24px;
  color: $dark;
  margin: 4px 4px 6px;
}
.theme-material .tag-selector--item,
.theme-material .tag-selector-input {
  min-height: 32px;
  line-height: 32px;
  margin-bottom: 8px;
  font-size: 14px;
}
.theme-material .validation-message {
  color: $red;
}
</style>
