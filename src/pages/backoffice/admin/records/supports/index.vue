<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Table from '~/components/pages/list/table'

export default {
  extends: Table,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/masters/supports/',
    },
    title: {
      type: String,
      default: 'navigation_supports',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.support',
    },
  },
  data() {
    return {
      columns: ['description'],
      detailUrl: {
        name: 'backoffice-admin-records-supports-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-supports-support',
      },
      options: {
        filterable: true,
        headings: {
          description: this.$t('description'),
        },
        sortable: ['description'],
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
