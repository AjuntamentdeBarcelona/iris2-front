<template>
  <span
    v-if="isSpecial"
    class="badge badge-warning">{{ $t('yes') }}</span>
  <span
    v-else
    class="badge badge-secondary">{{ $t('no') }}</span>
</template>

<script>
import { abstractField } from 'vue-form-generator'

/**
 * SpecialField indicates whether a feature is special or not. This field isn't editable,
 * is only a visual mark.
 */
export default {
  name: 'SpecialField',
  extends: abstractField,
  computed: {
    isSpecial() {
      return this.value
    },
  },
}
</script>
