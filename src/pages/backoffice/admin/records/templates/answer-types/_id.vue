<script>
import Edit from '~/components/pages/form/Edit'
import AnswerTypeForm from './add.vue'

export default {
  name: 'AnswerTypeUpdate',
  extends: Edit,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/templates/response_types/',
    },
    title: {
      type: String,
      default: 'response_type_edit',
    },
    formComponent: {
      type: [Object, String],
      default: () => AnswerTypeForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-templates',
    },
  },
}
</script>
