<script>
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'
import RecordsByStateForm from '~/components/iris-pages/reports/RecordsByStateForm'
import RecordsByStateTable from '~/components/iris-pages/reports/RecordsByStateTable'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'RecordsByStatePage',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      default: () => RecordsByStateForm,
    },
    tableComponent: {
      type: Object,
      default: () => RecordsByStateTable,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.MANAGEMENT,
    },
  },
}
</script>
