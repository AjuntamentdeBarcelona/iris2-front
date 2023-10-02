import { debounce, isPlainObject } from 'lodash'
import { iUnaccentContains } from '~/assets/js/utils/string/trimAccents.js'
import qs from 'qs'

/**
 * Mixin for implementing autocomplete selects.
 *
 * Extra schema options:
 * - url (axios uri): autocomplete from an external endpoint with the v-select options.
 * - optionLabelAttribute: vue select label option (specifies a field from the ajax call for retrieving the option label)
 * - processAjaxResult (function): function for further processing over the ajax results.
 * - forwardFields (list): field names which will be included in the query for ajax requests. Admits an array format
 *    where the first element is the field, and the second, the filter name it'll go by.
 *    Eg: 'element' / ['element', 'element_id']
 * - forwardFlatValues: values from those fields will be flatten to a single value or an array of them
 * - forwardOptions (fn): receives the model and its return will be used as options if schema has no url.
 * - requiredFields (list): this field will be disabled until all the fields had a value
 * - getInitialOption (function): this function will be called with the model instance in order to retrieve
 *   the initial option for the field. Is meant for avoiding the initial request.
 * - isRestful (boolean): if true, will look for the initial value by performing a detail GET (with pk) rather
 *   than perfoming a list request. With the following endpoint '/my-awesome-list/', the component will look for
 *   the initial value on '/my-awesome-list/{value}/'
 * - getUrlForSearch: if passed, will be used as function for getting the final url for performing the rq.
 * - autoselectOne: if only one option and no value selected, that only option will be selected
 * - lazy: await interaction for loading list
 */
