<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'

const formDefinition = vm =>
  new FormDefinition(
    {
      description: {
        type: 'input',
        inputType: 'text',
        max: 40,
        required: true,
        label: vm.$t('description'),
        placeholder: vm.$t('description'),
        styleClasses: 'col-lg-4',
        validator: validators.string,
      },
      order: {
        type: 'input',
        inputType: 'number',
        label: vm.$t('order'),
        min: 0,
        max: 2147483647,
        default: 0,
        styleClasses: 'col',
        validator: validators.number,
      },
      send_response: {
        type: 'toggle',
        default: true,
        label: vm.$t('applicant_type_answer'),
        styleClasses: 'col',
      },
    },
    {
      groups: [
        {
          class: 'col',
          fields: ['description'],
        },
        {
          class: 'col',
          fields: ['order', 'send_response'],
        },
      ],
    }
  )

export default {
  name: 'ApplicantTypesForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  layout: 'Masters',
  props: {
    url: {
      type: String,
      default: '/api/masters/applicant_types/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-applicant-types',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
  },
  created() {
    if (this.isNewModel) {
      this.defaultModel()
    }
  },
}
</script>
