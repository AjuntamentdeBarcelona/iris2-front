<template>
  <div class="record-card-map openstreetmap-container">
    <search-location 
      :location="location"
      @addNewPoint="addPoint"
      @newNumber="newNumber"
    />
    <div class="row">
      <div 
        v-if="selectDoor"
        class="form-group col-3">
        <label for="door"><span>{{ $t('Door') }}</span></label>
        <div class="field-wrap">
          <input 
            :placeholder="$t('Door')" 
            v-model="door" 
            type="text" 
            class="form-control"
            @change="newNumber(location)">
        </div>
      </div>
      <div 
        v-if="selectStair"
        class="form-group col-3">
        <label for="stair"><span>{{ $t('Stair') }}</span></label>
        <div class="field-wrap">
          <input 
            :placeholder="$t('Stair')" 
            v-model="stair" 
            type="text" 
            class="form-control"
            @change="newNumber(location)">
        </div>
      </div>
      <div 
        v-if="selectDoor"
        class="form-group col-3">
        <label for="floor"><span>{{ $t('Floor') }}</span></label>
        <div class="field-wrap">
          <input 
            :placeholder="$t('Floor')" 
            v-model="floor" 
            type="text" 
            class="form-control"
            @change="newNumber(location)">
        </div>
      </div>
    </div>
    <loader v-if="loading"/>
    <l-map 
      ref="myMap"
      :zoom="zoom" 
      :min-zoom="zoom"
      :center="center"
      :marker-zoom-animation="true"
      class="bcn-map d-flex flex-column-reverse"
      style="height: 50vh" 
      @click="takePosition"
      @ready="mapIsReady"
    >
      <l-tile-layer 
        :url="tileLayerUrl" 
        :attribution="attribution" 
      />
      <l-marker 
        v-for="(marker, index) in markers"
        :key="index"
        :lat-lng="marker.markerLatLng"
        @mouseover="openPopup"
      >
        <l-icon 
          :icon-url="icon"
        />
        <l-popup 
          :content="marker.popup"
          :options="options"
        />
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import Loader from '~/components/utils/Loader'
import { mapState } from 'vuex'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import SearchLocation from './SearchLocation.vue'
import { searchStreetReverse } from '~/assets/js/utils/maps/mapSearch.js'

// map icon: fix not displayed icon in nuxt
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'OpenStreetMap',
  components: {
    Loader,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    Icon,
    SearchLocation,
  },
  props: {
    refresh: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Array,
      default: undefined,
    },
    initial: {
      type: Object,
      default() {
        return {}
      },
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/pending-validation/',
    },
    types: {
      type: Object,
      default: null,
    },
    records: {
      type: Array,
      default: () => [],
    },
    selectStair: {
      type: Boolean,
      default: false,
    },
    selectDoor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      initialLocation: {},
      location: {},
      loading: true,
      error: null,
      tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      markers: [],
      door: '',
      stair: '',
      floor: '',
      markersAtLoad: 0,
      icon: '',
      options: {
        offset: [0.5, -25],
      },
    }
  },
  computed: {
    ...mapState({
      utmZone: state => state.config.UTM_ZONE || 31,
      defaultCenter: state => state.config.CITY_CENTER,
    }),
    center() {
      if (this.markers.length) {
        return this.markers[0].markerLatLng
      }
      return this.defaultCenter
    },
  },
  watch: {
    refresh: function(newVal, oldVal) {
      this.mapIsReady()
    },
  },
  mounted() {
    this.initialLoad()
    this.getInitialLocation()
  },
  methods: {
    async initialLoad() {
      this.load()
      this.$emit('map-ready')
    },
    mapIsReady() {
      // Hack from https://github.com/vue-leaflet/Vue2Leaflet/issues/96#issuecomment-341459943
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'))
      }, 400)
      this.loading = false
    },
    /**
     * @todo remove
     */
    load() {
      this.loading = true
    },
    async getInitialLocation() {
      this.icon =
        this.$nuxt.$router.options.base +
        'img/openStreetMarkers/marker-icon_body.png'
      if (!this.initial.street) {
        return
      }
      this.location = {
        ...this.initial,
        ...this.location,
        streetType: this.initial.via_type,
        streetNumber: this.initial.street2,
        streetName: this.initial.street,
        postCode: this.initial.postal_code,
        district: null,
      }
      this.setMarker(this.location)
    },
    async addPoint(addNewPoint) {
      const newMarkerPoint = addNewPoint
      newMarkerPoint.markerLatLng = [newMarkerPoint.lat, newMarkerPoint.lon]
      newMarkerPoint.record_type_id = Math.random() * 100
      newMarkerPoint.popup = `<strong><a href="#">#${
        newMarkerPoint.display_name
      }</a></strong>`
      this.icon = this.icon =
        this.$nuxt.$router.options.base +
        'img/openStreetMarkers/marker-icon_body.png'
      this.markers.pop()
      this.markers.push(newMarkerPoint)
      this.setMarker(newMarkerPoint)
    },
    async takePosition(e) {
      const addressToShow = await searchStreetReverse(
        this.$axios,
        e.latlng.lat,
        e.latlng.lng
      )
      this.setMarker(addressToShow)
    },
    setMarker(addressToShow) {
      this.markers.pop()
      this.markers.push({
        id: Math.random() * 100,
        popup: `<strong>
          ${addressToShow.street} ${addressToShow.street2 || ''} 
          (${addressToShow.address ? addressToShow.address.postcode : ''})
          </strong>`,
        markerLatLng: {
          lat: addressToShow.latitude,
          lon: addressToShow.longitude,
        },
      })
      this.icon = this.icon =
        this.$nuxt.$router.options.base +
        'img/openStreetMarkers/marker-icon_body.png'
      this.location = {
        ...this.location,
        ...addressToShow,
        street2: addressToShow.street2 || 0,
        streetNumber: addressToShow.street2 || 0,
        streetType: addressToShow.type,
        streetName: addressToShow.street,
        postCode: addressToShow.postal_code,
        district: null,
        door: this.door,
        stair: this.stair,
        floor: this.floor,
      }
      this.$emit('location', this.location)
    },
    newNumber(value) {
      this.location = {
        ...value,
        door: this.door,
        stair: this.stair,
        floor: this.floor,
      }
      this.$emit('location', this.location)
    },
    openPopup(e) {
      e.target.togglePopup()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
