<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'

const formDefinition = vm =>
  new FormDefinition(
    {
      name: {
        type: 'input',
        inputType: 'text',
        max: 40,
        required: true,
        label: vm.$t('name'),
        placeholder: vm.$t('name'),
        styleClasses: 'col-lg-4',
        validator: validators.string,
      },
    },
    {
      groups: [
        {
          class: 'col',
          fields: ['name'],
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
      default: '/api/masters/districts/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-masters-districts',
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
