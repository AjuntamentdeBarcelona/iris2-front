<template>
  <div class="chart-box flex-grow-1">
    <loader v-if="loading"/>

    <div
      v-else-if="!hasChartData && !error"
      class="alert alert-info">
      {{ $t('chart_no_records') }}
    </div>

    <state-doughnut
      v-else-if="data && !error && hasChartData"
      :state-count="data"
      class="my-3 mx-2"/>

    <div
      v-if="!loading && data"
      class="chartfooter"
    >
      <div class="chartfooter-item">
        <div class="chartfooter-number">
          {{ data.average_close_days|def }}
        </div>
        <div class="chartfooter-itemDescription">
          {{ $t('average_close_days') }}
        </div>
      </div>
      <div class="chartfooter-item">
        <div class="chartfooter-number">
          {{ data.entries|def }}
        </div>
        <div class="chartfooter-itemDescription">
          {{ $t('record_card_entries') }}
        </div>
      </div>
      <div class="chartfooter-item">
        <div class="chartfooter-number">
          {{ data.average_age_days|def }}
        </div>
        <div class="chartfooter-itemDescription">
          {{ $t('average_age_days') }}
        </div>
      </div>
      <div class="chartfooter-item">
        <div class="chartfooter-number">
          {{ data.pending_records|def }}
        </div>
        <div class="chartfooter-itemDescription">
          {{ $t('pending_record_stock') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StateDoughnut from './StateDoughnut.vue'
import Loader from '~/components/utils/Loader'
import _ from 'lodash'
import { CancelToken } from 'axios'

export default {
  name: 'ProfileMonthActivity',
  components: {
    StateDoughnut,
    Loader,
  },
  props: {
    date: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      data: null,
      error: false,
      cancelToken: null,
    }
  },
  computed: {
    chartKeys() {
      return [
        'pending_validation',
        'processing',
        'cancelled',
        'closed',
        'external_processing',
      ]
    },
    hasChartData() {
      if (!this.data) {
        return false
      }
      for (let key of this.chartKeys) {
        if (this.data[key] > 0) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    date: {
      handler(val, oldVal) {
        this.loading = true
        this.debouncedLoadData()
      },
    },
  },
  created() {
    this.debouncedLoadData = _.debounce(this.loadData, 1000)
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.loading && this.cancelToken) {
        this.cancelToken.cancel()
      }
      this.cancelToken = CancelToken.source()
      this.loading = true

      this.$axios
        .get(this.getRequestUrl(), {
          cancelToken: this.cancelToken.token,
        })
        .then(response => {
          this.data = response.data
          this.error = false
        })
        .catch(() => {
          this.error = true
        })
        .then(() => {
          this.loading = false
        })
    },
    getRequestUrl() {
      const today = new Date(),
        month = today.getUTCMonth() + 1,
        year = today.getFullYear()

      return `/api/record_cards/record_cards/month-summary/${this.date.year}/${
        this.date.month
      }/`
    },
  },
}
</script>

<style lang="scss">
.chart-box {
  display: flex;
  flex-direction: column;
}
.chartfooter {
  margin-top: auto;
  width: 100%;
  border-top: 2px solid $gray-300;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  &-item {
    flex: 0 1 25%;
    display: flex;
    align-items: center;
    padding: 1rem;
  }
  &-number {
    font-size: 2.5rem;
    line-height: 1em;
    font-weight: 300;
  }
  &-itemDescription {
    text-transform: uppercase;
    margin-top: auto;
    padding: 0.5rem 0rem 0.5rem 0.25rem;
  }
}
</style>

<style lang="scss" scoped>
/deep/ .loader.irisbox {
  height: 100%;
  margin-bottom: 0;
  .loading-overlay {
    display: flex;
    align-items: center;
  }
}
</style>
