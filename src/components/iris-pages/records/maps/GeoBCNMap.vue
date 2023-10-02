<template>
  <!-- <component :is="component" /> -->
  <div
    :id="divMapId"
    class="bcn-map d-flex flex-column-reverse"
  />
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    types: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      divMapId: 'pointer-map',
      map: null,
      pointersAdded: [],
      loadingMap: true,
    }
  },
  computed: {},
  watch: {
    async records(val, oldVal) {
      if (this.map) {
        await this.$nextTick()
        this.resetPointers()
        this.renderPointers()
      }
    },
  },
  mounted() {
    this.loadMap()
  },
  methods: {
    ...mapActions('geobcn', ['geoBCN']),
    async loadMap() {
      try {
        await this.geoBCN()
        this.map = await this.initMap()
        this.$emit('map-ready')
        this.initMapHover()
        this.renderPointers()
      } catch (error) {
        this.$emit('map-error')
      } finally {
        this.loadingMap = false
      }
    },
    async initMap() {
      const map = new geoBCN.Map({
        divId: this.divMapId,
        fons: ['BAS'],
        eines: ['ZOOM', 'ROTACIO', 'ESCALIMETRE'],
        rotacio: 44.400000007,
      })
      await this.$nextTick()
      $('.geobcn-rotacio-tornar').click()
      return map
    },
    initMapHover() {
      this.map.olMap.on('pointermove', evt => {
        let feature = this.map.olMap.forEachFeatureAtPixel(evt.pixel, function(
          feature,
          layer
        ) {
          return feature
        })
        if (feature) {
          if (feature.record) {
            this.map.mostraHoverPopup({
              localitzacio: {
                x: feature.record.ubication.xetrs89a,
                y: feature.record.ubication.yetrs89a,
              },
              offsetY: -36,
              offsetX: -1,
              html: feature.hoverHtml,
            })
          }
        }
      })
    },
    renderPointers() {
      this.pointersAdded = []
      this.records.forEach(rc => {
        const pointerAdded = this.map.afegeixMarcador({
          urlIcona: this.getRecordIcon(rc),
          localitzacio: {
            x: rc.ubication.xetrs89a,
            y: rc.ubication.yetrs89a,
          },
        })
        pointerAdded.record = rc
        pointerAdded.hoverHtml = rc.hoverHtml
        this.pointersAdded.push(pointerAdded)
      })
    },
    resetPointers() {
      if (this.pointersAdded.length) {
        this.pointersAdded.forEach(pointer => {
          this.map.esborraMarcador(pointer)
        })
      }
    },
    getRecordIcon(record) {
      const id = record.record_type
        ? record.record_type.id
        : record.record_type_id
      const image = this.types[id % 6].type
      return `/img/markers/marker_${image}.png`
    },
    getRecordHtml(record) {
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
  },
}
</script>
