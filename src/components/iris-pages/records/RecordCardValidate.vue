<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'

const formDefinition = vm => new FormDefinition({}, {})

export default {
  extends: SchemaForm,
  props: {
    definition: {
      type: Function,
      default: formDefinition,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.irisbox {
  min-height: initial;
  padding: 0;
  margin: 0;
  border: 0;
  .footer-buttons {
    border-top-color: $gray-300;
    border-top-style: solid;
    border-top-width: 1px;
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
