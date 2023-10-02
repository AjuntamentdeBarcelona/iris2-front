import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
import { localStorageProjectPrefix } from '~/assets/js/iris2/constants'
import { mapState } from 'vuex'
import _ from 'lodash'

Vue.use(VueLocalStorage, { name: 'ls' })

/**
 * This mixin provides an interface for components to get and set localStorage keys
 *
 * Said keys are automatically constructed in the following fashion:
 *  -Namespace: First segment. Composed by a global prefix + the current group id
 *  -Second segment. Route path (with a trailing slash)
 *  -Third segment. Component's name
 *
 * The segments could be hashed if needed
 */
export default {
  name: 'LocalStorageMixin',
  data() {
    return {
      componentStorageReady: false,
      internalLocalStorageCopy: null,
    }
  },
  computed: {
    lsKeyName() {
      const routeEndsWithSlash = this.$route.path.slice(-1) === '/'

      return `${this.$route.path}${routeEndsWithSlash ? '' : '/'}.${
        this.$options.name
      }`
    },
    componentStorage: {
      get() {
        return this.internalLocalStorageCopy
      },
      set(value) {
        if (this.componentStorageReady) {
          this.$ls.set(this.lsKeyName, JSON.stringify(value))
          this.loadLocalStorageData()
        } else {
          console.warn(
            "localStorageMixin: Do not set local storage keys until it's ready"
          )
        }
      },
    },
    ...mapState('groups', ['selectedGroup']),
  },
  created() {
    this.setLocalStorageNamespace()
    this.loadLocalStorageData()
    this.componentStorageReady = true
  },
  methods: {
    setLocalStorageNamespace() {
      this.$ls.namespace =
        localStorageProjectPrefix +
        'group-' +
        _.get(this.selectedGroup, 'id', '-1')
    },
    loadLocalStorageData() {
      this.internalLocalStorageCopy = JSON.parse(this.$ls.get(this.lsKeyName)) // => null if not set
    },
  },
}
