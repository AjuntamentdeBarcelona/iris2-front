<script>
import Table from '~/components/pages/list/table'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'AreaList',
  extends: Table,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/areas/',
    },
    title: {
      type: String,
      default: 'theme_area',
    },
    enableSaveOrdering: {
      type: Boolean,
      default: true,
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.area',
    },
    orderUrl: {
      type: String,
      default: '/api/theme/area',
    },
  },
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-records-theme-area-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-theme-area-area',
      },
      columns: ['description'],
      translated: ['description'],
      options: {
        perPage: 200,
        headings: {
          description: this.$t('description'),
        },
        sortable: ['description'],
        filterable: true,
      },
    }
  },
}
</script>
