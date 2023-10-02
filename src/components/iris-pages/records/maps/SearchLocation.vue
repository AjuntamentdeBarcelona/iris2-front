<template>
  <div>
    <div class="search-location_container">
      <input
        v-model="streetName"
        :placeholder="$t('street')"
        type="text"
        class="form-control col-sm-3"
      >
      <input
        v-model="streetNumber"
        :placeholder="$t('answer_address_number_placeholder')"
        type="text"
        class="form-control col-sm-2"
        @input="updateStreetNumber"
      >
      <input 
        v-model="postCode"
        :placeholder="$t('postal_code')"
        type="text"
        class="form-control col-sm-2"
      >
      <button 
        class="btn btn-outline btn-primary"
        @click="debouncedSearchStreet"
      > {{ $t(label) }}
      </button>
    </div>
    <div class="search-location_container">
      <div 
        v-if="loading"
        key="search-loading"
        class="alert alert-info col-12">
        {{ $t('loading') }}
      </div>
      <div 
        v-if="error" 
        key="search-error"
        class="alert alert-warning col-12">
        {{ $t('search_address_not_found') }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchStreet } from '~/assets/js/utils/maps/mapSearch.js'
import { debounce } from 'lodash'

export default {
  name: 'SearchLocation',
  props: {
    location: {
      type: Object,
      default: () => {
        return {}
      },
    },
    label: {
      type: String,
      default: 'search',
    },
  },
  data() {
    return {
      streetNumber: this.location.streetNumber,
      streetName: this.location.streetName,
      postCode: this.location.postCode,
      value: this.location,
      error: false,
      loading: false,
    }
  },
  computed: {
    ...mapState({
      city: state => state.config.CITY_MAP,
      province: state => state.config.PROVINCIA || state.config.CITY_MAP,
    }),
    changedStreet() {
      return this.value.streetName != this.streetName
    },
    numberChanged() {
      return this.value && this.value.street2 != this.streetNumber
    },
  },
  watch: {
    location: function() {
      this.streetType = this.location.streetType
      this.streetNumber = this.location.streetNumber
      this.streetName = this.location.streetName
      this.postCode = this.location.postCode
      this.value = this.location
    },
  },
  created() {
    this.debouncedSearchStreet = debounce(this.searchStreet, 400)
  },
  methods: {
    async searchStreet() {
      this.loading = true
      this.error = false
      const newPoint = await searchStreet(
        this.$axios,
        this.streetNumber || '',
        this.streetName || '',
        this.postCode,
        this.city,
        this.province
      )
      this.loading = false
      this.error = newPoint.length == 0
      this.value = newPoint[0]
      if (this.value) {
        this.$emit('addNewPoint', {
          ...newPoint[0],
          streetName: this.value.street,
          streetNumber: this.value.street2 || 0,
          postCode: this.value.address.postcode,
        })
      }
    },
    updateStreetNumber() {
      if (this.numberChanged) {
        this.debouncedSearchStreet()
      }
    },
  },
}
</script>

<style>
.search-location_container {
  display: flex;
  margin-bottom: 5px;
}
.search-location_container select {
  height: 3.2em;
}
.search-location_container input {
  height: 3.2em;
}
</style>
