<script>
import Edit from '~/components/pages/form/Edit'
import Group from './group'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  name: 'GroupUpdate',
  extends: Edit,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'group_edit',
    },
    url: {
      type: String,
      default: '/api/profiles/groups/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-groups',
    },
    formComponent: {
      type: [Object, String],
      default: () => Group,
    },
  },
}
</script>
