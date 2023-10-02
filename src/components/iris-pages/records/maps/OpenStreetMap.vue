<template>
  <div class="record-card-map openstreetmap-container">
    <loader v-if="loading"/>
    <l-map 
      ref="myMap"
      :zoom="zoom" 
      :min-zoom="zoom"
      :center="center"
      class="bcn-map d-flex flex-column-reverse"
      style="height: 80vh" 
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
          :icon-url="marker.icon"
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
import { coordinatesConversor } from '~/assets/js/utils/maps/coordinatesConversor'

// map icon: fix not displayed icon in nuxt
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
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
  },
  props: {
    model: {
      type: Array,
      default: undefined,
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
  },
  data() {
    return {
      loading: true,
      error: null,
      tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      markers: [],
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
      center: state => state.config.CITY_CENTER,
    }),
  },
  watch: {
    async records(val, oldVal) {
      await this.$nextTick()
      this.initialLoad()
      this.loading = false
    },
  },
  mounted() {
    this.initialLoad()
  },
  methods: {
    async initialLoad() {
      await this.load()
      this.$emit('map-ready')
    },
    async load() {
      this.loading = true
      try {
        this.records.forEach((record, index) => {
          this.markers.push({
            id: record.id,
            popup: this.getRecordHtml(record),
            markerLatLng: coordinatesConversor(
              [record.ubication.xetrs89a, record.ubication.yetrs89a],
              this.utmZone
            ),
            icon: this.getRecordIcon(record),
          })
          this.markersAtLoad = index + 1
        })
        this.mapIsReady()
      } catch (e) {
        this.error = e
        this.$emit('map-error')
      }
    },
    mapIsReady() {
      // Hack from https://github.com/vue-leaflet/Vue2Leaflet/issues/96#issuecomment-341459943
      setTimeout(function() {
        window.dispatchEvent(new Event('resize'))
      }, 400)
      this.loading = false
    },
    openPopup(e) {
      e.target.togglePopup()
    },
    getRecordHtml(record) {
      if (record.hoverHtml) {
        return record.hoverHtml
      }
      const link = this.getRecordLink(record)
      return `<strong><a href="${link}">#${
        record.normalized_record_id
      }</a></strong>`
    },
    getRecordLink(record) {
      return this.localePath({
        name: 'backoffice-records-id',
        params: { id: record.normalized_record_id },
        query: { fromList: this.$route.path },
      })
    },
    getRecordIcon(record) {
      const id = record.record_type
        ? record.record_type.id
        : record.record_type_id
      const image = this.types[id % 6].type
      console.log(image, id, record)
      return (
        this.$nuxt.$router.options.base +
        `img/openStreetMarkers/marker-icon_${image}.png`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
