import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/masters/',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
  },
  layout: 'Masters',
  computed: {
    saveUrl() {
      return (this.getResourceUrl() + '/' + this.getPkPath()).replace('//', '/')
    },
  },
  methods: {
    getType() {
      return this.$route.params.type
    },
    isSingleDescription() {
      return true
    },
    isLongDescription() {
      const type = this.getType()
      return type == 'cancel-reasons' || type == 'reasign-reasons'
    },
    /**
     * Gets the base URL of the API resource. If the type is prefixed with 'theme', then the
     * master resource will be in the /api/themes section of the api.
     */
    getResourceUrl() {
      if (this.getType().indexOf('theme') == 0) {
        return '/api/theme/' + this.getType() + '/'
      }
      return this.url + this.getType() + '/'
    },
    getUrl() {
      return this.getResourceUrl()
    },
    getRequestUrl() {
      if (this.isNewModel) {
        return this.getUrl()
      } else {
        return this.url
      }
    },
  },
}
