<template>
  <div class="printrecord__card">
    <div class="printrecord__title">
      {{ $t('record_card_external_processing') }}
    </div>
    <div class="printrecord__description">
      {{ $t('record_card_external_processing_info') }}
    </div>
  </div>
</template>

<script>
import ProcessStepMixin from './ProcessStepMixin.js'

export default {
  name: 'Plan',
  mixins: [ProcessStepMixin],
}
</script>
