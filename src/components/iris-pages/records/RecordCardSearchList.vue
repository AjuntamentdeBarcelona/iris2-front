<template>
  <div class="mt-2">
    <!-- Filters -->
    <record-card-form-group
      :form-group-options="formGroupOptions"
      :showing-own-tasks="showingOwnTasks"
      :current-user-id="selectedGroup.id"
      @query-params-updated="updateQueryParams"
    >
      <template slot="extra-buttons">
        <!-- Open map button -->
        <div class="centerBtn">
          <button
            v-b-tooltip=""
            v-if="formGroupOptions.enableDisplayOnMap"
            :title="$t('record_card_see_on_map')"
            :disabled="disabledMapButton"
            style="height: 2.5rem"
            class="btn btn-outline-secondary my-2 mx-1"
            @click="seeOnMap"
          >
            <font-awesome-icon
              :icon="tableLoading ? 'spinner' :'map-marked-alt'"
              :class="[tableLoading ? 'fa-pulse' : '', 'align-baseline']"
            />
          </button>
          <!-- Download as excel -->
          <button
            v-b-tooltip="excelExceedsMessage"
            v-if="canExportExcel"
            :title="$t('record_card_download_xlsx')"
            :disabled="disabledExcelButton"
            class="btn btn-outline-secondary my-2 mx-1"
            style="height: 2.5rem"
            @click="downloadExcel"
          >
            <font-awesome-icon
              :icon="tableLoading || loadingExcel ? 'spinner' : 'file-download'"
              :class="tableLoading || loadingExcel ? 'fa-pulse': ''"
            />
          </button>
          <button
            v-b-tooltip=""
            :title="$t('show_own_tasks')"
            :disabled="disabledOwnTasksButton"
            :class="ownTasks ? 'activeState' : ''"
            class="btn btn-outline-secondary my-2 mx-1"
            style="height: 2.5rem"
            @click="showOwnTasks"
          >            
            <font-awesome-icon
              :icon="tableLoading ? 'spinner' :'user'"
              :class="[tableLoading ? 'fa-pulse' : '', 'align-baseline']"
          /></button>
        </div>
        <slot name="extra-buttons" />
      </template>
    </record-card-form-group>
    <slot
      :url="url"
      :title="title"
      :query-params="queryParams"
      :table-component="tableComponent"
      name="table"
    >
      <!-- Table -->
      <component
        v-if="!listWithFiltersOnly || listWithFiltersOnly && hasQueryParams"
        ref="table"
        :is="tableComponent"
        :url="url"
        :title="title"
        :query-params="queryParams"
        :class="{'user-plate': showUserPlate}"
        :show-user-plate="showUserPlate"
        :page-parameter="pageParameter"
        class="px-0"
        @loaded-with-params="setLastParams"
        @loaded="onTableLoaded"
        @loading="onTableLoading"
        @excel-downloading="onExcelDownloading"
      >
        <template slot="before-table">
          <slot name="before-table" />
        </template>
      </component>
      <div
        v-else
        class="irisbox text-center"
        v-text="$t('record_card_no_filters')"
      />
      <!-- Alarms legend -->
      <div class="alarms_legend p-2">
        <h5>{{ $t('legend_title') }}:</h5>
        <div
          :style="legendIconsStyle"
          class="alarms_legend__icons"
        >
          <div
            v-for="(alarmIcon, index) in orderedIconMap"
            :key="index"
            class="alarms_legend__icons__icon"
          >
            <div>
              <font-awesome-icon-composer
                :icons="alarmIcon"
                layers-class="fa-2x"
                class="alarms_legend__icons__icon__fa"
              />
            </div>
            <p
              :title="alarmIcon[0].legend"
              class="alarms_legend__text"
            ><b>{{ alarmIcon[0].title }}</b></p>
          </div>
        </div>
      </div>
    </slot>

    <!-- Map list modal -->
    <MountingPortal
      v-if="formGroupOptions.enableDisplayOnMap"
      mount-to="body"
      append
    >
      <sweet-modal
        ref="modalMapList"
        :title="$t('record_cards_map_title')"
        blocking
        enable-mobile-fullscreen
        class="is-fullscreen"
        @close="mapOpened = false"
      >
        <record-card-map
          v-if="mapOpened"
          :url="url"
          :query-filters="lastParams"
        />
      </sweet-modal>
    </MountingPortal>

  </div>
</template>

<script>
import RecordCardList from '~/components/iris-pages/records/RecordCardList'
import RecordCardFormGroup from '~/components/iris-pages/records/RecordCardFormGroup'
import FontAwesomeIconComposer from '~/components/tables/FontAwesomeIconComposer'
import RecordCardMap from '~/components/iris-pages/records/maps/RecordCardMap'
import { maskAllowsPartialSearch } from '~/assets/js/iris2/model/Masks.js'
import { iconMap } from '~/components/tables/columns/RecordCardAlarms'
import { objectToArray } from '~/assets/js/utils'
import { mapGetters, mapState } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'
import _ from 'lodash'

