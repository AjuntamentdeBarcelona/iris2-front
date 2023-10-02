export default {
  computed: {
    isDisabled() {
      let disabled =
        this.disabled || this.schema.disabled || !this.hasAllRequired()
      this.disable()
      return disabled
    },
  },
  methods: {
    getRequired() {
      return this.schema.requiredFields || []
    },
    hasAllRequired() {
      let fields = this.getRequired()
      return (
        fields.length == 0 ||
        fields.find(field => this.isEmptyValue(this.model[field])) === undefined
      )
    },
    isEmptyValue(obj) {
      if (typeof obj == 'object' && obj != null) {
        return Object.keys(obj).length == 0
      } else if (Array.isArray(obj)) {
        return obj.length == 0
      } else {
        return obj == null
      }
    },
    /**
     * Hook method for implementing custom logic on disabling
     */
    disable() {},
  },
}
