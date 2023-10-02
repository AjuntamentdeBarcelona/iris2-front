<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'

const DATE_FORMAT = 'DD/MM/YYYY'

const formDefinition = vm => new FormDefinition({}, {})

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
  },
}
</script>