export default {
  name: 'RecordCardSearchList',
  components: {
    RecordCardFormGroup,
    FontAwesomeIconComposer,
    RecordCardMap,
  },
  props: {
    formGroupOptions: {
      type: Object,
      default: () => ({
        advancedFiltersEnabled: false,
        unfoldBasicFilters: false,
        enableDisplayOnMap: true,
      }),
    },
    listWithFiltersOnly: {
      type: Boolean,
      default: false,
    },
    tableComponent: {
      type: [Object, String],
      default: () => RecordCardList,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    showUserPlate: {
      type: Boolean,
      default: false,
    },
    pageParameter: {
      type: String,
      default: 'NUMPERPAGPETIT',
      required: false,
    },
    excelParameter: {
      type: String,
      default: 'NUM_REGISTRES_REPORTS',
      required: false,
    },
  },
  data() {
    return {
      queryParams: {},
      legendColumns: 3,
      tableLoading: false,
      loadingExcel: false,
      showingOwnTasks: false,
      mapOpened: false,
      lastParams: {},
      currentRecords: 0,
      totalRecords: 0,
    }
  },
  computed: {
    ...mapState(['parameters']),
    ...mapGetters('groups', { hasPagePermission: 'hasPermission' }),
    canExportExcel() {
      return this.hasPagePermission(Permissions.RECORD.EXCEL)
    },
    excelLimit() {
      return this.parameters.get(this.excelParameter, 5000)
    },
    excelExceedsMessage() {
      if (this.totalRecords > this.excelLimit) {
        return this.$t('record_card_export_limit').replace(
          '{}',
          this.excelLimit
        )
      }
      return undefined
    },
    orderedIconMap() {
      const compareFunction = (itemA, itemB) => {
        const titleA = Object.values(itemA)[0][0].title
        const titleB = Object.values(itemB)[0][0].title

        if (titleA < titleB) return -1
        if (titleA > titleB) return 1
        return 0
      }

      return objectToArray(iconMap(this))
        .sort(compareFunction)
        .map(object => object[Object.keys(object)[0]])
    },
    legendIconsStyle() {
      return {
        height: `${(this.orderedIconMap.length / this.legendColumns) * 50}px`,
      }
    },
    hasQueryParams() {
      return Boolean(
        Object.keys(this.queryParams).filter(
          key => !key.includes('lookup') && this.queryParams[key] != null
        ).length
      )
    },
    noFiltersAndListWithFiltersOnly() {
      return this.listWithFiltersOnly && !this.hasQueryParams
    },
    disabledMapButton() {
      return (
        this.tableLoading ||
        !this.currentRecords ||
        this.noFiltersAndListWithFiltersOnly
      )
    },
    disabledExcelButton() {
      return (
        this.loadingExcel ||
        this.tableLoading ||
        !this.currentRecords ||
        this.noFiltersAndListWithFiltersOnly
      )
    },
    disabledOwnTasksButton() {
      return this.tableLoading || !this.currentRecords
    },

    ...mapState('groups', ['selectedGroup']),
    ownTasks() {
      return this.showingOwnTasks
    },
  },
  mounted() {
    this.showingOwnTasks =
      localStorage.showingOwnTasks === 'true' ? true : false
  },
  methods: {
    updateQueryParams(queryParams) {
      const newParams = {
        ...queryParams,
        ...this.extractAttributesValues(queryParams.attributes),
        attributes: undefined,
      }
      if (!_.isEqual(newParams, this.queryParams)) {
        this.queryParams = newParams
        this.refreshTable()
      }
    },
    /**
     * Attribute values are an special case for sending the server.
     * The different attributes must be flatten when being sent.
     * @return {Object} Flatten attributes for be placen as querystrings.
     */
    extractAttributesValues(selected) {
      if (!selected) {
        return {}
      }
      let finalValue = {}
      selected.forEach((value, index) => {
        if (value.value) {
          const lookup =
            (value.mask && !maskAllowsPartialSearch(value.mask.id)) ||
            value.values_type != null
              ? ''
              : 'ic'
          Object.assign(finalValue, {
            [`feature_${index}`]: value.feature,
            [`value${lookup}_${index}`]: value.value,
          })
        }
      })
      return finalValue
    },
    refresh() {
      if (this.$refs.table) this.$refs.table.refresh()
    },
    focusInput() {
      this.$refs.input.focus()
    },
    refreshTable: function() {
      this.mapOpened = false
      this.$nextTick(() => {
        this.refresh()
      })
    },
    seeOnMap() {
      this.mapOpened = true
      this.$refs.modalMapList.open()
    },
    downloadExcel() {
      this.$refs.table.downloadExcel()
    },
    onTableLoaded(event) {
      this.currentRecords = event.data.length
      this.totalRecords = event.count
      this.tableLoading = false
    },
    onTableLoading(event) {
      this.tableLoading = true
    },
    onExcelDownloading(event) {
      this.loadingExcel = event
    },
    setLastParams([params]) {
      this.lastParams = params
    },
    showOwnTasks() {
      this.showingOwnTasks = !this.showingOwnTasks
      localStorage.showingOwnTasks = this.showingOwnTasks
      if (this.showingOwnTasks) {
        this.updateQueryParams({ incharge_profile: this.selectedGroup.id })
      } else {
        this.updateQueryParams({ incharge_profile: null })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .sweet-title {
  display: flex;
  align-items: center;
}

.activeState {
  background-color: rgb(26, 105, 138);
  color: white;
}

.alarms_legend {
  &__icons {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    &__icon {
      display: flex;
      b &__fa {
        margin-top: -0.15em;
      }
    }
    &__text {
      b {
        color: $gray-800;
      }
    }
  }
}
@include media-breakpoint-down(lg) {
  .alarms_legend {
    &__icons {
      height: auto !important;
    }
  }
}

.centerBtn {
  margin: 0 auto;
}
@include media-breakpoint-down(lg) {
  .centerBtn {
    width: 300px;
    margin: 0;
  }
}
// /deep/ .user-plate {
//   .table-responsive {
//     .fixed-column {
//       height: 52px;
//       background-color: inherit;
//     }
//     .scrollable-column {
//       height: 50px;
//     }
//   }
// }
</style>
