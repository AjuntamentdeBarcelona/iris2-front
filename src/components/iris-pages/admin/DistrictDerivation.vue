
<script>
import FieldNestedForm from '~/components/form-generator/FieldNestedForm.vue'
import VuexSelect from '~/components/form-generator/masters/AutocompleteVuexSelect.vue'
import { mapState, mapActions } from 'vuex'
const EMPTY_STATE = '__EMPTY_STATE__'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
// import VueFormGenerator from 'vue-form-generator'

/**
 * Given a list of districts, creates the schema for editing
 * the district derivation settings of a ElementDetail.
 * @param {Array} List of districts
 * @return {FormDenition}
 */
export function getDistrictDerivationForm(districts, vm) {
  const fields = {}
  for (let district of districts) {
    if (district.allow_derivation) {
      fields['' + district.id] = {
        label: district.name,
        component: VuexSelect,
        model: '' + district.id,
        storeModule: 'derivation',
        storeAttribute: 'groupList',
        storeAction: 'loadTree',
        optionLabelAttribute: 'name',
        valueAttribute: 'id',
        required: true,
        resetOnOptionsChange: false,
        styleClasses: 'row',
        labelClasses: 'col-lg-2',
        wrapClasses: 'col-lg-10',
        // validator: VueFormGenerator.validators.integer,
      }
    }
  }
  return fields
}

/**
 * TODO load districts from Store
 */
export default {
  name: 'DistrictDerivation',
  extends: FieldNestedForm,
  props: {
    /**
     * Defines if the answer form is active and available for the user.
     */
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
  },
  data() {
    return {
      cachedSchema: null,
    }
  },
  computed: {
    id() {
      return this.model.id
    },
    state() {
      return this.schema.recordStates || RecordState.PENDING_VALIDATE.id
    },
    ...mapState('masters', ['districts']),
  },
  watch: {
    active() {
      if (this.active) {
        this.validate()
      }
    },
  },
  mounted() {
    this.loadSchema()
  },
  methods: {
    /**
     * Return the cached schema, it will be null until the
     * districts area loaded.
     */
    getSchema() {
      return this.cachedSchema
        ? {
            groups: [
              {
                fields: Object.values(this.cachedSchema),
                style: 'col-12',
                customLayout: true,
              },
            ],
          }
        : null
    },
    constructSchema() {
      this.cachedSchema = getDistrictDerivationForm(this.districts)
    },
    loadSchema() {
      this.loading = true
      this.load().then(values => {
        this.constructSchema()
        this.attachValue()
        this.$nextTick(() => {
          this.validate()
        })
        this.loading = false
      })
    },
    attachValue() {
      this.formModel = this.getModelFromValue()
    },
    getModelFromValue() {
      const value = {}
      if (this.value && this.value.length > 0) {
        this.value.forEach(districtObj => {
          value['' + districtObj.district] = districtObj.group
        })
      } else {
        this.districts
          .filter(district => district.allow_derivation)
          .forEach(district => {
            value['' + district.id] = undefined
          })
      }
      return value
    },
    getRequiredFormFields() {
      if (!this.schema.required && this.model.polygon_derivations.length > 0) {
        if (Object.values(this.formModel).find(item => item != null) == null) {
          return []
        }
      }
      return this.cachedSchema ? Object.keys(this.cachedSchema) : []
    },
    getValue() {
      return Object.entries(this.formModel).map(([key, value]) => {
        return {
          record_state: this.state,
          district: key,
          group: value,
          element_detail: this.model.id,
        }
      })
    },
    ...mapActions('masters', { load: 'retrieveDistricts' }),
  },
}
</script>
