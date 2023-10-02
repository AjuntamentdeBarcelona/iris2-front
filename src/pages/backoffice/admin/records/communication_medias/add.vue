<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'

function getCommunicationMediaDefinition(vm) {
  let descriptions = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'description',
    {
      placeholder: vm.$t('description'),
      styleClasses: 'col-6',
    }
  )
  return new FormDefinition(
    {
      ...descriptions,
      media_type_id: {
        label: vm.$t('media_type'),
        component: VuexSelect,
        storeModule: 'masters',
        storeAttribute: 'mediaTypes',
        storeAction: 'retrieveMediaTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'id',
        required: true,
        styleClasses: 'col-6',
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: Object.keys(descriptions).concat(['media_type_id']),
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
  name: 'CommunicationMediaForm',
  extends: SchemaForm,
  layout: 'Masters',
  props: {
    url: {
      type: String,
      default: '/api/masters/communication_medias/',
    },
    title: {
      type: String,
      default: 'communication_media_add',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-communication_medias',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-communication_medias',
    },
    definition: {
      type: Function,
      default: getCommunicationMediaDefinition,
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
