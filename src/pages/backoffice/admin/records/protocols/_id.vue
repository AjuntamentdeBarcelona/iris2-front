<script>
import Edit from '~/components/pages/form/Edit'
import ProtocolForm from './add.vue'

export default {
  name: 'ProtocolUpdate',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/protocols/admin/',
    },
    formComponent: {
      type: [Object, String],
      default: () => ProtocolForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-protocols',
    },
  },
}
</script>
