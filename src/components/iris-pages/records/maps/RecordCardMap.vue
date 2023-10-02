<template>
  <div class="record-card-map">
    <loader v-if="loadingMap || loading"/>
    <http-error
      v-else-if="error"
      :error="error"
      class="col-12" />
    <p
      v-else-if="!eligibleRecordCards.length"
      class="alert alert-info"
      v-text="$t(isSingleModel ? 'record_cards_map_no_eligible_rc': 'record_cards_map_no_eligible_rcs')"
    />
    <p
      v-else-if="mapLoadError"
      class="alert alert-danger"
      v-text="$t('record_cards_map_no_map')"
    />
    <div
      v-show="eligibleRecordCards.length"
    >
      <strong v-if="!isSingleModel">{{ recordMessage }}</strong>
      <component 
        :is="mapInstance"
        :types="types"
        :records="eligibleRecordCards"
        @map-ready="setMapReady"
        @map-error="setMapError"
      />
      <div 
        id="bcn-legend"
      >
        <div class="mt-1">
          <span
            v-for="type in sortedTypes"
            :key="type.type"
            class="p-1"
          >
            <span
              :style="{'background-color': type.color, width: '20px', height: '20px' }"
              class="d-inline-block"
            />
            <span
              v-text="type.description"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/utils/Loader'
import HttpError from '~/components/pages/HttpError.vue'
import { mapState } from 'vuex'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'
import qs from 'qs'
import OpenStreetMap from './OpenStreetMap.vue'
import GeoBCNMap from './GeoBCNMap.vue'

/**
 * Receives either an array of RecordCard's or an url + queryFilters to retrieve an array of RecordCard's
 */
export default {
  name: 'RecordCardMap',
  components: {
    Loader,
    HttpError,
    OpenStreetMap,
    GeoBCNMap,
  },
  props: {
    model: {
      type: Array,
      default: undefined,
    },
    url: {
      type: String,
      default: '',
    },
    queryFilters: {
      type: Object,
      default: () => ({}),
    },
    isSingleModel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingMap: true,
      pointersAdded: [],
      records: this.model || [],
      loading: false,
      error: null,
      types: {
        0: {
          type: 'danger',
          description: this.$t('types_type_issue'),
          color: '#E03E47',
        },
        1: {
          type: 'warning',
          description: this.$t('types_type_complaint'),
          color: '#ED8F3D',
        },
        2: {
          type: 'primary',
          description: this.$t('types_type_suggestion'),
          color: '#1F5777',
        },
        3: {
          type: 'success',
          description: this.$t('types_type_gratitude'),
          color: '#319494',
        },
        4: {
          type: 'body',
          description: this.$t('types_type_service_rq'),
          color: '#6F94CF',
        },
        5: {
          type: 'info',
          description: this.$t('types_type_query'),
          color: '#1297E6',
        },
      },
      openStreet_Map: true,
    }
  },
  computed: {
    ...mapState({
      cityMap: state => state.config.CITY_MAP,
    }),
    mapInstance() {
      const componentName =
        this.cityMap === 'Barcelona' ? 'GeoBCNMap' : 'OpenStreetMap'
      return () => import(`./${componentName}`)
    },
    eligibleRecordCards() {
      let unique = []
      this.records.forEach(rc => {
        if (rc.ubication && rc.ubication.xetrs89a && rc.ubication.yetrs89a) {
          const near = unique.filter(u => {
            return (
              Math.abs(rc.ubication.xetrs89a - u.ubication.xetrs89a) < 0.0001 &&
              Math.abs(rc.ubication.yetrs89a - u.ubication.yetrs89a) < 0.0001
            )
          })
          if (near.length) {
            near[0].hoverHtml += '</br>' + this.getRecordHtml(rc)
          } else {
            rc.hoverHtml = this.getRecordHtml(rc)
            unique.push(rc)
          }
        }
      })
      return unique
    },
    eligibleRecordCardsPointers() {
      return this.eligibleRecordCards.map(rc => ({
        localitzacio: {
          x: rc.ubication.xetrs89a,
          y: rc.ubication.yetrs89a,
        },
      }))
    },
    mapLoadError() {
      return !this.map && !this.loadingMap
    },
    sortedTypes() {
      return Object.values(this.types).sort(compareFnByDescriptionAsc)
    },
    recordMessage() {
      return this.getRecordMessage(
        this.eligibleRecordCards.length,
        this.records.length
      )
    },
  },
  mounted() {
    this.initialLoad()
  },
  methods: {
    async initialLoad() {
      if (!this.model) {
        await this.load()
      }
    },
    async load() {
      this.loading = true
      try {
        const resp = await this.$axios.get(this.url, {
          params: {
            ...this.queryFilters,
            null_ubication: 0,
            map: 1,
            page_size: undefined,
            page: undefined,
          },
          paramsSerializer: function(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          },
        })
        this.records = resp.data.results || []
      } catch (e) {
        this.error = e
      }
      this.loading = false
    },
    setMapReady() {
      this.loadingMap = false
      this.map = true
    },
    setMapError() {
      this.map = false
      this.loadingMap = false
      this.error = new Error()
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
    getRecordMessage(current, count) {
      if (current == count) {
        return this.$t('record_cards_map_showing_all').replace(
          '{current}',
          current
        )
      }
      return this.$t('record_cards_map_showing_part')
        .replace('{current}', current)
        .replace('{count}', count)
    },
  },
}
</script>

<style lang="scss" scoped>
.bcn-map {
  height: 80vh;
}

.alert {
  font-size: 1.1em;
}
</style>
