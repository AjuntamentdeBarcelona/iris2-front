<script>
import Edit from '~/components/pages/form/Edit'
import TemplateForm from './TemplateForm.vue'

export default {
  name: 'TemplateUpdate',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/templates/templates/',
    },
    title: {
      type: String,
      default: 'template_edit',
    },
    formComponent: {
      type: [Object, String],
      default: () => TemplateForm,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
