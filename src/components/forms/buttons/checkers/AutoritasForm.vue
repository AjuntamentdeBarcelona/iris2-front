<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'

const DATE_FORMAT = 'DD/MM/YYYY'

const formDefinition = vm =>
  new FormDefinition(
    {
      protocolo: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveGestactProtocols',
        storeAttribute: 'gestactProtocols',
        optionLabelAttribute: 'description',
        valueAttribute: 'codi',
        id: 'codi',
        label: vm.$t('autoritas_protocol'),
        required: true,
        styleClasses: 'col-12',
      },
    },
    {
      groups: [
        {
          fields: ['protocolo'],
        },
      ],
    }
  )

export default {
  name: 'GestactForm',
  extends: SchemaForm,
  props: {
    definition: {
      type: Function,
      default: formDefinition,
    },
  },
  methods: {
    goBack() {
      this.$emit('go-back')
    },
    adjustButtons(buttons) {
      return buttons.map(b => {
        return {
          ...b,
          classes:
            b.name == 'exit'
              ? 'btn-outline-secondary order-1 mr-auto'
              : b.classes,
        }
      })
    },
  },
}
</script>
