<script>
import CreatedReportPage from './created.vue'

export default {
  name: 'ClosedReportPage',
  extends: CreatedReportPage,
  computed: {
    url() {
      return '/api/reports/closed/'
    },
    title() {
      return 'reports_closed'
    },
  },
}
</script>
