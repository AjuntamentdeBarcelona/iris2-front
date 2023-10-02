<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'

function getAnswerTypeDefinition(vm) {
  let descriptions = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'description',
    { placeholder: vm.$t('description'), styleClasses: 'col-12' }
  )
  return new FormDefinition(
    {
      ...descriptions,
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: Object.keys(descriptions),
        },
      ],
    }
  )
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'AnswerType',
  extends: SchemaForm,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/templates/response_types/',
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
      default: getAnswerTypeDefinition,
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
