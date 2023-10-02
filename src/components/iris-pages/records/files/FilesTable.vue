<script>
import Table from '~/components/pages/list/table'
import RecordCardFileLink from '~/components/tables/columns/RecordCardFileLink'
import FileTypeColumn from '~/components/iris-pages/records/files/FileTypeColumn.vue'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'

export default {
  extends: Table,
  props: {
    propData: {
      type: Array,
      required: true,
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.file',
    },
    disabledDeleteKey: {
      type: String,
      default: 'delete_citizen_message',
    },
  },
  data() {
    return {
      columns: [
        'file',
        'file_type',
        'created_at',
        ...(this.allowDelete ? ['actions'] : []),
      ],
      options: {
        perPage: this.perPage,
        headings: {
          file: this.$t('files_filename'),
          file_type: this.$t('files_origin'),
          created_at: this.$t('created_at'),
        },
        columnsClasses: {
          file: 'align-middle',
          actions: 'actions',
        },
        templates: {
          file: RecordCardFileLink,
          file_type: FileTypeColumn,
          created_at: DateTimeColumn,
        },
      },
    }
  },
  computed: {
    deleteUrl() {
      return this.delete_id
    },
  },
  methods: {
    /**
     * Overwritten to use the delete_url, which also serves as identifier as it contains the id
     */
    onDelete(row) {
      this.delete_id = row.delete_url
      this.$refs.deleteConfirm.open()
    },
  },
}
</script>

<style lang="scss" scoped>
.table-list {
  overflow: hidden;
  .VueTables {
    &.VueTables--server {
      padding: 0;
      border-width: 0;
      /deep/ .actions {
        width: 1px;
        white-space: nowrap;
      }
    }
  }
}
</style>
