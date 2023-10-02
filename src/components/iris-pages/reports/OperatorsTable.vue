<script>
import BaseReportTable from '~/components/iris-pages/reports/BaseReportTable'

export default {
  name: 'OperatorsTable',
  extends: BaseReportTable,
  computed: {
    title() {
      return `${this.$t('reports_access_question_history')}`
    },
  },
}
</script>
