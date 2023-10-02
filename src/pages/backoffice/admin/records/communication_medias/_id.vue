<script>
import Edit from '~/components/pages/form/Edit'
import CommunicationMediaForm from './add.vue'

export default {
  name: 'CommunicationMediaMasterUpdate',
  extends: Edit,
  layout: 'Masters',
  props: {
    url: {
      type: String,
      default: '/api/masters/communication_medias/',
    },
    title: {
      type: String,
      default: 'communication_media_edit',
    },
    formComponent: {
      type: [Object, String],
      default: () => CommunicationMediaForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-communication_medias',
    },
  },
}
</script>
