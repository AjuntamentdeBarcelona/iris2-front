
<template>
  <multi-record-card ref="form" />
</template>

<script>
import MultiRecordCard from '~/components/iris-pages/create/MultiRecordCard.vue'

export default {
  name: 'RecordCardCreatePage',
  layout: 'backoffice',
  components: {
    MultiRecordCard,
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs.form) {
      this.$refs.form.beforeExit(to, from, next)
    } else {
      return next()
    }
  },
}
</script>
