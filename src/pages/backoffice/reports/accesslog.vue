<script>
import AccessLogFilterForm from '~/components/iris-pages/reports/AccessLogFilterForm.vue'
import AccessLogTable from '~/components/iris-pages/reports/AccessLogTable.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'

export default {
  name: 'AccessLog',
  layout: 'backoffice',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      required: false,
      default: () => AccessLogFilterForm,
    },
    tableComponent: {
      type: Object,
      required: false,
      default: () => AccessLogTable,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.AUDIT,
    },
  },
}
</script>
