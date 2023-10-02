<template>
  <div class="external-processing">
    <h3>{{ $t('record_card_external_processing') }}</h3>
    <p class="alert alert-info">
      {{ $t('record_card_external_processing_info') }}
    </p>
  </div>
</template>

<script>
import ProcessStepMixin from './ProcessStepMixin.js'

export default {
  name: 'Plan',
  mixins: [ProcessStepMixin],
}
</script>
