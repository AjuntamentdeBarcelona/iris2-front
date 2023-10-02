<script>
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'
import ThemeRankForm from '~/components/iris-pages/reports/ThemeRankForm'
import ThemeRankTable from '~/components/iris-pages/reports/ThemeRankTable'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'ThemeRankPage',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      default: () => ThemeRankForm,
    },
    tableComponent: {
      type: Object,
      default: () => ThemeRankTable,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.MANAGEMENT,
    },
  },
}
</script>
