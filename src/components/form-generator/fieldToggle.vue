<template>
  <toggle-button
    :id="schema.id"
    :value="value"
    :sync="true"
    :disabled="schema.disabled || disabled"
    type="checkbox"
    @input="modelUpdated"
  />
</template>
<script>
import { abstractField } from 'vue-form-generator'
import irisField from './irisField.js'

/**
 * Extra schema options:
 * invertLogic: Inverts the value of the field, useful to avoid double negations without the need to alter the backend
 * TODO: Make invertLogic compatible with VFG's 'default' schema option, Toggle's sync option and initial values
 */
export default {
  name: 'FieldSwitch',
  mixins: [irisField, abstractField],
  methods: {
    modelUpdated(value) {
      this.value = this.schema.invertLogic ? !value : value
    },
  },
}
</script>
