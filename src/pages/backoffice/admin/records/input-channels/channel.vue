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
      applicant_types: {
        type: 'm2m-select',
        label: vm.$t('applicant_type'),
        allOptionsUrl: '/api/masters/applicant_types/',
        modelAttribute: 'applicant_type',
        styleClasses: 'col',
        labelKeySelect1: 'input_channel_all_applicant_types',
        labelKeySelect2: 'input_channel_selected_applicant_types',
      },
      supports: {
        type: 'm2m-select',
        label: vm.$t('input_channel_supports'),
        allOptionsUrl: '/api/masters/supports/',
        modelAttribute: 'support',
        styleClasses: 'col',
        labelKeySelect1: 'input_channel_all_supports',
        labelKeySelect2: 'input_channel_selected_supports',
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
      can_be_mayorship: {
        type: 'toggle',
        default: false,
        label: vm.$t('input_channel_can_be_mayorship'),
        styleClasses: 'col',
      },
      visible: {
        type: 'toggle',
        default: true,
        label: vm.$t('input_channel_visible'),
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
          fields: ['applicant_types'],
        },
        {
          class: 'col',
          fields: ['supports'],
        },
        {
          class: 'col',
          fields: ['order', 'visible', 'can_be_mayorship'],
        },
      ],
    }
  )

export default {
  name: 'InputChannelForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/masters/input_channels/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-input-channels',
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
  methods: {
    /**
     * Overwritten to assign an order
     */
    getSaveData(model) {
      return {
        applicant_types: model.applicant_types
          ? model.applicant_types.map((applType, index) => ({
              ...applType,
              order: index,
            }))
          : [],
        supports: model.supports
          ? model.supports.map((support, index) => ({
              ...support,
              order: index,
            }))
          : [],
      }
    },
  },
}
</script>
