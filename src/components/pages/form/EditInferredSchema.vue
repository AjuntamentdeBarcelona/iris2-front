<script>
import Edit from './Edit.vue'
import schemaForm from './schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
/**
 * EditInferredSchema is an Edit view which its FormDefinition is inferred from the model itself.
 */
export default {
  name: 'EditInferredSchema',
  layout: 'backoffice',
  extends: Edit,
  props: {
    formComponent: {
      type: [Object, String],
      default: () => schemaForm,
      required: false,
    },
  },
  data() {
    return {
      loadingDefinition: this.getLoadingFormDefinition(),
    }
  },
  methods: {
    afterLoad(instance) {
      this.setFormData()
      this.definition = this.getInferredSchema(instance)
    },
    getInferredSchema(instance) {},
    getLoadingFormDefinition() {
      return new FormDefinition({}, {})
    },
  },
}
</script>
