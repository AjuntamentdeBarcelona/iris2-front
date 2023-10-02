<template>
  <div
    :class="{'no-pagination': hidePagination}"
    class="table-list">
    <unauthorized-page v-if="!isAuthorized" />
    <header
      v-if="isAuthorized"
      class="contentwrapper__header"
    >
      <h1
        v-if="showTitle && pageTitle"
        class="title-line"
      >{{ pageTitle }}</h1>
      <slot name="extra-header-buttons"/>
      <nuxt-link
        v-if="addUrl && !disableAdd"
        :to="localePath(getAddUrl())"
        class="btn btn-outline-secondary mb-1"
      >
        <font-awesome-icon icon="plus" />
        {{ $t('add') }}
      </nuxt-link>
    </header>
    <slot name="before-table" />
    <div class="irisbox overflow-hidden">
      <div
        v-if="loading && isAuthorized"
        class="table-loading"
      >
        <div class="loading-overlay">
          <div class="loader" />
        </div>
      </div>
      <div
        v-if="error && isAuthorized"
        class="alert-warning alert"
      >
        {{ $t('table_error') }}
      </div>
      <v-server-table
        v-if="renderTable"
        v-show="!loading && !error"
        ref="table"
        :url="getUrl()"
        :columns="extendedColumns"
        :options="extendedOptions"
        :name="name"
        :class="tableClasses"
        :style="tableStyle"
        @loading="setLoading"
        @loaded="loaded"
        @sorted="onTableSorted"
        @row-click="onRowClick"
      >
        <template
          v-for="(_, name) in byPassedSlots"
          slot-scope="slotData"
          :slot="name"
        >
          <slot
            :name="name"
            v-bind="slotData"
          />
        </template>
        <div
          v-if="enableSaveOrdering || enableDowloadExcel || orderUrl"
          slot="beforeTable"
          class="beforeTable"
        >
          <dynamic-tag-modal
            v-if="orderUrl && items"
            ref="orderModal"
            :component-props="{variant:'outline-secondary'}"
            :show-scroll="true"
            :reset-on-close="true"
            class="mr-1"
            width="80%"
            @close="refresh"
          >
            <font-awesome-icon icon="sync"/>
            {{ $t ('table_order_items') }}
            <template slot="modal">
              <set-order
                :item-list="items"
                :set-order-url="orderUrl" />
            </template>
          </dynamic-tag-modal>
          <!-- Save ordering -->
          <b-button
            v-if="enableSaveOrdering"
            :disabled="saveOrderingDisabled"
            variant="light"
            size="sm"
            class="ml-auto"
            @click="saveSettings"
          >
            {{ $t('table_save_ordering') }}
          </b-button>

          <!-- Clear ordering -->
          <b-button
            v-if="enableSaveOrdering"
            :disabled="clearOrderingDisabled"
            variant="outline-dark"
            class="border-0"
            size="sm"
            @click="clearSettings"
          >
            {{ $t('table_clear_ordering') }}
          </b-button>


          <!-- Multi function button dropdown -->
          <b-button-group>
            <!-- Download as excel -->
            <button
              v-if="enableDowloadExcel"
              :title="$t('record_card_download_xlsx')"
              :disabled="loading || loadingExcel"
              class="btn btn-outline-secondary"
              @click="downloadExcel"
            >
              <font-awesome-icon
                :icon="loading || loadingExcel ? 'spinner' : 'file-download'"
                :class="loading || loadingExcel ? 'fa-pulse': ''"
              />
            </button>
          </b-button-group>
        </div>

        <template
          v-if="columnLink"
          slot-scope="props"
          :slot="columnLink"
        >
          <nuxt-link
            :to="localePath(getDetailUrl(props.row))"
            :title="props.row.description">
            {{ props.row.normalized_record_id }}
          </nuxt-link>
        </template>
        <div
          v-if="!hideActions"
          slot="actions"
          slot-scope="props"
        >
          <slot
            :row="props.row"
            name="beforeActions"
          />
          <template v-if="isSelectable">
            <span>
              <button
                class="btn btn-primary btn-sm rounded-0"
                @click="$emit('select', props.row)"
              >
                {{ $t('create_select') }}
              </button>
            </span>
          </template>
          <template v-else>
            <nuxt-link
              v-if="allowEdit"
              :to="localePath(getDetailUrl(props.row))"
              class="btn btn-outline-secondary"
            >
              <font-awesome-icon icon="edit" />
            </nuxt-link>

            <span
              v-b-popover.hover="disabledDeleteMessage"
              v-if="allowDelete"
              :disabled="props.row.can_delete"
              variant="outline-success"
            >
              <b-button
                :disabled="!props.row.can_delete"
                variant="outline-danger"
                @click="onDelete(props.row)"
              >
                <font-awesome-icon icon="trash" />
              </b-button>
            </span>
          </template>

        </div>
      </v-server-table>
    </div>
    <delete-confirm
      ref="deleteConfirm"
      :url="deleteUrl"
      @on-deleted="onDeleted"
    />

  </div>
