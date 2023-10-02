<script>
import Edit from '~/components/pages/form/Edit'
import Profile from './add.vue'

export default {
  name: 'ProfileUpdate',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/profiles/profiles/',
    },
    title: {
      type: String,
      default: 'profile_edit',
    },
    formComponent: {
      type: [Object, String],
      default: () => Profile,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-profiles',
    },
  },
}
</script>
