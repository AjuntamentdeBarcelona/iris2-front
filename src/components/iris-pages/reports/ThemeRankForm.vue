<script>
import BaseReportFormManagement from '~/components/iris-pages/reports/BaseReportFormManagement'

export default {
  name: 'ThemeRankForm',
  extends: BaseReportFormManagement,
  props: {
    title: {
      type: String,
      default: 'reports_theme_rank',
    },
    url: {
      type: String,
      default: '/api/reports/themes_ranking/',
    },
  },
}
</script>
