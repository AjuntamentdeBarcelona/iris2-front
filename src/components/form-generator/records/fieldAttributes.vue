<template>
  <div>
    <div 
      v-show="!detail" 
      class="alert alert-info">
      {{ $t('must_select_detail') }}
    </div>
    <record-attributes 
      v-if="detailId" 
      v-model="value"
      :detail-id="detailId"
      :readonly="readonly"
      :auto="autoSetFields"
      @validated="validated" />
  </div>
</template>


<script>
import irisField from '../irisField.js'
import { abstractField } from 'vue-form-generator'
import RecordAttributes from '~/components/iris-pages/records/RecordAttributes.vue'
import { mapState } from 'vuex'

/**
 * This field component that allows to edit the attributes of a given RecordCard.
 * @todo Validation errors
 */
export default {
  name: 'FieldAttributes',
  components: { RecordAttributes },
  mixins: [irisField, abstractField],
  data() {
    return {
      valid: false,
    }
  },
  computed: {
    readonly() {
      return this.schema.readonly
    },
    detailId() {
      return this.detail ? this.detail.id : null
    },
    autoSetFields() {
      return !!this.schema.autoSetFields
    },
    ...mapState('create', ['detail']),
  },
  mounted() {
    this.validate()
  },
  methods: {
    /**
     * Bypass validate to use the underliying AttributeEdit component.
     */
    validate() {
      this.$emit(
        'validated',
        this.valid || this.readonly,
        this.valid ? [] : ['Mandatory'],
        this
      )
    },
    /**
     * Catch validation events from the RecordAttributes component
     */
    validated(isValid, formErrors, formGenerator) {
      this.valid = isValid
      this.validate()
    },
    getId(model) {
      if (!model || !model.element_detail_id) {
        return null
      }
      if (isNaN(parseInt(model.element_detail_id))) {
        return model.element_detail_id.id
      } else {
        return model.element_detail_id
      }
    },
  },
}
</script>
