<script>
import NotificationTable from '~/components/iris-pages/admin/notifications/NotificationTable'
export default {
  extends: NotificationTable,
  props: {
    url: {
      type: String,
      default: '/api/communications/conversations/notifications/external/',
    },
    title: {
      type: String,
      default: 'notifications_external_title',
    },
  },
}
</script>
