<script>
import BaseReportTable from '~/components/iris-pages/reports/BaseReportTable'

export default {
  name: 'RecordsByStateTable',
  extends: BaseReportTable,
  data() {
    return {
      fieldRenames: {
        en_proces: this.$t('report_column_en_proces'),
        cancelada: this.$t('report_column_cancelada'),
        tramitacio_externa: this.$t('report_column_tramitacio_externa'),
      },
    }
  },
  computed: {
    adaptedData() {
      return this.data.map(row => {
        return {
          ...row,
          ...(row.hasOwnProperty('percentatge')
            ? { percentatge: `${row.percentatge} %` }
            : {}),
        }
      })
    },
    title() {
      return `${this.$t('reports_records_by_state')}`
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ table {
  td:nth-child(n + 2) {
    text-align: right;
  }

  th {
    text-transform: uppercase;
  }
}
</style>
