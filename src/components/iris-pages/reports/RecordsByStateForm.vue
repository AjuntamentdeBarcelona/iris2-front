<script>
import BaseReportFormManagement from '~/components/iris-pages/reports/BaseReportFormManagement'

export default {
  name: 'RecordsByStateForm',
  extends: BaseReportFormManagement,
  props: {
    title: {
      type: String,
      default: 'reports_records_by_state',
    },
    url: {
      type: String,
      default: '/api/reports/recordstate-groups/',
    },
  },
}
</script>
