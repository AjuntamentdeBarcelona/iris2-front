# Informes

[`BaseReportPage`](../../src/pages/backoffice/reports/BaseReportPage.vue) es el componente base de todos los reportes. Se basan en un formulario de filtrado y en la posibilidad de ver parte del resultado en un listado. En caso de ser correcto se puede exportar a excel.

Ejemplo de informe:

```javascript
import BaseReportPage from '~/pages/backoffice/reports/BaseReportPage'
import RecordsByStateForm from '~/components/iris-pages/reports/RecordsByStateForm'
import RecordsByStateTable from '~/components/iris-pages/reports/RecordsByStateTable'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'RecordsByStatePage',
  extends: BaseReportPage,
  props: {
    formComponent: {
      type: Object,
      default: () => RecordsByStateForm,
    },
    tableComponent: {
      type: Object,
      default: () => RecordsByStateTable,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.REPORTS.MANAGEMENT,
    },
  },
}
```

