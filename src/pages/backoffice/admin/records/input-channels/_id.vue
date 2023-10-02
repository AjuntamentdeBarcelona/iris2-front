<script>
import Edit from '~/components/pages/form/Edit'
import Channel from './channel'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'

export default {
  name: 'InputChannelUpdate',
  extends: Edit,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'Edició de canals d’entrada',
    },
    url: {
      type: String,
      default: '/api/masters/input_channels/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-input-channels',
    },
    method: {
      type: String,
      default: 'put',
    },
    formComponent: {
      type: [Object, String],
      default: () => Channel,
    },
  },
}
</script>
