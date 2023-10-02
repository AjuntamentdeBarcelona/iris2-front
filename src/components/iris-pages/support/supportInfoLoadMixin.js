import { supportEndpoint } from '~/assets/js/iris2/constants'
import { CancelToken } from 'axios'
import { debounce } from 'lodash'

export default {
  props: {
    propData: {
      type: Array,
      default: () => undefined,
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      supportItems: this.propData,
      loading: false,
      loadingError: false,
      cancelToken: null,
      currentPage: 1,
      itemsPerPage: 12,
      totalItems: 0,
    }
  },
  computed: {
    noItems() {
      return (
        !this.supportItems || (this.supportItems && !this.supportItems.length)
      )
    },
  },
  created() {
    this.debouncedLoadSupportItems = debounce(this.loadSupportItems, 100)

    if (!this.propData) {
      this.debouncedLoadSupportItems()
    }
  },
  watch: {
    currentPage(value, oldVal) {
      this.debouncedLoadSupportItems()
    },
  },
  methods: {
    async loadSupportItems() {
      if (this.loading && this.cancelToken) {
        this.cancelToken.cancel()
      }

      this.cancelToken = CancelToken.source()
      this.loading = true
      this.loadingError = false

      try {
        const responseData = await this.$axios.$get(supportEndpoint, {
          cancelToken: this.cancelToken.token,
          params: {
            type: this.supportInfoId,
            page_size: this.itemsPerPage,
            page: this.currentPage,
            ...this.getParams(),
          },
        })

        this.totalItems = responseData.count
        this.supportItems = responseData.results
      } catch (axiosError) {
        this.loadingError = true
      } finally {
        this.loading = false
      }
    },
    getParams() {
      return {}
    },
    refresh() {
      this.debouncedLoadSupportItems()
    },
  },
}
