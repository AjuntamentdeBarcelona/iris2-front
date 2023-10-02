<script>
import Edit from '~/components/pages/form/Edit'
import RecordTypeForm from '~/components/iris-pages/templates/RecordTypeForm.vue'

export default {
  name: 'RecordTypeUpdate',
  extends: Edit,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/masters/record_types/',
    },
    title: {
      type: String,
      default: 'record_type_edit',
    },
    formComponent: {
      type: [Object, String],
      default: () => RecordTypeForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-templates',
    },
  },
}
</script>
