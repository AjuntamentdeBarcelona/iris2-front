<script>
import Edit from '~/components/pages/form/Edit'
import AnnouncementForm from './add.vue'

export default {
  name: 'AnnouncementForm',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/masters/announcements/',
    },
    formComponent: {
      type: [Object, String],
      default: () => AnnouncementForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-announcements',
    },
  },
}
</script>
