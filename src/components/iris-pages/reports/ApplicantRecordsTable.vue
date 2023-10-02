<script>
import BaseReportTable from '~/components/iris-pages/reports/BaseReportTable'

export default {
  name: 'ApplicantRecordsTable',
  extends: BaseReportTable,
  computed: {
    title() {
      return `${this.$t('reports_applicant_records')}`
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ table {
  th:last-child,
  td:last-child {
    text-align: right;
  }

  th {
    text-transform: uppercase;
  }
}
</style>
