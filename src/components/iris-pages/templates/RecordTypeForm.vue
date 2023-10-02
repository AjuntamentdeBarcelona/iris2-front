<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'

function getRecordTypeDefinition(vm) {
  let descriptions = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'description',
    { placeholder: vm.$t('description') }
  )
  return new FormDefinition(
    {
      ...descriptions,
      tri: {
        type: 'input',
        inputType: 'number',
        label: 'TRI',
        placeholder: 'TRI',
        styleClasses: 'col-3',
      },
      trt: {
        type: 'input',
        inputType: 'number',
        label: 'TRT',
        placeholder: 'TRT',
        styleClasses: 'col-3',
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: ['description', 'tri', 'trt'],
        },
      ],
    }
  ).translatable(vm, ['description'])
}

export default {
  name: 'AnswerTypeForm',
  extends: SchemaForm,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/masters/response_types/',
    },
    title: {
      type: String,
      default: 'response_type_add',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-templates',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-templates',
    },
    definition: {
      type: Function,
      default: getRecordTypeDefinition,
      required: false,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('response_type_saved'),
    }
  },
}
</script>
