<template>
  <div class="record-ubication">
    <div
      v-if="loadingDetail"
      class="alert alert-info">
      {{ $t('detail_loading') }}
    </div>
    <div
      v-else-if="!detail"
      class="alert alert-info">
      {{ $t('must_select_detail') }}
    </div>
    <div
      v-else-if="districtMode"
      class="form-group">
      <label>{{ $t('select_district') }}</label>
      <vuex-select
        :model="districtModel"
        :schema="districtSchema"
        @model-updated="districtUpdated" />
    </div>
    <ubication-form
      v-else-if="backupMode"
      :select-stair="selectStair"
      :select-door="selectDoor" 
      @address-selected="selectAddress"
      @address-deleted="selectAddress"
    />
    <OpenStreetMapSearch 
      v-else
      :initial="value" 
      :refresh="active" 
      :select-stair="selectStair"
      :select-door="selectDoor"
      @location="onChanged"
    />
  </div>
</template>

<script>
import irisField from '~/components/form-generator/irisField.js'
import { abstractField } from 'vue-form-generator'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import UbicationForm from '~/components/iris-pages/records/UbicationForm.vue'
import { mapState } from 'vuex'
import OpenStreetMapSearch from './OpenStreetMap_search.vue'

/**
 * Receives Ubication.
 */
export default {
  components: {
    OpenStreetMapSearch,
    VuexSelect,
    UbicationForm,
  },
  mixins: [irisField, abstractField],
  props: {
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
  },
  data() {
    return {
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
    ...mapState('create', {
      detail: 'detail',
      loadingDetail: 'loading',
      detailError: 'error',
    }),
    selectStair() {
      return this.schema.selectStair
    },
    selectDoor() {
      return _.get(this.schema, 'selectDoor', true)
    },
    onlyDistrict() {
      return (
        this.detail &&
        this.detail.requires_ubication_district &&
        !this.detail.requires_ubication
      )
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
  methods: {
    onChanged(value) {
      this.value = value
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
      console.log(this.value)
      for (let field of this.requiredFullAddress) {
        if (
          _.get(this.value, field, null) === '' ||
          _.get(this.value, field, null) === null
        ) {
          return false
        }
      }
      return true
    },
    /**
     * Method called each time a district is selected in only district mode.
     * Backend requires an object with all the fields blank, except the district.
     */
    districtUpdated() {
      this.value = {
        district: _.get(this.districtModel, 'district.id'), // set the district
      }
      this.validate()
    },
    selectAddress(address) {
      this.value = address
      this.validate()
    },
  },
}
</script>

<style>
</style>
