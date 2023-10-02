<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import UbicationField from '~/components/iris-pages/records/maps/UbicationField.vue'

function getAnnouncementsDefinition(vm) {
  return new FormDefinition(
    {
      ubication: {
        uid: 'ubication-pick-up',
        component: UbicationField,
        styleClasses: 'col-12',
        selectDoor: false,
      },
    },
    {
      groups: [
        {
          fields: ['ubication'],
        },
      ],
    }
  )
}
export default {
  extends: SchemaForm,
  props: {
    formType: {
      type: String,
      default: 'create',
    },
    title: {
      type: String,
      default: 'service_schedule_search_by_street',
    },
    definition: {
      type: Function,
      default: getAnnouncementsDefinition,
    },
  },
  computed: {},
  watch: {},
  methods: {
    getDefaultButtons() {
      return [
        {
          name: 'exit',
          text: this.$t(this.backButtonText),
          click: () => this.$emit('close'),
          icon: 'backward',
          classes: `btn-light${this.resetDefaultButton ? ' mr-1' : ' mr-auto'}`,
        },
        {
          name: 'search',
          text: this.$t('schedule_search'),
          click: this.submit,
          icon: 'search',
          classes: 'btn-primary ml-auto',
        },
      ]
    },
  },
}
</script>
<style lang="scss" scoped>
// TODO: Damià A. globalitzar canviant classe
.irisbox {
  padding: 0;
  border: none;
  font-size: 3rem;
}
/deep/ {
  .form-group {
    padding-bottom: 0;
  }
}
</style>
