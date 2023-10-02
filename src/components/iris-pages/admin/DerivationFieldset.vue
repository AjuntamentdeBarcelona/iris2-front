<script>
import OneOfFieldSet from '~/components/form-generator/layout/OneOfFieldset.vue'

/**
 * Component for controlling that state derivarions are direct or located, but not both.
 */
export default {
  extends: OneOfFieldSet,
  methods: {
    /**
     * Sets the active tab according to the actual model value
     */
    setActive() {
      if (this.model) {
        this.activeIndex =
          !_.isEqual(this.model['district_derivations'], this.emptyValue) ||
          !_.isEqual(this.model['polygon_derivations'], this.emptyValue)
            ? 1
            : 0
      }
    },
    applyModelUpdate(mod, attr) {
      if (attr == 'direct_derivations') {
        mod[attr] = this.internalModel[attr]
      } else {
        mod['district_derivations'] = this.internalModel['district_derivations']
        mod['polygon_derivations'] = this.internalModel['polygon_derivations']
      }
    },
    applyEmptyUpdate(mod, attr, group, field) {
      if (attr == 'direct_derivations') {
        mod[attr] = this.emptyValue
      } else {
        // Erase and emit valid events
        mod['district_derivations'] = this.emptyValue
        mod['polygon_derivations'] = this.emptyValue
        this.onGroupFieldValidated(group, [
          true,
          [],
          {
            schema: {
              model: 'district_derivations',
              uid: 'district_derivations',
            },
          },
        ])
        this.onGroupFieldValidated(group, [
          true,
          [],
          {
            schema: {
              model: 'polygon_derivations',
              uid: 'polygon_derivations',
            },
          },
        ])
        this.$emit('model-updated', this.model[group.modelAttr], field)
      }
    },
    /**
     * Override onModelUpdated for only send the active tab events.
     */
    onModelUpdated(newVal, schema) {
      if (this.checkActiveSchema(schema)) {
        this.model[schema] = newVal
        this.$emit('model-updated', newVal, schema)
      }
    },
    checkActiveSchema(schema) {
      if (this.activeField == 'direct_derivations') {
        return this.activeField == schema
      }
      return schema != 'direct_derivations'
    },
  },
}
</script>
