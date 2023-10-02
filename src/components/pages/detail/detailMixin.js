/**
 * Mixin for implementing detail views, base on retrive one object from server.
 */
export default {
  head() {
    return {
      title: this.title,
    }
  },
  props: {
    url: {
      type: String,
      default: '',
      required: true,
    },
    method: {
      type: String,
      default: 'get',
    },
    pk: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    relatedFilterAttrName: {
      type: String,
      default: '',
    },
    requestConfig: {
      type: Object,
      default: () => {
        return {}
      },
    },
    /**
     * @todo review if this attrs should be here
     */
    listFilters: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: true,
      notFound: false,
      error: false,
      model: null,
    }
  },
  computed: {
    showLoading: {
      get() {
        return this.isLoading()
      },
      set(loading) {
        // loading ? this.$nuxt.$loading.start() : this.$nuxt.$loading.finish()
        this.loading = loading
      },
    },
    pkParams() {
      return this.getPkParams()
    },
    getUrl() {
      return (this.url + this.getPkPath()).replace('//', '/')
    },
  },
  watch: {
    pkParams() {
      this.pkRefresh()
    },
  },
  created() {
    this.loadInstance()
  },
  methods: {
    pkRefresh() {
      this.refresh()
    },
    refresh() {
      this.loadInstance()
    },
    loadInstance() {
      this.showLoading = true
      this.beforeLoad(this.requestConfig)
      return this.$axios
        .get(this.getUrl, this.requestConfig)
        .then(res => {
          this.model = res.data
          this.afterLoad(this.model)
        })
        .catch(e => {
          if (e.response.status == 404) {
            this.notFound = true
          } else if (e.response.status == 403) {
            this.authorizationError = true
          }
          this.error = e
        })
        .then(() => {
          this.showLoading = false
        })
    },
    /**
     * Hook method executed after the edited object is loaded
     * and before the full form is instanciated.
     */
    afterLoad(instance) {},
    beforeLoad(requestConfig) {},
    getPkParams() {
      return this.pk != '' ? this.pk : [this.$route.params.id]
    },
    getPkPath() {
      return this.pkParams.join('/') + '/'
    },
    isLoading() {
      return this.loading
    },
  },
}
