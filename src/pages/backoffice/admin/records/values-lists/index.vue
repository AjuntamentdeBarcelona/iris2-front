<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Table from '~/components/pages/list/table'

export default {
  extends: Table,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/features/values_types/',
    },
    title: {
      type: String,
      default: 'navigation_values_list',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.value_list',
    },
  },
  data() {
    return {
      columns: ['description'],
      translated: ['description'],
      detailUrl: {
        name: 'backoffice-admin-records-values-lists-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-values-lists-add',
      },
      options: {
        filterable: true,
        sortable: ['description'],
        headings: {
          description: this.$t('description'),
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .VueTables__search-field label {
  display: none;
}
</style>
