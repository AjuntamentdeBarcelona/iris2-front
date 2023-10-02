<script>
import Edit from '~/components/pages/form/Edit'
import Support from './support'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'

export default {
  name: 'SupportUpdate',
  extends: Edit,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'Edició de suports',
    },
    url: {
      type: String,
      default: '/api/masters/supports/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-supports',
    },
    method: {
      type: String,
      default: 'put',
    },
    formComponent: {
      type: [Object, String],
      default: () => Support,
    },
  },
}
</script>
