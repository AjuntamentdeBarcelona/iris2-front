<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'

function getCommunicationMediaDefinition(vm) {
  const descriptions = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'short_description',
    {
      placeholder: vm.$t('description'),
      styleClasses: 'col-12 col-lg-6',
    }
  )

  const protocol_id = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('protocol_id'),
    'protocol_id',
    {
      placeholder: vm.$t('code'),
      styleClasses: 'col-12 col-lg-6',
    }
  )

  return new FormDefinition(
    {
      ...descriptions,
      ...protocol_id,
      description: {
        type: 'wysiwyg',
        label: this.$t('record_card_protocol'),
        required: true,
        editorOptions: {
          placeholder: 'Escrigui aquí...',
          formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list'],
        },
        default: '',
        editorToolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
        styleClasses: 'col-12',
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: Object.keys(descriptions)
            .concat(Object.keys(protocol_id))
            .concat(['description']),
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
  name: 'ProtocolForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/protocols/',
    },
    title: {
      type: String,
      default: 'protocols_add',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-records-protocols-add',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-protocols',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-protocols',
    },
    definition: {
      type: Function,
      default: getCommunicationMediaDefinition,
      required: false,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('profile_save_success_title'),
    }
  },
}
</script>
