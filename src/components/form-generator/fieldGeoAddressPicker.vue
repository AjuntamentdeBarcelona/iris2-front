<template>
  <div class="geo geo-adress-picker">
    <geo-bcn
      v-if="showGeoBcn"
      id="address-map"
      :value="internalValue"
      :readonly="readonly"
      :select-stair="true"
      @address-selected="selectAddress"
      @address-deleted="selectAddress" />
    <div
      v-if="noValue"
      class="alert alert-info">
      {{ $t('record_card_no_ubication') }}
    </div>
  </div>
</template>


<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import GeoBcn from '~/components/forms/GeoBcn.vue'
import _ from 'lodash'

export default {
  name: 'FieldGeoAdressPicker',
  components: {
    'geo-bcn': GeoBcn,
  },
  mixins: [irisField, abstractField],
  data() {
    return {
      internalValue: null,
    }
  },
  computed: {
    showGeoBcn() {
      return this.requiresFullAddress || !this.onlyDistrict
    },
    noValue() {
      return this.readonly && !this.value
    },
    readonly() {
      return this.schema.readonly
    },
  },
  created() {
    if (this.value) {
      this.setInternalValue(this.value)
    }
  },
  methods: {
    /**
     * Validates and updates each time the external model, mantained by the
     * parent form, is updated.
     */
    modelUpdated(value) {
      this.value = value
      this.validate()
    },
    /**
     * Selects a GeoBCN address.
     */
    selectAddress(address) {
      this.internalValue = address
      this.value = address ? this.getValueFromGeoAddress(address) : null
      // Extend the original object with the custom data
      address.address = this.value.address
      address.number = this.value.address
      address.floor = this.value.floor
      address.door = this.value.door
      address.localitzacio = this.value.localitzacio
      this.validate()
    },
    /**
     * Transform the form value, to the internal GeoBCN value.
     */
    setInternalValue(value) {
      this.internalValue = this.getAddressFromValue()
    },
    /**
     * Maps this.value to internal geoBcnValue
     */
    getAddressFromValue() {
      return {
        floor: this.value.floor,
        door: this.value.door,
        stair: this.value.stair,
        address: this.value.address,
        number: this.value.number,
      }
    },
    /**
     * Transforms a valid GeoBCN address to a valid IRIS2 ubication.
     */
    getValueFromGeoAddress(address) {
      return {
        via_type: _.get(address, 'carrer.tipusVia.nom', null),
        address: _.get(address, 'carrer.nom27', null),
        street: _.get(address, 'carrer.nomComplet', null),
        number: address.numeroPostalInicial,
        letter: address.lletraPostalInicial,
        neighborhood: _.get(address, 'barri.nom', null),
        district: _.get(address, 'districte.codi', null),
        statistical_sector: address.seccioEst,
        geocode_validation: address.id,
        geocode_district_id: _.get(address, 'districte.codi', null),
        research_zone: address.seccioCensal,
        floor: address.floor,
        door: address.door,
        stair: address.stair,
        numbering_type: address.tipusNumero,
        postal_district: '080' + address.districtePostal,
      }
    },
    /**
     * Validate data bassed on the detail configuration.
     */
    validate() {
      this.$emit('validated', true, [], this)
    },
  },
}
</script>
