<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import VuexSelect from '~/components/form-generator/masters/VuexSelect'
import Permissions from '~/assets/js/iris2/Permissions.js'

const formDefinition = vm =>
  new FormDefinition(
    {
      document: {
        type: 'input',
        inputType: 'text',
        maxlength: 12,
        min: 3,
        id: 'id_card',
        label: vm.$t('id_card'),
        placeholder: vm.$t('insert_card'),
        required: true,
        styleClasses: 'col-12 col-lg-4',
      },
      applicant_type_id: {
        label: vm.$t('applicant_type'),
        component: VuexSelect,
        storeModule: 'masters',
        storeAttribute: 'applicantTypes',
        storeAction: 'retrieveApplicantTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'id',
        required: true,
        styleClasses: 'col-12 col-lg-4',
      },
      input_channel_id: {
        type: 'autocomplete',
        inputType: 'number',
        optionLabelAttribute: 'description',
        placeholder: vm.$t('reports_select_input_channel'),
        label: "Canal d'entrada",
        valueAttribute: 'id',
        url: '/api/masters/input_channels/',
        styleClasses: 'col-12 col-lg-4',
        isRestful: true,
        required: true,
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: 'Configuració',
          fields: ['document', 'applicant_type_id', 'input_channel_id'],
        },
      ],
    }
  )

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'OperatorForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/record_cards/internal-operators/',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-access-operators-add',
    },
    title: {
      type: String,
      default: 'operator_create',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-operators',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-access-operators',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN_USER,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('operator_save_success_title'),
    }
  },
}
</script>
