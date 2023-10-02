<template>
  <base-report-form-management 
    :url="url" 
    :title="title" />
</template>

<script>
import BaseReportFormManagement from '~/components/iris-pages/reports/BaseReportFormManagement'
export default {
  name: 'CreateReportPage',
  components: { BaseReportFormManagement },
  layout: 'backoffice',
  computed: {
    url() {
      return '/api/reports/entries/'
    },
    title() {
      return 'reports_entries'
    },
  },
}
</script>
