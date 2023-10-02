
<script>
import FieldNestedForm from '~/components/form-generator/FieldNestedForm.vue'
import AutocompleteVuexSelect from '~/components/form-generator/masters/AutocompleteVuexSelect.vue'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import { mapState, mapActions } from 'vuex'
const EMPTY_STATE = '__EMPTY_STATE__'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import PolygonCode from '~/components/iris-pages/admin/PolygonCode.vue'

/**
 * Given a list of districts, creates the schema for editing
 * the district derivation settings of a ElementDetail.
 * @param {Array} List of districts
 * @return {FormDenition}
 */
export function getPolygonDerivationForm(vm) {
  const fields = [
    {
      component: VuexSelect,
      model: 'zone',
      storeModule: 'masters',
      storeAction: 'retrieveZones',
      storeAttribute: 'zones',
      optionLabelAttribute: 'description',
      values: [
        {
          id: '1',
          name: 'CARRCENT',
        },
        {
          id: '2',
          name: 'NOU SENYAL VERTICAL',
        },
      ],
      styleClasses: 'col-12 col-lg-6',
      selectOptions: {
        noneSelectedText: vm.$t('form_select_none_selected'),
      },
    },
    {
      type: 'checkbox',
      model: 'districtMode',
      label: 'Modalitat amb districtes',
      styleClasses: 'col-12 col-lg-6',
    },
    {
      type: 'multiform',
      model: 'derivations',
      allowAdd: true,
      draggable: false,
      styleClasses: 'polygon-derivations col-12',
      itemFormDef: new FormDefinition(
        {
          polygon_code: {
            component: PolygonCode,
            label: vm.$t('detail_polygon_code'),
            styleClasses: 'derivation-code',
            required: true,
          },
          group: {
            label: 'Group',
            component: AutocompleteVuexSelect,
            storeModule: 'derivation',
            storeAttribute: 'groupList',
            storeAction: 'loadTree',
            optionLabelAttribute: 'name',
            valueAttribute: 'id',
            required: true,
            resetOnOptionsChange: false,
          },
        },
        {
          fields: ['polygon_code', 'group'],
        }
      ),
    },
  ]

  // validator: VueFormGenerator.validators.integer,
  return fields
}

/**
 * TODO load districts from Store
 */
export default {
  name: 'PolygonDerivation',
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
    this.attachValue()
    this.constructSchema()
  },
  methods: {
    getSchema() {
      return this.cachedSchema
        ? {
            groups: [
              {
                fields: Object.values(this.cachedSchema),
                customLayout: false,
              },
            ],
          }
        : null
    },
    constructSchema() {
      this.cachedSchema = getPolygonDerivationForm(this)
    },
    attachValue() {
      this.formModel = this.getModelFromValue()
    },
    /**
     * Each time a model value changes, this method must be called in order to work
     * both with the v-model approach.
     */
    valueChanged() {
      FieldNestedForm.methods.valueChanged.apply(this)
      if (this.formModel.derivations.length == 0) {
        this.validated(true)
      }
    },
    hasAllRequiredFields() {
      if (this.formModel.derivations.length) {
        if (!this.formModel.zone && !this.formModel.districtMode) {
          return false
        }
        for (const item of this.formModel.derivations) {
          if (item.polygon_code == null || item.group == null) {
            return false
          }
        }
      }
      return true
    },
    getModelFromValue() {
      const value = {}
      if (this.value && this.value.length > 0) {
        value.districtMode = this.value[0].district_mode
        value.zone = this.value[0].zone
        value.derivations = this.value.map(item => {
          return {
            ...item,
            any: item.polygon_code == '_tots',
            code: item.polygon_code,
            group: item.group,
          }
        })
      } else {
        value.derivations = []
      }
      return value
    },
    getValue() {
      return Object.entries(this.formModel.derivations).map(([key, value]) => {
        return {
          record_state: this.state,
          polygon_code: value.any ? '_tots' : value.polygon_code,
          group: value.group,
          zone: this.formModel.zone,
          district_mode: this.formModel.districtMode,
          element_detail: this.model.id,
        }
      })
    },
    ...mapActions('masters', { load: 'retrieveDistricts' }),
  },
}
</script>

<style>
.field-multiform .dropdown-toggle {
  background-color: white;
}
.polygon-derivations table td:first-child {
  width: 140px;
}
.polygon-derivations table td:last-child {
  width: 70px;
}
.field-multiform .derivation-code input[type='text'] {
  max-width: 120px;
}
.field-multiform .derivation-code .field-checkbox {
  padding: 8px;
}
</style>
