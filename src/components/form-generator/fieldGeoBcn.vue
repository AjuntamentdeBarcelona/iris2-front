<template>
  <div class="geo">
    <div
      v-show="!detail && !loadingDetail"
      class="alert alert-info">
      {{ $t('must_select_detail') }}
    </div>
    <div
      v-show="loadingDetail"
      class="alert alert-info">
      {{ $t('detail_loading') }}
    </div>
    <component
      v-if="showGeoBcn && detail && !loadingDetail"
      :is="formComponent"
      :id="id"
      :value="internalValue"
      :readonly="readonly"
      :select-stair="selectStair"
      :select-door="selectDoor"
      @address-selected="selectAddress"
      @address-deleted="selectAddress" />
    <div
      v-if="districtMode && !loadingDetail"
      class="form-group">
      <label>{{ $t('select_district') }}</label>
      <vuex-select
        :model="districtModel"
        :schema="districtSchema"
        @model-updated="districtUpdated" />
    </div>
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
import { mapState } from 'vuex'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import UbicationForm from '~/components/iris-pages/records/UbicationForm.vue'
import _ from 'lodash'

export default {
  name: 'FieldGeoBcn',
  components: {
    'geo-bcn': GeoBcn,
    VuexSelect,
    UbicationForm,
  },
  mixins: [irisField, abstractField],
  data() {
    return {
      internalValue: null,
      requiredFullAddress: ['official_street_name', 'street2'],
      districtModel: { district: null },
      districtSchema: {
        model: 'district',
        storeModule: 'masters',
        storeAction: 'retrieveDistricts',
        storeAttribute: 'districts',
        optionLabelAttribute: 'name',
        objectValue: true,
        valueAttribute: 'id',
        id: 'district',
        label: this.$t('district'),
        required: false,
        styleClasses: 'col-lg-3',
      },
    }
  },
  computed: {
    id() {
      return this.schema.uid || 'map'
    },
    /**
     * Map state from the create stored.
     */
    ...mapState('create', {
      detail: 'detail',
      loadingDetail: 'loading',
      detailError: 'error',
    }),
    showGeoBcn() {
      return this.requiresFullAddress || !this.onlyDistrict
    },
    showDistrict() {
      return this.onlyDistrict
    },
    noValue() {
      return this.readonly && !this.value
    },
    readonly() {
      return this.schema.readonly
    },
    isMandatory() {
      return this.requiresFullAddress || this.detail.onlyDistrict
    },
    selectStair() {
      return this.schema.selectStair
    },
    selectDoor() {
      return _.get(this.schema, 'selectDoor', true)
    },
    requiresFullAddress() {
      return this.detail && this.detail.requires_ubication
    },
    districtMode() {
      return this.onlyDistrict && !this.requiresFullAddress
    },
    backupMode() {
      return _.get(this.schema, 'backup', false)
    },
    formComponent() {
      return this.backupMode
        ? UbicationForm
        : _.get(this.schema, 'addressComponent', 'geo-bcn')
    },
    onlyDistrict() {
      return (
        this.detail &&
        this.detail.requires_ubication_district &&
        !this.detail.requires_ubication
      )
    },
  },
  watch: {
    detail: {
      handler() {
        this.validate()
      },
      immediate: true,
    },
    loadingDetail() {
      this.validate()
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
      address.stair = this.value.stair
      address.localitzacio = this.value.localitzacio
      this.validate()
    },
    /**
     * Method called each time a district is selected in only district mode.
     * Backend requires an object with all the fields blank, except the district.
     */
    districtUpdated() {
      this.value = {
        ...this.getValueFromGeoAddress({}), // set the blanks
        district: _.get(this.districtModel, 'district.id'), // set the district
      }
      this.validate()
    },
    /**
     * Transform the form value, to the internal GeoBCN value.
     */
    setInternalValue(value) {
      this.internalValue = this.getAddressFromValue()
      this.districtModel = {
        district: {
          id: this.internalValue.district,
        },
      }
    },
    /**
     * Maps this.value to internal geoBcnValue
     */
    getAddressFromValue() {
      return {
        floor: this.value.floor,
        door: this.value.door,
        address: this.value.street,
        street: this.value.street,
        official_street_name: this.value.official_street_name,
        via_type: this.value.via_type,
        stair: this.value.stair,
        number: this.value.street2,
        district: this.value.district,
        localitzacio: {
          x: this.value.xetrs89a,
          y: this.value.yetrs89a,
        },
      }
    },
    /**
     * Transforms a valid GeoBCN address to a valid IRIS2 ubication.
     */
    getValueFromGeoAddress(address) {
      if (this.backupMode) {
        // Backup form data is mapped itself
        return address
      }
      return {
        via_type: _.get(address, 'carrer.tipusVia.nom', ''),
        official_street_name: _.get(address, 'carrer.nom27', ''),
        street: _.get(address, 'carrer.nomLlarg', ''),
        street_code: _.get(address, 'carrer.codi', ''),
        street2: address.numeroPostalInicial,
        letter: address.lletraPostalInicial,
        neighborhood: _.get(address, 'barri.nom', ''),
        neighborhood_b: _.get(address, 'barri.nom', ''),
        neighborhood_id: _.get(address, 'barri.codi', ''),
        district: _.get(address, 'districte.codi', null),
        statistical_sector: address.seccioEst,
        geocode_validation: address.id,
        geocode_district_id: _.get(address, 'districte.codi', ''),
        research_zone: address.seccioCensal,
        floor: address.floor,
        door: address.door,
        stair: address.stair,
        coordinate_x: null,
        coordinate_y: null,
        coordinate_utm_x: null,
        coordinate_utm_y: null,
        latitude: null,
        longitude: null,
        xetrs89a: _.get(address, 'localitzacio.x', null),
        yetrs89a: _.get(address, 'localitzacio.y', null),
        numbering_type: address.tipusNumero,
      }
    },
    /**
     * Validate data bassed on the detail configuration.
     */
    validate() {
      if (!this.detail) {
        this.$emit('validated', false, [this.$t('must_select_detail')], this)
      } else if (this.requiresFullAddress && !this.checkFullAddress()) {
        this.$emit(
          'validated',
          false,
          [this.$t('require_ubication_full_address_error')],
          this
        )
      } else if (this.onlyDistrict && !this.checkDistrictValidation()) {
        this.$emit(
          'validated',
          false,
          [this.$t('require_ubication_district_error')],
          this
        )
      } else {
        this.$emit('validated', true, [], this)
      }
    },
    checkDistrictValidation() {
      return _.get(this.value, 'district', null) != null
    },
    checkFullAddress() {
      for (let field of this.requiredFullAddress) {
        if (_.get(this.value, field, null) == null) {
          return false
        }
      }
      return true
    },
  },
}
</script>

<style lang="scss">
.vue-form-generator .form-group.error .geo .form-group:not(.required) input {
  border-color: rgb(212, 212, 212);
}
</style>
