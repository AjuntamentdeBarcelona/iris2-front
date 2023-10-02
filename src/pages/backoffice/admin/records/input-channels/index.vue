<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Table from '~/components/pages/list/table'

export default {
  extends: Table,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/masters/input_channels/',
    },
    title: {
      type: String,
      default: 'navigation_input_channels',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.input_channel',
    },
  },
  data() {
    return {
      columns: ['description'],
      detailUrl: {
        name: 'backoffice-admin-records-input-channels-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-input-channels-channel',
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
