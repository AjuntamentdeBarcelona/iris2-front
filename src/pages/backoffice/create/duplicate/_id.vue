
<template>
  <duplicate-record-card 
    ref="form" 
    :record-id="duplicateFrom" />
</template>

<script>
import DuplicateRecordCard from '~/components/iris-pages/create/DuplicateRecordCard.vue'

export default {
  name: 'RecordCardCreateDuplicatePage',
  layout: 'backoffice',
  components: {
    DuplicateRecordCard,
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
      next()
    }
  },
}
</script>
