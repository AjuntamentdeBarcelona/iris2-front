<script>
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { validators } from 'vue-form-generator'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import { isPlainObject } from 'lodash'
import { mapState } from 'vuex'
import UbicationField from '~/components/iris-pages/records/maps/UbicationField.vue'

export function getLetterDefinition(vm) {
  return new FormDefinition(
    {
      geo_bcn: {
        uid: 'geo_bcn_address',
        component: UbicationField,
      },
      via_type: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_type'),
        placeholder: vm.$t('answer_address_type_placeholder'),
        styleClasses: 'col-3 col-lg-2',
        required: true,
        min: 1,
        max: 10,
        validator: validators.string.locale(),
      },
      number: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_number'),
        placeholder: vm.$t('answer_address_number_placeholder'),
        styleClasses: 'col-3 col-lg-2',
        required: true,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      stair: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_stair'),
        placeholder: vm.$t('answer_address_stair'),
        styleClasses: 'col-3 col-lg-2',
        required: false,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      floor: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_floor'),
        placeholder: vm.$t('answer_address_floor'),
        styleClasses: 'col-3 col-lg-2',
        required: false,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      door: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_door'),
        placeholder: vm.$t('answer_address_door'),
        styleClasses: 'col-3 col-lg-2',
        required: false,
        min: 1,
        max: 20,
        validator: validators.string.locale(),
      },
      municipality: {
        uid: 'municipality',
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_municipality'),
        placeholder: vm.$t('answer_address_municipality'),
        styleClasses: 'col-6 col-lg-4',
        required: true,
        min: 3,
        max: 30,
        validator: validators.string.locale(),
      },
      province: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_province'),
        placeholder: vm.$t('answer_address_province'),
        styleClasses: 'col-6 col-lg-4',
        required: true,
        min: 3,
        max: 30,
        validator: validators.string.locale(),
      },
      postal_code: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address_postal_code'),
        placeholder: vm.$t('answer_address_number_placeholder'),
        styleClasses: 'col-3 col-lg-2',
        required: true,
        min: 5,
        max: 10,
        validator: validators.string.locale(),
      },
      address_mobile_email: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('answer_address'),
        placeholder: vm.$t('answer_address'),
        styleClasses: 'col-12 col-lg-6',
        required: true,
        min: 3,
        max: 200,
        validator: validators.string.locale(),
      },
    },
    {
      groups: [
        {
          fields: [
            'municipality',
            'province',
            'via_type',
            'address_mobile_email',
            'number',
            'postal_code',
            'stair',
            'floor',
            'door',
          ],
        },
      ],
    }
  )
}

/**
 * Form component for editing the address for sending a RecordCard answer.
 * This form can work in two modes:
 * - Barcelona: for letters inside the BCN municipality. Address is selected with GeoBCN.
 * - Others: the different address fields must filled manually
 *
 * This means that all the forms is presented based on the municipality value, so the first
 * step is to select Barcelona or introduce a municipality manually. The adaptation is made
 * inside the after update method, which is meant for this kind of requirements in a SchemaForm.
 */
export default {
  name: 'RecordAddressForm',
  extends: SchemaForm,
  props: {
    showBox: {
      type: Boolean,
      default: false,
    },
    isGeoBcn: {
      type: Boolean,
      default: false,
    },
    backup: {
      type: Boolean,
      default: false,
    },
    externalErrors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      geoBCNLayout: ['geo_bcn'],
      otherLayout: [
        {
          fields: ['via_type', 'address_mobile_email', 'number'],
        },
        {
          fields: ['stair', 'floor', 'door', 'postal_code'],
        },
        {
          fields: ['municipality', 'province'],
        },
      ],
    }
  },
  computed: {
    ...mapState({
      municipality: state => state.config.CITY_MAP,
      province: state => state.config.PROVINCIA || state.config.CITY_MAP,
    }),
    categorizedExternalErrors() {
      return this.externalErrors.reduce(this.reduceExternalErrors, {
        globalErrors: [],
        nonGlobalErrors: [],
      })
    },
  },
  watch: {
    isGeoBcn: {
      handler(newVal, oldVal) {
        // Reset form values if mode changes
        const geoBcnValue = this.model.municipality == this.municipality
        if (newVal != oldVal && geoBcnValue != newVal) {
          Object.assign(this.model, {
            address_mobile_email: '',
            floor: '',
            number: '',
            door: '',
            stair: '',
            postal_code: '',
            geo_bcn: {},
          })
        }
        this.adjustFormMode()
        if (this.isGeoBcn) {
          this.model.municipality = this.municipality
          this.model.province = this.province
        } else if (geoBcnValue) {
          this.model.municipality = ''
          this.model.province = ''
        }
        this.model.is_geo_bcn = this.isGeoBcn
      },
      immediate: true,
    },
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
    applyInitialTransformation(initial) {
      initial.geo_bcn = {
        address: initial.address_mobile_email,
        ...initial,
        geo_bcn: undefined,
      }

      return initial
    },
    /**
     * Adjust schema for setting field uids
     */
    adaptSchema(schemaDef) {
      schemaDef.setAllUid()
    },
    /**
     * Each time the model is updated we must inspect data for adjusting mode.
     */
    afterUpdate() {
      // this.adjustMunicipalityValues()
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
     * Ensure the consistency of the differents value of municipality.
     */
    adjustMunicipalityValues() {
      if (
        !this.isGeoBcn &&
        this.model.municipality == this.geoBcnMunicipality
      ) {
        Object.assign(this.model, { is_geo_bcn: true })
        this.emitModelUpdated(this.model, {})
      }
    },
    adjustFormMode() {
      this.isGeoBcn ? this.setGeoBCNMode() : this.setDefaultMode()
    },
    /**
     * Flat data from geoBcn, mapping to the normal letter fields.
     * @return {Object} Mapped letter attributes from geoBcn
     */
    getSaveData(model) {
      const geoAdress = this.model.geo_bcn
      if (!_.isEmpty(geoAdress) && this.isGeoBcn) {
        const postcode = geoAdress.address.postcode
        console.log("UPDATED'")
        return {
          address_mobile_email: geoAdress.street,
          number: geoAdress.street2,
          floor: geoAdress.floor,
          door: geoAdress.door,
          via_type: geoAdress.via_type,
          stair: geoAdress.stair,
          postal_code: postcode,
        }
      }
      return {}
    },
    setGeoBCNMode() {
      this.schemaDef.layout = {
        groups: [
          {
            fields: this.geoBCNLayout,
          },
        ],
      }
    },
    setDefaultMode() {
      Object.assign(this.model, { geo_bcn: null })
      this.schemaDef.layout = {
        groups: this.otherLayout,
      }
    },
    /**
     * Emit the validated method.
     */
    validated(valid, errors) {
      this.valid = valid
      this.$emit('validated', valid, errors, this.$refs.form)
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
