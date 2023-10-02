<script>
import Edit from '~/components/pages/form/Edit'
import UserForm from './add'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserEdit',
  extends: Edit,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'user_edit',
    },
    url: {
      type: String,
      default: '/api/profiles/users/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-users',
    },
    method: {
      type: String,
      default: 'put',
    },
    formComponent: {
      type: [Object, String],
      default: () => UserForm,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN_USER,
    },
  },
  computed: {
    ...mapState('groups', ['username']),
  },
  methods: {
    successSignal(params) {
      this.$emit('form-saved', params)
      if (params.data.username == this.username) {
        this.loadGroups(true)
      }
    },
    ...mapActions('groups', ['loadGroups']),
  },
}
</script>
