<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'
import SchemaForm from '~/components/pages/form/schemaForm'

let filterFormDefinition = new FormDefinition(
  {
    presentation_date__gte: {
      type: 'pikaday',
      format: 'DD/MM/YYYY',
      pikadayOptions: {
        format: 'DD/MM/YYYY',
      },
      label: "Data d'alta inici",
      placeholder: 'Des de...',
      styleClasses: 'col-lg-4',
      validator: validators.date,
      required: false,
    },
    presentation_date__lte: {
      type: 'pikaday',
      format: 'DD/MM/YYYY',
      pikadayOptions: {
        format: 'DD/MM/YYYY',
      },
      label: "Data d'alta fi",
      placeholder: 'Fins a...',
      styleClasses: 'col-lg-4',
      validator: validators.date,
      required: false,
    },
    only_pending: {
      type: 'checkbox',
      label: 'Només fitxes no asignades',
      styleClasses: 'col-lg-12',
      required: false,
    },
  },
  {
    groups: [
      {
        fields: [
          'presentation_date__gte',
          'presentation_date__lte',
          'only_pending',
        ],
      },
    ],
  }
)

export default {
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/ariadna/',
    },
    method: {
      type: String,
      default: 'get',
    },
    definition: {
      type: Object,
      default: () => filterFormDefinition,
    },
    submitOnEnter: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getSaveData(model) {
      if (model.only_pending) {
        return { used: 'False' }
      }
      return { used: undefined }
    },
    getDefaultButtons() {
      return []
    },
    showSuccessMessage() {},
  },
}
</script>
