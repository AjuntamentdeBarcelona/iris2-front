<script>
import Edit from '~/components/pages/form/Edit'
import OperatorForm from './add.vue'

export default {
  name: 'ProfileUpdate',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/record_cards/internal-operators/',
    },
    title: {
      type: String,
      default: 'operator_update',
    },
    formComponent: {
      type: [Object, String],
      default: () => OperatorForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-operators',
    },
  },
}
</script>
