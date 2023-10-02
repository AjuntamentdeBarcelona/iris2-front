
<template>
  <div>
    <b-breadcrumb :items="breadcrumb" />
    <record-card-edit-page ref="form" />
  </div>
</template>

<script>
import RecordCardEditPage from '~/components/iris-pages/records/RecordCardEditPage.vue'
import breadcrumb from '~/pages/backoffice/records/breadcrumb.js'

export default {
  name: 'RecordCardEditPageRoute',
  layout: 'backoffice',
  components: {
    RecordCardEditPage,
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs.form) {
      this.$refs.form.beforeExit(to, from, next)
    } else {
      next()
    }
  },
  computed: {
    breadcrumb() {
      return breadcrumb.getBreadCrumb(this, true)
    },
  },
}
</script>
