<script>
import Edit from '~/components/pages/form/Edit'
import ValuesListForm from './add.vue'

export default {
  name: 'ValuesListUpdate',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/features/values_types/',
    },
    formComponent: {
      type: [Object, String],
      default: () => ValuesListForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-values-lists',
    },
  },
}
</script>