</template>

<script>
import Vue from 'vue'
import { ServerTable, Event } from 'vue-tables-2'
import vueTablesTranslations from '~/assets/js/lang/vueTablesTranslations'
import DeleteConfirm from '~/components/pages/list/DeleteConfirm.vue'
import qs from 'qs'
import List from './List.vue'
import localStorageMixin from '~/components/utils/localStorageMixin'
import { clientPagination, sortDataByDate } from '~/assets/js/helpers.js'
import '~/assets/css/loading.scss'
import { isEqual, isPlainObject } from 'lodash'
import { getContentDispositionFilename } from '~/assets/js/utils'
import { saveAs } from 'file-saver'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'
import SetOrder from './SetOrder.vue'

Vue.use(ServerTable, vueTablesTranslations, false, 'bootstrap4')
Vue.use(Event)

const orderQueryName = 'ordering'

/**
 * Helper class for managing the options for extending and customizing tables.
 * The options Object could have one of this two structs:
 * * Struct 1: { selectable: SelectComponent }
 * * Struct 2: { selectable: { template: SelectComponent, header: 'Select' } }
 */
class ColumnExtendedOptions {
  /**
   * Constructor, you can pass a list of arguments.
   */
  constructor() {
    this.options = Object.assign.apply({}, arguments)
  }
  merge(options) {
    this.options = Object.assign({}, this.options, options)
  }
  /**
   * @param {Array} List of columns to extend
   * @return {Array} Extended list of columns
   */
  extendColumns(columns) {
    return this.columns().concat(columns)
  }
  extendColumnsAppend(columns) {
    return columns.concat(this.columns())
  }
  /**
   * @return {Array} List of columns
   */
  columns() {
    return Object.keys(this.options)
  }
  /**
   * @return {Object} Template dict for vue server table options.
   */
  templates() {
    return this._mapOption('template', false)
  }
  /**
   * @return {Object} Header dict for vue server table options.
   */
  headings() {
    return this._mapOption('header', true)
  }
  /**
   * Flats an option defined passed by attr with its value.
   * @example _mapOption('header', false)
   * @return Flat col => option value dict
   */
  _mapOption(attribute, useColDefault = false) {
    const templates = {}
    Object.keys(this.options).map(col => {
      let option = this.options[col]
      if (this.isOptionsObject(option)) {
        templates[col] = option[attribute]
      } else if (useColDefault) {
        templates[col] = col
      } else {
        templates[col] = option
      }
    })
    return templates
  }
  /**
   * Checks if object has struc 1 or 2
   */
  isOptionsObject(option) {
    return option.template != null && option.header != null
  }
}

/**
 * Vue Component for creating list views. Internally it uses the vue-tables-2 for rendering the table
 * data.
 *
 * Table data can come either from an endpoint or via prop (propData)
 *
 * In addition to the ways offered by VueServerTables for extending columns, you can add additional columns
 * with providing he pluginColumns on an outer component or directly passing them as props. Wenever the mechanism
 * you choose, you must pass an Object with on of this two structs.
 *
 * ## Struct 1: column name => template
 *
 * The object must be a mapping of column name and its template (one of the three options defined by vue-server-tables).
 * Example: { selectable: SelectComponent }
 *
 * ## Struct 2: column name => options
 *
 * This structure gives more flexibility for customizing the way the column is added. It allows to define the template and
 * the header text.
 * Example: { selectable: { template: SelectComponent, header: 'Select' } }
 *
 * options.sortable may contain either strings or arrays, use the latter when there isn't a direct corespondence
 * of the column name with the field name it represents (eg: custom templates or api serializer representation)
 * 'table_col_same_as_model' vs [table_col, model.real.col]
 *
 * Default sorting can be specified through options.orderBy.column and options.orderBy.ascending
 */
