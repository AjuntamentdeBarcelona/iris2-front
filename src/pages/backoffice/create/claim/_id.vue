
<template>
  <claim-record-card 
    ref="form" 
    :record-id="duplicateFrom" />
</template>

<script>
import ClaimRecordCard from '~/components/iris-pages/create/ClaimRecordCard.vue'

export default {
  name: 'RecordCardClaimPage',
  layout: 'backoffice',
  components: {
    ClaimRecordCard,
  },
  computed: {
    duplicateFrom() {
      return this.$route.params.id
    },
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
