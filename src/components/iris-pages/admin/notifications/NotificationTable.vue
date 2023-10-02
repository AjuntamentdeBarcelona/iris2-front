<script>
import Table from '~/components/pages/list/table'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn'
import RecordId from '~/components/tables/columns/RecordId'
import NotificationsMarkAsRead from '~/components/tables/columns/NotificationsMarkAsRead'

export default {
  name: 'NotificationTable',
  extends: Table,
  props: {
    allowEdit: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.notification',
    },
  },
  data() {
    return {
      columns: ['created_at', 'record_card', 'unread_messages', 'mark_as_read'],
      options: {
        perPage: 6,
        headings: {
          created_at: this.$t('notifications_created_at'),
          record_card: this.$t('record_card_normalized_record_id'),
          unread_messages: this.$t('notifications_unread_messages'),
          mark_as_read: this.$t('notifications_mark_as_read'),
        },
        columnsClasses: {
          unread_messages: 'text-nowrap text-center',
          mark_as_read: 'text-center',
        },
        templates: {
          created_at: DateTimeColumn,
          record_card: RecordId,
          mark_as_read: NotificationsMarkAsRead,
        },
      },
    }
  },
  computed: {
    count() {
      return this.$refs.table.count
    },
  },
}
</script>

<style lang="scss">
.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
