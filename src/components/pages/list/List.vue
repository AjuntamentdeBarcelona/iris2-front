<template>
  <div
    :class="{ loading: loading }"
    class="list"
  >
    <unauthorized-page v-if="!isAuthorized" />
    <slot
      v-if="isAuthorized"
      name="head"
    />
    <div
      v-if="isAuthorized"
      class="list-content"
    >
      <slot
        v-for="item in items"
        :item="item"
        name="list-items"
      />
    </div>
    <slot
      v-if="isEmpty && !loading"
      name="empty">
      {{ emptyMessage }}
    </slot>
    <slot
      v-if="isAuthorized"
      name="footer"
    />
    <div
      v-if="loading"
      class="loading-overlay"
    >
      <div class="loader" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Event from 'event-stream'
import '~/assets/css/loading.scss'
import { CancelToken } from 'axios'
import axios from 'axios'
import qs from 'qs'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'
import UnauthorizedPage from '~/components/pages/authorization/UnauthorizedPage.vue'

Vue.use(Event)

/**
 * Vue Component for creating list view. You can override the different slots provided for giving a custom template.
 */
export default {
  layout: 'backoffice',
  components: {
    UnauthorizedPage,
  },
  mixins: [AuthorizationMixin],
  props: {
    url: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    queryParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
    loadOnMount: {
      type: Boolean,
      default: true,
    },
    emptyMessageKey: {
      type: String,
      default: 'list_emtpy_message_2',
    },
  },
  data: function() {
    let self = this
    return {
      loading: true,
      items: [],
      detailUrl: null,
      cancelToken: null,
      error: false,
    }
  },
  head() {
    return {
      title: 'IRIS: ' + this.title,
    }
  },
  computed: {
    emptyMessage() {
      return this.$t(this.emptyMessageKey)
    },
    isEmpty() {
      return this.items.length == 0
    },
    hasActions() {
      return this.detailUrl != null
    },
    pageTitle() {
      return this.$t(this.title) ? this.$t(this.title) : this.title
    },
  },
  mounted() {
    if (this.loadOnMount) {
      this.loadItems()
    }
  },
  methods: {
    loadItems() {
      this.loading = true
      this.$emit('loading', true)
      this.getData().then(response => {
        if (response) {
          this.items = response.data
        }
        this.loading = false
        this.$emit('loading', false)
        this.afterLoad()
      })
    },
    refresh() {
      this.loadItems()
    },
    afterLoad() {
      this.$emit('loaded', this.items)
    },
    getData(data) {
      return this.performRequest(this.getUrl(), this.getRequestParams(data))
    },
    getUrl() {
      return this.url
    },
    getRequestParams(data) {
      return Object.assign(
        {},
        data,
        this.queryParams,
        this.getExtraQueryParams()
      )
    },
    getExtraQueryParams() {},
    performRequest(url, filterData) {
      this.loading = true
      if (this.loading && this.cancelToken) {
        this.cancelToken.cancel()
        this.error = false
      }
      this.cancelToken = CancelToken.source()
      const promise = this.$axios
        .get(url, {
          params: filterData,
          paramsSerializer: function(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          },
          cancelToken: this.cancelToken.token,
        })
        .then(res => {
          this.loading = false
          return {
            data: this.processResults(res.data.results || res.data),
            count: res.data.results ? res.data.count : res.data.length,
          }
        })
      promise
        .catch(e => {
          if (!axios.isCancel(e)) {
            this.error = true
            this.loading = false
          }
          this.onError(e.response, filterData)
        })
        .then(result => {
          this.cancelToken = null
          return result
        })
      return promise
    },
    onError(res, filterData) {},
    processResults(data) {
      return data
    },
    getDetailUrl(row) {
      return Object.assign({}, this.detailUrl, {
        params: { ...this.detailUrl.params, id: row.id },
      })
    },
  },
}
</script>

<style>
.VueTables__date-filter {
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
}

.add {
  margin-bottom: 10px;
}

.list {
  min-height: 210px;
}
</style>
