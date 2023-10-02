<script>
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'
import WhatWhoHowForm from '~/components/iris-pages/reports/WhatWhoHowForm'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'WhatWhoHowPage',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      default: () => WhatWhoHowForm,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.OPER,
    },
  },
}
</script>
