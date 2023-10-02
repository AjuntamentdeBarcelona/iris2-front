<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import { isPlainObject } from 'lodash'

export default {
  name: 'RecordNonAddressForm',
  extends: SchemaForm,
  props: {
    showBox: {
      type: Boolean,
      default: false,
    },
    externalErrors: {
      type: Array,
      default: () => [],
    },
    ifgSchema: {
      type: Object,
      required: true,
    },
  },
  computed: {
    categorizedExternalErrors() {
      return this.externalErrors.reduce(this.reduceExternalErrors, {
        globalErrors: [],
        nonGlobalErrors: [],
      })
    },
    schema() {
      return this.ifgSchema
    },
  },
  watch: {
    categorizedExternalErrors(value, oldVal) {
      this.globalErrors = value.globalErrors
      this.errors = value.nonGlobalErrors
    },
  },
  methods: {
    /**
     * objects = nonGlobalErrors
     * strings = globalErrors
     */
    reduceExternalErrors(accumulator, currentValue) {
      if (isPlainObject(currentValue)) {
        accumulator.nonGlobalErrors.push(currentValue)
      } else {
        accumulator.globalErrors.push(currentValue)
      }

      return accumulator
    },
    /**
     * Proxy method to the underliying form.
     */
    validate() {
      if (this.$refs.form) {
        return this.$refs.form.validate()
      }
    },
    /**
     * Since this is a subform, it must no show save or back buttons
     */
    getDefaultButtons() {
      return []
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .form-page-form > .alert {
  margin: 2rem -1rem;
}
</style>
