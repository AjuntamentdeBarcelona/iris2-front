<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Table from '~/components/pages/list/table'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'UserGroupTable',
  extends: Table,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/profiles/users/',
    },
    title: {
      type: String,
      default: 'navigation_users',
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.user',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN_USER,
    },
  },
  data() {
    return {
      columns: ['username', 'email', 'created_at'],
      detailUrl: {
        name: 'backoffice-admin-access-users-id',
      },
      addUrl: {
        name: 'backoffice-admin-access-users-add',
      },
      options: {
        headings: {
          username: this.$t('users_username'),
          email: this.$t('users_email'),
          created_at: this.$t('users_created'),
        },
        filterable: true,
        sortable: [['username', 'user.username']],
      },
    }
  },
}
</script>
