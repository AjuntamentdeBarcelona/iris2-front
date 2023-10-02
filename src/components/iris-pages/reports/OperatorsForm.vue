<script>
import BaseReportFormManagement from '~/components/iris-pages/reports/BaseReportFormManagement'

export default {
  name: 'OperatorsForm',
  extends: BaseReportFormManagement,
  props: {
    title: {
      type: String,
      default: 'reports_access_question_history',
    },
    url: {
      type: String,
      default: '/api/reports/operators/',
    },
  },
}
</script>
