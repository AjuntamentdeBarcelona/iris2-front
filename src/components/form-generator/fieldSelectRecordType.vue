<template>
  <span>
    <field-select
      :model="internalModel"
      :schema="internalSchema"
      @model-updated="modelUpdated"
    />
  </span>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import { mapState, mapActions } from 'vuex'
import { modelFromId } from '~/assets/js/helpers'

/**
 * - optionLabelAttribute: vue select label option. Specifies a field from the ajax call for retrieving the option label
 *   defaults to 'description'
 * - valueAttribute: The returned value will be the one contained by this property, defaults to 'id'
 * - objectValue (default: false): the full object is set as value of the field
 *   valueAttribute must be explicitally set, and not rely on the default, so we can read it from
 *   the schema on outside components
 */
export default {
  name: 'FieldSelectRecordType',
  components: {
    'field-select':
      VueFormGenerator.component.components.formGroup.components.fieldSelect,
  },
  mixins: [irisField, abstractField],
  data: function() {
    return {
      activeChannelsToggles: [],
      loaded: false,
      internalModel: { value: this.value },
      internalSchema: {
        values: [],
        selectOptions: {
          name: 'description',
        },
      },
    }
  },
  computed: {
    ...mapState('masters', {
      recordTypes: 'recordTypes',
    }),
  },
  watch: {
    value() {
      this.internalModel.value =
        this.schema.objectValue &&
        this.value !== null &&
        this.value !== undefined
          ? this.value[this.schema.valueAttribute]
          : this.value
    },
    recordTypes() {
      this.setSchema()
    },
  },
  mounted() {
    // Load RecordTypes
    this.load().then(() => {
      // Enable toggles
      this.loaded = true
      this.setSchema()
    })
  },
  methods: {
    modelUpdated() {
      this.value = this.schema.objectValue
        ? modelFromId(this.internalModel.value, this.recordTypes)
        : this.internalModel.value
    },
    ...mapActions('masters', { load: 'retrieveRecordTypes' }),
    setSchema() {
      this.internalSchema = {
        model: 'value',
        values: this.recordTypes,
        selectOptions: {
          name: this.schema.optionLabelAttribute || 'description',
          value: this.schema.valueAttribute || 'id',
          noneSelectedText: this.$t('form_select_none_selected'),
        },
      }
    },
  },
}
</script>