export default {
  data() {
    return {
      options: this.schema.options || [],
      loading: false,
      nextPage: null,
      lazyStarted: false,
      lastAjaxSearch: null,
    }
  },
  computed: {
    filterable() {
      return this.selectOnSearch != null || this.isOfflineSearch
    },
    isOfflineSearch() {
      return this.schema.offlineSearch
    },
    selectOnSearch() {
      if (
        (this.options &&
          this.options.length > 0 &&
          !this.loading &&
          this.isOfflineSearch) ||
        this.infiniteCompleted
      ) {
        return false
      }
      return this.schema.url ? this.onSearch : null
    },
    forwardParams() {
      let params = {}
      let forward = this.schema.forwardFields || []
      forward.forEach(field => {
        if (Array.isArray(field)) {
          params[field[1]] = this.getValueFromField(field[0])
        } else {
          params[field] = this.getValueFromField(field)
        }
      })
      return params
    },
    forwardJSON() {
      return JSON.stringify(this.forwardParams)
    },
    filterByFn() {
      if (this.schema.filterByFn) {
        return this.schema.filterByFn
      }
      return this.filterBy()
    },
    lazy() {
      return !!this.schema.lazy
    },
    listUrl() {
      return this.schema.url
    },
    infiniteScroll() {
      return _.get(this.schema, 'infiniteScroll', false)
    },
    infiniteCompleted() {
      return this.infiniteScroll && !this.nextPage && this.search == ''
    },
  },
  watch: {
    forwardJSON: {
      handler() {
        if (this.schema.readonly) {
          return
        }
        if (this.schema.url) {
          this.load()
        } else {
          if (this.schema.forwardOptions != null) {
            this.options = this.schema.forwardOptions(this.model)
            if (this.options == undefined) {
              console.error('Undefined forward options', this.schema)
            }
          }
        }
      },
    },
  },
  created() {
    this.debouncedSearch = debounce(this.search, 500)
  },
  mounted() {
    this.lazy ? this.initLazy() : this.initialLoad()
  },
  methods: {
    /**
     * Search unnacent by default
     */
    filterBy() {
      return function filterUnaccent(option, label, search) {
        return iUnaccentContains(label, search)
      }
    },
    /**
     * Performs the initial data loading according to the field's current value.
     */
    initialLoad() {
      this.load({}, true)
    },
    /**
     * Placeholder method for components needing special inicialization for lazy use-case.
     */
    initLazy() {},
    /**
     * Loads data from server.
     */
    load(extra_params, debounce) {
      this.lazyStarted = true
      if (this.listUrl) {
        this.loading = true
        return this[debounce ? 'debouncedSearch' : 'search'](
          () => {
            this.loading = false
          },
          '',
          this,
          extra_params
        )
      }
    },
    /**
     * Handles the onSearch method of the vue-select component
     */
    onSearch(search, loading, extra_params) {
      loading(true)
      this.debouncedSearch(loading, search, this, extra_params)
    },
    loadNextPage() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$axios
        .get(this.nextPage)
        .then(res => {
          const options = this.schema.processAjaxResult
            ? this.schema.processAjaxResult(res)
            : this.processAjaxResult(res.data)
          this.nextPage = res.data.next
          this.options = [...this.options, ...options]
        })
        .catch(() => {})
        .then(() => {
          this.loading = false
        })
    },
    /**
     * Performs the AJAX search
     * @returns The promise of the search
     */
    search(loading, search, vm, extra_params) {
      this.lastAjaxSearch = search
      extra_params = extra_params || {}
      let prom = this.$axios.get(this.getRequestUrl(extra_params, search), {
        params: Object.assign({}, extra_params, this.getQueryParams(search)),
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
      })
      prom
        .then(res => {
          this.nextPage = res.data.next
          vm.options = this.schema.processAjaxResult
            ? this.schema.processAjaxResult(res)
            : this.processAjaxResult(res.data)
        })
        .catch(error => {
          // error
          this.options = []
        })
        .then(() => {
          loading(false)
        })
      return prom
    },
    /**
     * @returns The parameters included with the GET querystring params (ajax mode only)
     */
    getQueryParams(search) {
      const queryParam = this.schema.queryParam || 'search'
      const searchParam = {
        [queryParam]: search !== '' ? search : undefined,
      }

      const reducedForwardParams = Object.entries(this.forwardParams).reduce(
        this.paramReducer,
        {}
      )

      const mergedParams = Object.assign({}, reducedForwardParams, searchParam)

      return mergedParams
    },
    paramReducer(accumulator, currentValue) {
      const [key, value] = currentValue
      if (value !== null) {
        accumulator[key] = value
      }
      return accumulator
    },
    /**
     * @returns The data returned from server
     */
    processAjaxResult(data) {
      if (Array.isArray(data)) {
        return data
      }
      return data.results || [data]
    },
    /**
     * @returns the getRequest URL. If the service is restful and a param called id is passed,
     * then a detail GET request url, the url with the id of the resource, will be returned.
     */
    getRequestUrl(params, search) {
      if (params.id && this.schema.isRestful) {
        return this.getRestfulUrl(params, search)
      }
      if (this.schema.getUrlForSearch) {
        return this.schema.getUrlForSearch(this, params, search)
      }
      return this.listUrl
    },
    /**
     * @param {*} params
     * @param {*} search
     * @returns The final url for making the get of the initial value on restful resources
     */
    getRestfulUrl(params, search) {
      return this.listUrl + params.id + '/'
    },
    /**
     * @returns the value from the model
     */
    getValue() {
      return this.model[this.schema.model]
    },
    /**
     * Returns the values of a field reversing schema.objectValue
     * -single value for autocomplete: 86
     * -array of single values for autocomplete-multiple: [86, 10]
     */
    getValueFromField(field) {
      const fieldModel = this.model[field]

      if (this.schema.forwardFlatValues) {
        if (Array.isArray(fieldModel)) {
          return fieldModel.map(value => this.flattenValue(value))
        } else {
          return this.flattenValue(fieldModel)
        }
      } else {
        return fieldModel
      }
    },
    flattenValue(value) {
      if (this.schema.objectValue) {
        return this.getValueFromObject(value)
      } else {
        return value
      }
    },
    getValueFromObject(value) {
      return isPlainObject(value) ? value[this.schema.valueAttribute] : value
    },
  },
}
