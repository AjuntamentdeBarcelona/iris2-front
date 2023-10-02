<script>
import SchemaForm from '~/components/pages/form/schemaForm'

export default {
  extends: SchemaForm,
  props: {
    backButton: {
      type: Boolean,
      default: false,
    },
    saveButtonText: {
      type: String,
      default: 'search',
    },
    saveButtonIcon: {
      type: String,
      default: 'search',
    },
  },
}
</script>
