<template>
  <span
    v-if="isSpecial"
    class="badge badge-warning">{{ $t('mandatory') }}</span>
  <div
    v-else
    class="form-group field-checkbox">
    <input 
      v-model="value" 
      type="checkbox">
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'

/**
 * SpecialField indicates whether a feature is special or not. This field isn't editable,
 * is only a visual mark.
 */
export default {
  name: 'IsMandatory',
  extends: abstractField,
  computed: {
    isSpecial() {
      return this.model.is_special
    },
  },
  watch: {
    isSpecial(isSpecial) {
      if (isSpecial) this.value = true
    },
  },
}
</script>
