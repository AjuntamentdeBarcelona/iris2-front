<template>
  <span>
    <input 
      v-model="value"
      :disabled="tots"
      class="form-control" 
      type="text">
    <div class="form-group field-checkbox vue-js-switch">
      <label class="vue-js-switch">
        <span>{{ $t('detail_polygon_any') }}</span>
      </label>
      <div class="field-wrap">
        <input
          v-model="tots"
          type="checkbox" 
          class="checkbox"
          @change="onCheckChange">
      </div>
    </div>
  </span>
</template>

<script>
import irisField from '~/components/form-generator/irisField.js'
import { abstractField } from 'vue-form-generator'

export const TOTS = '_tots'

/**
 * Input component for introducing polygon codes.
 */
export default {
  mixins: [irisField, abstractField],
  data() {
    return {
      tots: this.value == TOTS,
    }
  },
  watch: {
    value() {
      this.tots = this.value == TOTS
    },
  },
  methods: {
    onCheckChange(newValue) {
      this.value = this.tots ? TOTS : ''
    },
  },
}
</script>
