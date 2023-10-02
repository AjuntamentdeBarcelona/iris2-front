<script>
import BaseReportTable from '~/components/iris-pages/reports/BaseReportTable'

export default {
  name: 'ThemeRankTable',
  extends: BaseReportTable,
  data() {
    return {
      fieldRenames: {
        percentage: this.$t('report_column_percentage'),
      },
    }
  },
  computed: {
    adaptedData() {
      return this.data.map(row => {
        return {
          ...row,
          ...(row.hasOwnProperty('percentage')
            ? { percentage: `${row.percentage} %` }
            : {}),
        }
      })
    },
    title() {
      return `${this.$t('reports_theme_rank')}`
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ table {
  td:nth-child(n + 3) {
    text-align: right;
  }

  th {
    text-transform: uppercase;
  }
}
</style>
