<script>
import NotificationTable from '~/components/iris-pages/admin/notifications/NotificationTable'
export default {
  extends: NotificationTable,
  props: {
    url: {
      type: String,
      default: '/api/communications/conversations/notifications/internal/',
    },
    title: {
      type: String,
      default: 'notifications_internal_title',
    },
  },
}
</script>
