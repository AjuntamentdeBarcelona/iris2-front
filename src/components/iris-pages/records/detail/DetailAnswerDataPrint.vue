<template>
  <div class="printrecord__card">
    <div class="printrecord__title">
      {{ isNone || !channel ? $t('response_channel') : channel.description }}
    </div>
    <div class="printrecord__description">
      {{ destination }}
    </div>
  </div>
</template>

<script>
import DetailAnswerData from '~/components/iris-pages/records/detail/DetailAnswerData.vue'

export default {
  name: 'DetailAnswerDataPrint',
  extends: DetailAnswerData,
}
</script>
