<script>
import TableList from '~/components/pages/list/table.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'ProtocolList',
  extends: TableList,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/protocols/',
    },
    title: {
      type: String,
      default: 'protocols',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.protocol',
    },
  },
  data() {
    return {
      columns: ['protocol_id', 'short_description'],
      addUrl: {
        name: 'backoffice-admin-records-protocols-add',
      },
      detailUrl: {
        name: 'backoffice-admin-records-protocols-id',
      },
      disabledDeleteMessage: this.$t('protocol_cant_delete'),
      options: {
        filterable: true,
        perPage: 200,
        headings: {
          protocol_id: 'ID',
          short_description: this.$t('title'),
        },
        sortable: ['protocol_id', 'short_description'],
      },
    }
  },
  methods: {
    /**
     * Overwritten since deletion uses the protocol_id instead of id
     */
    onDelete(row) {
      this.delete_id = row.protocol_id
      this.$refs.deleteConfirm.open()
    },
  },
}
</script>
