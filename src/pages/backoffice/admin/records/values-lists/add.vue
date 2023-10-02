<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'

function getValueDefinition(vm) {
  const desc = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'description',
    {
      styleClasses: 'col-12',
      placeholder: vm.$t('description'),
    }
  )
  return new FormDefinition(
    { ...desc },
    {
      fields: Object.keys(desc),
    }
  ).translatable(vm, ['description'])
}

function getValueListDefinition(vm) {
  const description = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'description',
    {
      placeholder: vm.$t('description'),
    }
  )

  return new FormDefinition(
    {
      ...description,
      values: {
        type: 'multiform',
        label: vm.$t('values_list_values_explanation'),
        itemFormDef: getValueDefinition(vm),
        allowAdd: true,
        styleClasses: 'col-12',
        orderBy: 'order',
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: ['description'],
        },
        {
          legend: vm.$t('values_list_values'),
          fields: ['values'],
        },
      ],
    }
  ).translatable(vm, ['description'])
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'ValuesTypeForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/features/values_types/',
    },
    title: {
      type: String,
      default: 'navigation_values_list',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-records-values-lists-add',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-values-lists',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-values-lists',
    },
    definition: {
      type: Function,
      default: getValueListDefinition,
      required: false,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('profile_save_success_title'),
    }
  },
}
</script>
