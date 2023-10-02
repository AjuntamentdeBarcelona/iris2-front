<script>
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'
import ApplicantRecordsForm from '~/components/iris-pages/reports/ApplicantRecordsForm'
import ApplicantRecordsTable from '~/components/iris-pages/reports/ApplicantRecordsTable'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'ApplicantRecordsPage',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      default: () => ApplicantRecordsForm,
    },
    tableComponent: {
      type: Object,
      default: () => ApplicantRecordsTable,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.MANAGEMENT,
    },
  },
}
</script>