export default {
  name: 'Table',
  layout: 'backoffice',
  components: {
    'delete-confirm': DeleteConfirm,
    DynamicTagModal,
    SetOrder,
  },
  inject: {
    pluginColumns: {
      default: {},
    },
  },
  extends: List,
  mixins: [localStorageMixin],
  head() {
    return {
      title: 'IRIS: ' + this.pageTitle,
    }
  },
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
    extraColumns: {
      type: Object,
      default() {
        return {}
      },
    },
    placeExtraColumnsLast: {
      type: Boolean,
      default: false,
    },
    propData: {
      type: Array,
      default: () => undefined,
    },
    propDataSorting: {
      type: Array,
      default: () => [],
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
    columnLink: {
      type: String,
      default: '',
    },
    isSelectable: {
      type: Boolean,
      default: false,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    loadOnMount: {
      type: Boolean,
      default: false,
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: undefined,
    },
    enableSaveOrdering: {
      type: Boolean,
      default: false,
    },
    enableDowloadExcel: {
      type: Boolean,
      default: false,
    },
    hidePagination: {
      type: Boolean,
      default: false,
      required: false,
    },
    listResultType: {
      type: String,
      default: '',
    },
    orderUrl: {
      type: String,
      default: '',
    },
    disabledDeleteKey: {
      type: String,
      default: 'delete_related_message',
    },
  },
  data: function() {
    return {
      loadingExcel: false,
      tableQueryParameters: {},
      internalData: this.propData,
      tableReady: true,
      detailUrl: null,
      addUrl: null,
      columns: [],
      delete_id: null,
      cancelToken: null,
      translated: [],
      options: {
        perPage: this.hidePagination ? 200 : 25,
        pagination: { chunk: 5 },
        perPageValues: [],
        headings: [],
        filterable: false,
        sortable: [],
        debounce: 1000,
        texts: {
          count: this.$t('list_count_message_default'),
          first: this.$t('first'),
          last: this.$t('last'),
          filter: this.$t('filter'),
          filterPlaceholder: this.$t('filterPlaceholder'),
          limit: this.$t('limit'),
          page: this.$t('page'),
          noResults: this.$t('noResults'),
          filterBy: this.$t('filterBy'),
          loading: this.$t('loading'),
          defaultOption: this.$t('defaultOption'),
          columns: this.$t('columns'),
        },
        requestFunction: data => {
          return this.getData({ ...data, ...this.getOrderingParams() })
        },
        requestAdapter: function(data) {
          if (isPlainObject(data.search)) {
            data = { ...data, ...data.search }
            data['search'] = undefined
          } else {
            // Trim search
            const trimmedSearch = data['search'].trim()
            data['search'] = trimmedSearch !== '' ? trimmedSearch : undefined
          }
          // Delete library keys
          data['orderBy'] = undefined // Implemented as 'ordering'
          data['ascending'] = undefined // Implemented as 'ordering'
          data['byColumn'] = undefined // Never used and always sent
          return data
        },
        requestKeys: {
          limit: 'page_size',
          query: 'search',
        },
        skin: 'table table-striped table-sm',
        sortIcon: {
          base: 'fa fas float-none',
          is: 'fa-sort float-none',
          up: 'fa-sort-up float-none',
          down: 'fa-sort-down float-none',
        },
      },
      fixedColumnsWidth: [],
      delSuccessMessageTitle: this.$t('delete_success_title'),
      delSuccessMessage: this.$t('delete_success_message'),
      disabledDeleteMessage: this.$t(this.disabledDeleteKey),
      initialLoad: true,
      internalTableSettingsCopy: {},
    }
  },
  computed: {
    tableAndLsReady() {
      const localStorageReady = this.enableSaveOrdering
        ? this.componentStorageReady
        : true
      return this.tableReady && localStorageReady
    },
    saveOrderingDisabled() {
      return isEqual(
        this.componentStorage || {},
        this.internalTableSettingsCopy
      )
    },
    clearOrderingDisabled() {
      return !Object.keys(this.componentStorage || {}).length
    },
    renderTable() {
      if (this.tableAndLsReady && this.isAuthorized) {
        return true
      } else {
        return false
      }
    },
    hasActions() {
      return (
        this.detailUrl != null && this.columnLink == '' && !this.hideActions
      )
    },
    extendedTable() {
      return new ColumnExtendedOptions(
        this.extraColumns || {},
        this.pluginColumns || {}
      )
    },
    translatedCols() {
      return this.translated.reduce((acc, val) => {
        return {
          ...acc,
          [val]: this.$irisConfig.LANGUAGES.map(lang => {
            return {
              lang,
              field: `${val}_${lang}`,
            }
          }),
        }
      }, {})
    },
    extendedColumns() {
      let columns = this.hasActions
        ? this.columns.concat(['actions'])
        : this.columns

      // Add translated columns
      columns = columns.reduce((acc, col) => {
        return acc.concat(
          this.translatedCols[col]
            ? this.translatedCols[col].map(col => col.field)
            : [col]
        )
      }, [])

      return this.placeExtraColumnsLast
        ? this.extendedTable.extendColumnsAppend(columns)
        : this.extendedTable.extendColumns(columns)
    },
    sortableCols() {
      const sortableColsReducer = (accumulator, currentValue) => {
        if (Array.isArray(currentValue)) {
          accumulator.table.push(currentValue[0])
          accumulator.api.set(currentValue[0], currentValue[1])
        } else {
          accumulator.table.push(currentValue)
          accumulator.api.set(currentValue, currentValue)
        }
        return accumulator
      }

      return this.options.sortable.reduce(sortableColsReducer, {
        table: [],
        api: new Map(),
      })
    },
    extendedOptions() {
      let extendedOptions = Object.assign({}, this.options)
      extendedOptions.headings['actions'] = this.$t('actions')

      extendedOptions.templates = {
        ...extendedOptions.templates,
        ...this.extendedTable.templates(),
      }
      extendedOptions.headings = {
        ...extendedOptions.headings,
        ...this.extendedTable.headings(),
      }

      // Expand translation headers and templates
      for (const field in this.translatedCols) {
        const head = extendedOptions.headings[field]
        for (const translated of this.translatedCols[field]) {
          extendedOptions.headings[
            translated.field
          ] = `${head} (${translated.lang.toUpperCase()})`
          extendedOptions.templates[field] = extendedOptions.templates[field]
        }
      }

      if (this.fixedColumnsWidth.length) {
        if (!extendedOptions.columnsClasses) {
          extendedOptions.columnsClasses = {}
        }

        this.extendedColumns.forEach((column, index) => {
          if (index < this.fixedColumnsWidth.length) {
            extendedOptions.columnsClasses[
              column
            ] = `fixed-column fixed-column-${index}`
          } else {
            extendedOptions.columnsClasses[column] = 'scrollable-column'
          }
        })
      }

      extendedOptions.sortable = this.sortableCols.table
      return extendedOptions
    },
    tableClasses() {
      return {
        'table-scrollable': this.fixedColumnsWidth.length,
      }
    },
    tableStyle() {
      let styleObject = {
        '--table-filter-filler':
          this.options.filterable &&
          (this.enableSaveOrdering || this.enableDowloadExcel)
            ? '-4rem'
            : this.options.filterable
              ? '-1.75rem'
              : this.enableSaveOrdering || this.enableDowloadExcel
                ? '-1rem'
                : '-1rem',
      }

      if (this.fixedColumnsWidth.length) {
        const sumReducer = (accumulator, currentValue) =>
          accumulator + currentValue

        styleObject[
          '--fixed-column-total-width'
        ] = `${this.fixedColumnsWidth.reduce(sumReducer)}px`

        this.fixedColumnsWidth.forEach((width, index, array) => {
          styleObject[`--fixed-column-${index}-width`] = `${width}px`
          styleObject[`--fixed-column-${index}-displacement`] =
            index === 0
              ? '0px'
              : `${array.slice(0, index).reduce(sumReducer)}px`
        })
      }

      return styleObject
    },
    deleteUrl() {
      return `${this.url}${this.delete_id}/`
    },
    byPassedSlots() {
      return this.getVueTablesSlots()
    },
  },
  watch: {
    propData: function(newValue, oldValue) {
      this.internalData = newValue
      this.$refs.table.setPage(this.goToPage())
    },
    renderTable: {
      async handler(val, oldVal) {
        if (val) {
          await this.$nextTick()
          this.setTableSettings()
        }
      },
      immediate: true,
    },
  },
  methods: {
    goToPage() {
      const perPage = this.$refs.table.options.perPage
      const selectedPage = this.$refs.table.Page

      const previousElements = this.$refs.table.count
      const previousLastPage = Math.ceil(previousElements / perPage)

      const currentElements = this.internalData.length
      const currentLastPage = Math.ceil(currentElements / perPage)

      // We automatically move to a previous page if the following conditions are met:
      const conditions = [
        currentLastPage < previousLastPage, // Pages decrease
        selectedPage === previousLastPage, // We were on the last page
        selectedPage > 1, // There are pages to go back to
      ]

      const goToPage = conditions.every(c => c === true)
        ? selectedPage - 1
        : selectedPage

      return goToPage
    },
    /**
     * This method returns a list of slots that can be by-passed from this component to
     *  the vue-server-table.
     */
    getVueTablesSlots() {
      const slots = {}
      Object.keys(this.$scopedSlots).forEach(key => {
        if (
          this.columns.indexOf(key) >= 0 ||
          key == 'child_row' ||
          key == 'actions'
        ) {
          slots[key] = this.$scopedSlots[key]
        }
      })
      return slots
    },
    setLoading(event) {
      this.tableQueryParameters = event
      this.$emit('loading', event)
    },
    loaded(event) {
      this.$emit('loaded', event)
    },
    onTableSorted(event) {
      this.updateInternalTableSettingsStatus()
    },
    onRowClick({ row, event }) {},
    refresh() {
      if (this.$refs.table) {
        this.$refs.table.refresh()
      }
    },
    getData(data) {
      if (this.internalData !== undefined) {
        return this.getInternalData(data)
      } else {
        this.error = false
        const rqData = this.getRequestParams(data)
        const promise = this.performRequest(this.getUrl(), rqData)
        promise.then(items => {
          this.items = items.data.results ? items.data.results : items.data
          this.$emit('loaded-with-params', [rqData, items.data])
          if (this.items.length == 0) {
            this.$emit('empty-result', rqData)
          }
        })
        promise.catch(e => {
          this.$emit('empty-result', rqData)
          return []
        })
        return promise
      }
    },
    getInternalData(data = null) {
      this.loading = false
      return new Promise((resolve, reject) => {
        this.alterInternalData()

        const sortedData = sortDataByDate(
          this.internalData,
          ...this.propDataSorting
        )
        const sortedPaginatedPropData = clientPagination(
          sortedData,
          (data && data.page_size) || this.$refs.table.opts.perPage,
          (data && data.page) || this.$refs.table.Page
        )

        resolve({
          data: sortedPaginatedPropData,
          count: this.internalData.length,
        })
      })
    },
    /**
     * Hook to alter internalData before sorting and pagination
     */
    alterInternalData() {},
    /**
     * @returns {Object} Returns an URL object if the table must include a button for adding new rows.
     */
    getAddUrl() {
      return Object.assign({}, this.addUrl, {
        query: this.getRequestParams(),
      })
    },
    async downloadExcel() {
      this.changeExcelDownloadingStatus(true)

      const requestObject = {
        url: this.getUrl(),
        headers: {
          Accept: 'application/xlsx',
        },
        responseType: 'blob',
        params: this.getRequestParams({
          ...this.tableQueryParameters,
          ...this.getOrderingParams(),
        }),
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
      }

      const longWaitMsg = this.delayShowMessage(
        this.$t('record_card_excel_error_title'),
        this.$t('record_card_excel_wait_msg'),
        'warning',
        5000
      )
      try {
        const response = await this.$axios(requestObject)

        const filename = getContentDispositionFilename(
          response.headers['content-disposition']
        )

        saveAs(response.data, filename)
      } catch (error) {
        const isTimeout =
          error.response &&
          error.response.status == 500 &&
          error.response.statusText.includes('URL Open')
        this.showNotification(
          this.$t('record_card_excel_error_title'),
          isTimeout
            ? this.$t('record_card_excel_error_msg_timeout')
            : this.$t('record_card_excel_error_msg'),
          'error',
          100000000
        )
      } finally {
        this.cancelDelayedMessage(longWaitMsg)
        this.changeExcelDownloadingStatus(false)
      }
    },
    changeExcelDownloadingStatus(downloadingStatus) {
      this.loadingExcel = downloadingStatus
      this.$emit('excel-downloading', downloadingStatus)
    },
    /**
     * Hook method called when the delete button is pressed.
     */
    onDelete(row) {
      this.delete_id = row.id
      this.$refs.deleteConfirm.open()
    },
    onDeleted() {
      if (this.propData) {
        this.$emit('deleted', this.delete_id)
      } else {
        this.$refs.table.refresh()
      }
      this.$refs.deleteConfirm.close()
      this.delete_id = null
      this.showSuccessMessage()
    },
    delayShowMessage(title, text, type, time) {
      return setTimeout(this.showNotification, time, title, text, type)
    },
    cancelDelayedMessage(msg) {
      clearTimeout(msg)
    },
    showNotification(title, text, type, time = 3000) {
      this.$notify({
        group: 'iris',
        title,
        text,
        type,
        duration: time,
      })
    },
    /**
     * Displays a success message as feed
     */
    showSuccessMessage() {
      this.$notify({
        group: 'iris',
        title: this.delSuccessMessageTitle,
        type: 'success',
        text: this.delSuccessMessage,
      })
    },
    /**
     * Returns either local storage column sorting or current table's one
     * Either is adapted with a custom request key, foreign keys are traversed using double underscore instead of dots
     * Order is represented with the presence or absence of a minus sign
     * Ascending order must be specified on the extending table, for the default is false.
     */
    getOrderingParams() {
      const savedSettings = { ...this.componentStorage } || {}

      const settings =
        this.initialLoad && Object.keys(savedSettings).length
          ? savedSettings
          : this.$refs.table
            ? this.$refs.table.orderBy
            : this.options.orderBy || {}
      this.initialLoad = false

      const customSettings =
        settings.column && this.sortableCols.api.has(settings.column)
          ? {
              [orderQueryName]: `${
                settings.ascending ? '' : '-'
              }${this.filterNameForColumn(
                this.sortableCols.api.get(settings.column)
              )}`,
            }
          : {}
      return this.adjustOrderingParams(customSettings)
    },
    /**
     * Hook method for making changes on the generated filters before making the request.
     * @param {Object} Params
     * @return {Object} Adjusted params.
     */
    adjustOrderingParams(params) {
      return params
    },
    /**
     * Overriden to support default sorting when the table is not sortable
     */
    getExtraQueryParams() {
      if (
        this.options.orderBy &&
        (!this.options.sortable ||
          (this.options.sortable && !this.options.sortable.length))
      ) {
        return {
          [orderQueryName]: `${
            this.options.orderBy.ascending ? '' : '-'
          }${this.filterNameForColumn(this.options.orderBy.column)}`,
        }
      }
    },
    filterNameForColumn(columnName) {
      return columnName.replace(/\./g, '__')
    },
    setTableSettings() {
      if (this.$refs.table) {
        this.setTableTexts()
        this.$refs.table.orderBy =
          this.componentStorage && Object.keys(this.componentStorage)
            ? { ...this.componentStorage }
            : { ...this.options.orderBy }
        this.updateInternalTableSettingsStatus()
      } else {
        console.warn(
          'Attempting to set table settings before it has been rendered'
        )
      }
    },
    saveSettings() {
      this.componentStorage = this.$refs.table.orderBy
    },
    clearSettings() {
      this.$refs.table.orderBy = {}
      this.updateInternalTableSettingsStatus()
      this.saveSettings()
      this.$refs.table.refresh()
    },
    updateInternalTableSettingsStatus() {
      this.internalTableSettingsCopy = { ...this.$refs.table.orderBy }
    },
    getListResultType() {
      return this.listResultType
    },
    setTableTexts() {
      if (this.getListResultType()) {
        const resultTypePlural = this.$tc(this.getListResultType(), 2)

        this.$refs.table.globalOptions.texts.noResults = this.$t(
          'list_empty_message',
          { registres: resultTypePlural }
        )

        this.$refs.table.globalOptions.texts.count = this.$t(
          'list_count_message'
        )
          .replace(/\{registres\}/g, resultTypePlural)
          .replace(/\{registre\}/, this.$tc(this.getListResultType()))
      } else {
        this.resetTableTexts()
      }
    },
    resetTableTexts() {
      this.$refs.table.globalOptions.texts.noResults = this.$t(
        'list_no_results_default'
      )
      this.$refs.table.globalOptions.texts.count = this.$t(
        'list_count_message_default'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
$maximum-fixed-columns: 4;

.table-scrollable {
  @for $i from 0 through $maximum-fixed-columns {
    /deep/ .fixed-column-#{$i} {
      width: var(--fixed-column-total-width);
      left: var(--fixed-column-#{$i}-displacement);
    }
  }
  /deep/ .VueTables__sortable {
    cursor: pointer;
  }
  /deep/ .fixed-column {
    display: flex;
  }

  /deep/ .table-responsive {
    // Add + 2rem to ajust to full screen the table
    width: calc(100% - var(--fixed-column-total-width) + 2rem);
    margin-left: var(--fixed-column-total-width);
    margin-right: 0;
    overflow-y: visible;
    margin-bottom: 30px;
    .table {
      margin-bottom: 0;
    }
    .VueTables__no-results {
      height: 38px;
      td {
        position: absolute;
        height: 38px;
        left: 0;
        right: 0;
        border-top: 2px solid $gray-400 !important;
      }
    }
    .fixed-column {
      position: absolute;
      box-sizing: border-box;
    }
    .scrollable-column:nth-child(n + 5) {
      .VueTables__heading {
        display: inline-block;
        min-width: 50px;
      }
    }
    .scrollable-column:nth-child(n + 10) {
      .VueTables__heading {
        // min-width: 120px;
      }
    }

    .VueTables__heading {
      margin-top: auto;
    }
    th {
      border: none;
      white-space: nowrap;
    }
    .VueTables__heading {
      display: inline-block;
      padding-right: 0.25em;
    }
    .VueTables__sort-icon {
      margin-top: 0.2em;
    }
    // WARNING: NO TOCAR SI NO ESTAS MUY SEGURO DE LO QUE HACES
    // sistema para que las tablas scrollable tengan borde
    .fixed-column {
      background-color: inherit;
    }
    th.fixed-column {
      height: 26px;
    }
    td.fixed-column {
      height: 47px;
      border: none;
    }
    td.fixed-column {
      &:before,
      &:after {
        content: '';
        position: absolute;
        z-index: 4;
        left: 0;
        width: 100vw;
        height: 2px;
        background-color: $gray-400 !important;
      }
      &:before {
        z-index: 0;
        display: none;
        bottom: 0px;
      }
      &:after {
        top: -1px;
      }
    }
    tr:first-child td.fixed-column {
      &:after {
        display: none;
      }
    }
    tr:last-child td.fixed-column {
      &:before {
        display: block;
      }
    }
    // END WARNING
  }
}
</style>

<style lang="scss">
.VueTables {
  > div:first-of-type.row {
    pointer-events: none;
    .VueTables__search {
      pointer-events: auto;
    }
  }
  .beforeTable {
    // margin-left: calc(231px + 1em);
    // margin-top: var(--table-filter-filler);
    margin-bottom: 24px;
    display: flex;
    justify-content: flex-end;
    .btn {
      margin-top: 0.5rem;
    }
    button:last-of-type {
      margin-left: 1rem;
    }
  }
}

.VueTables__date-filter {
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
}

.VueTables__search-field label {
  align-items: flex-start;
}

.table-list.no-pagination {
  .VueTables {
    > .table-responsive {
      .VueTables__table {
        margin-bottom: 0;
      }
    }
    > .VuePagination {
      display: none;
    }
  }
}

.table-list .table-loading {
  min-height: 400px;
  position: relative;
}

.table-list .table-loading .loading-overlay {
  background-color: $white;
}
</style>
