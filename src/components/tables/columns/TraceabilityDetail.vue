<template>
  <div>
    <span class="detail">
      <span class="detail-user">{{ data.user_id }}<template v-if="data.user_id && data.group_name">:</template></span>
      <span class="detail-group">{{ data.group_name }}</span>
      <span
        v-if="data.automatic"
        class="detail-group badge badge-info">{{ $t('record_card_traceability_auto') }}</span>
    </span>
    <div
      class="comment"
      v-html="data.event_detail.text"/>
  </div>
</template>

<script>
export default {
  name: 'TraceabilityDetail',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.detail {
  &-user {
    font-weight: bold;
  }
}
</style>
