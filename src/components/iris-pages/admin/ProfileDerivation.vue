
<script>
import FieldNestedForm from '~/components/form-generator/FieldNestedForm.vue'
import VuexSelect from '~/components/form-generator/masters/AutocompleteVuexSelect.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import { mapState, mapActions } from 'vuex'

const EMPTY_STATE = '__EMPTY_STATE__'

/**
 * Given a list of districts, creates the schema for editing
 * the district derivation settings of a ElementDetail.
 * @param {Array} List of districts
 * @return {FormDenition}
 */
export function getProfileDerivationForm(vm, states = [null]) {
  const fields = {}
  for (let state of states) {
    const stateKey = state ? '' + state : EMPTY_STATE
    fields[stateKey] = {
      label: vm.$t('group'),
      component: VuexSelect,
      model: stateKey,
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
    }
  }
  return fields
}

/**
 *
 */
export default {
  name: 'ProfileDerivation',
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
    states() {
      return this.schema.recordStates || [null]
    },
    ...mapState('masters', ['districts']),
  },
  watch: {
    active() {
      if (this.active) {
        this.validated(true)
      }
    },
  },
  mounted() {
    this.loadSchema()
    this.attachValue()
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
      this.cachedSchema = getProfileDerivationForm(this, this.states)
    },
    loadSchema() {
      this.constructSchema()
      this.attachValue()
    },
    attachValue() {
      this.formModel = this.getModelFromValue()
    },
    getModelFromValue() {
      const value = {}
      if (this.value) {
        this.value.forEach(stateObject => {
          const key =
            stateObject.record_state == RecordState.PENDING_VALIDATE.id
              ? EMPTY_STATE
              : stateObject.record_state
          value[key] = stateObject.group
        })
      }
      return value
    },
    getRequiredFormFields() {
      return this.cachedSchema && this.schema.required
        ? Object.keys(this.cachedSchema)
        : []
    },
    getValue() {
      return Object.entries(this.formModel).map(([key, value]) => {
        return {
          record_state:
            key == EMPTY_STATE ? RecordState.PENDING_VALIDATE.id : key,
          group: value,
          element_detail: this.model.id,
        }
      })
    },
    ...mapActions('masters', { load: 'retrieveDistricts' }),
  },
}
</script>
