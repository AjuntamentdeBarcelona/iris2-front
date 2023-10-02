<script>
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'
import OperatorsForm from '~/components/iris-pages/reports/OperatorsForm'
import OperatorsTable from '~/components/iris-pages/reports/OperatorsTable'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'OperatorsPage',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      default: () => OperatorsForm,
    },
    tableComponent: {
      type: Object,
      default: () => OperatorsTable,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.QUERY,
    },
  },
}
</script>
