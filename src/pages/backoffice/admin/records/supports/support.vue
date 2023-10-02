<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators, schema } from 'vue-form-generator'

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
      allow_nd: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_citizen_nd'),
        styleClasses: 'col',
      },
      communication_media_required: {
        type: 'toggle',
        default: false,
        label: vm.$t('support_communication_media_required'),
        styleClasses: 'col',
      },
      register_required: {
        type: 'toggle',
        default: false,
        label: vm.$t('support_register_required'),
        styleClasses: 'col',
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
      response_channels: {
        type: 'm2m-select',
        label: vm.$t('support_response_channels'),
        allOptionsUrl: '/api/masters/response_channels/',
        modelAttribute: 'response_channel',
        optionLabelAttribute: 'name',
        styleClasses: 'col',
        labelKeySelect1: 'support_all_response_channels',
        labelKeySelect2: 'support_selected_response_channels',
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
          fields: [
            'allow_nd',
            'communication_media_required',
            'register_required',
          ],
        },
        {
          class: 'col',
          fields: ['response_channels'],
        },
        {
          class: 'col',
          fields: ['order'],
        },
      ],
    }
  )

export default {
  name: 'SupportForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/masters/supports/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-supports',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
  },
  created() {
    if (this.isNewModel) {
      this.model = schema.createDefaultObject(this.schemaDef)
    }
  },
}
</script>
