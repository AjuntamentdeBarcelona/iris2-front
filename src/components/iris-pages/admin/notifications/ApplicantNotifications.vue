<script>
import NotificationTable from '~/components/iris-pages/admin/notifications/NotificationTable'
export default {
  extends: NotificationTable,
  props: {
    url: {
      type: String,
      default: '/api/communications/conversations/notifications/applicant/',
    },
    title: {
      type: String,
      default: 'notifications_applicant_title',
    },
  },
}
</script>
