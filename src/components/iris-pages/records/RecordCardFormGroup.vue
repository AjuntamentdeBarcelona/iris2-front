<template>
  <loader v-if="!componentStorageLoaded"/>
  <div
    v-else
    class="d-flex flex-wrap">
    <!-- Quick search -->
    <filter-form-quick-search
      ref="quickSearch"
      :initial="initial.quickFilters"
      class="p-0 my-2 mr-2"
      @updated-query-params="updatedQueryParams"
    />
    <!-- Basic filters button -->
    <button
      :class="{active: basicFiltersVisibility}"
      class="btn btn-outline-secondary my-2 mx-1"
      @click.prevent.stop="toggleBasicFilters"
    >
      <font-awesome-icon
        :icon="['fas', 'sliders-h']"/>
      {{ $t('record_card_basic_filters') }}
    </button>
    <!-- Advanced filters button -->
    <button
      v-if="formGroupOptions.advancedFiltersEnabled"
      :class="{active: advancedFiltersVisibility}"
      class="btn btn-outline-secondary my-2 mx-1 "
      @click.prevent.stop="toggleAdvancedFilters"
    >
      <font-awesome-icon
        :icon="['fas', 'sliders-h']"/>
      {{ $t('record_card_advanced_filters') }}
    </button>
    <!-- Extra buttons -->
    <slot name="extra-buttons"/>
    <div
      v-if="basicFiltersVisibility !== null"
      v-show="basicFiltersVisibility"
      class="col-12 p-0"
    >
      <filter-form-basic-filters
        ref="basicFilters"
        :initial="initial.basicFilters"
        @model-updated="debouncedModelUpdated"
      />
    </div>
    <div
      v-if="formGroupOptions.advancedFiltersEnabled && advancedFiltersVisibility !== null"
      v-show="advancedFiltersVisibility"
      class="col-12 p-0"
    >
      <filter-form-advanced-filters
        ref="advancedFilters"
        :initial="initial.advancedFilters || advancedFiltersInitial"
        @model-updated="onModelUpdatedHandler"
      />
    </div>
    <div class="col-12 p-0">
      <record-cards-selected-filters
        v-if="renderTagSelector"
        :applied-filters="appliedFilters"
        @deleted="deletedFilter"
        @clear-filters="clearFilters"
      />
    </div>
  </div>
</template>

<script>
import FilterFormQuickSearch from '~/components/iris-pages/records/FilterFormQuickSearch'
import FilterFormBasicFilters from '~/components/iris-pages/records/FilterFormBasicFilters'
import { getBasicFiltersForm } from '~/components/iris-pages/records/FilterFormBasicFilters'
import FilterFormAdvancedFilters from '~/components/iris-pages/records/FilterFormAdvancedFilters'
import { getAdvancedFiltersFormDefinition } from '~/components/iris-pages/records/FilterFormAdvancedFilters'
import RecordCardsSelectedFilters from '~/components/iris-pages/records/RecordCardSelectedFilters'
import { cleanObject, isPlainObject } from '~/assets/js/helpers'
import { lookupExpressions } from '~/assets/js/iris2/constants'
import Ca from '~/lang/ca'
import _ from 'lodash'
import localStorageMixin from '~/components/utils/localStorageMixin'
import Loader from '~/components/utils/Loader'
import Crm from '~/assets/js/iris2/model/Crm.js'

/**
 * Collects the model and schema of its forms (one at a time) and:
 * 1º Signals filtersToApply to the parent component (a table will make a petition with these as query parameters)
 * 2º Props's appliedFilters to its RecordCardsSelectedFilters component (renders label:value)
 *
 * Selects schema require:
 * -optionLabelAttribute to choose the property to display on selected filters
 * -valueAttribute to in order to extract the value from the model and signal it to the table
 */
export default {
  name: 'RecordCardFormGroup',
  components: {
    FilterFormQuickSearch,
    FilterFormBasicFilters,
    FilterFormAdvancedFilters,
    RecordCardsSelectedFilters,
    Loader,
  },
  mixins: [localStorageMixin],
  props: {
    formGroupOptions: {
      type: Object,
      default: () => ({
        advancedFiltersEnabled: false,
        unfoldBasicFilters: false,
      }),
    },
    showingOwnTasks: {
      type: Boolean,
      default: false,
    },
    currentUserId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formModel: {},
      formOrigin: '',
      formFields: {
        basicFilters: getBasicFiltersForm(this).fields,
        advancedFilters: getAdvancedFiltersFormDefinition(this).fields,
      },
      appliedFilters: [],
      basicFiltersVisibility: null,
      advancedFiltersVisibility: null,
      basicFiltersActive: false,
      advancedFiltersActive: false,
      advancedFiltersInitial: {
        normalized_record_id_lookup: 'ilike_contains',
        applicant_name_lookup: 'ilike_contains',
        applicant_surname_lookup: 'ilike_contains',
        applicant_second_surname_lookup: 'ilike_contains',
        applicant_social_reason_lookup: 'ilike_contains',
      },
      componentStorageLoaded: false,
      initial: {
        quickFilters: undefined,
        basicFilters: undefined,
        advancedFilters: undefined,
      },
      debouncedModelUpdated: _.debounce(this.modelUpdated, 500),
    }
  },
  computed: {
    filterMode() {
      return this.basicFiltersActive
        ? 'basicFilters'
        : this.advancedFiltersActive
          ? 'advancedFilters'
          : ''
    },
    filterModeComponent() {
      return this.filterMode === 'basicFilters'
        ? 'FilterFormBasicFilters'
        : this.filterMode === 'advancedFilters'
          ? 'FilterFormAdvancedFilters'
          : ''
    },
    activeFormFields() {
      return this.filterMode ? this.formFields[this.filterMode] : {}
    },
    advancedFiltersModelDefaultSet() {
      return (
        this.$refs.advancedFilters && this.$refs.advancedFilters.modelDefaultSet
      )
    },
    cleanedFormModel() {
      return cleanObject(this.formModel, ['', null, undefined, [], {}])
    },
    filtersToApply() {
      let { street_address, alarms, ...filters } = {
        ...this.cleanedFormModel,
      }
      if (
        Object.keys(this.activeFormFields).length &&
        (this.formOrigin === 'FilterFormBasicFilters' ||
          this.formOrigin === 'FilterFormAdvancedFilters')
      ) {
        // Selects
        Object.entries(filters).forEach((entry, index) => {
          const [key, value] = entry
          if (key == 'attributes') {
            filters[key] = value
          } else if (Array.isArray(value)) {
            // that return Arrays
            filters[key] = value.map(obj => {
              return obj[this.activeFormFields[key].valueAttribute]
            })
          } else if (isPlainObject(value)) {
            // that return Objects
            if (this.activeFormFields[key]) {
              filters[key] = value[this.activeFormFields[key].valueAttribute]
            }
          }
        })

        // Special street_address case
        if (street_address) {
          street_address.forEach((address, index) => {
            const street = _.get(address, 'street.description')
            const number = _.get(address, 'number.description')
            if (street) filters[`street_${index}`] = street
            if (number) filters[`number_${index}`] = number
          })
        }

        // Special alarms case
        if (alarms) {
          const reducer = (accumulator, currentValue) => {
            accumulator[currentValue.id] = true
            return accumulator
          }
          const booleanAlarms = Object.values(alarms).reduce(reducer, {})
          filters = { ...filters, ...booleanAlarms }
        }
      }

      if (this.showingOwnTasks) {
        filters = {
          ...filters,
          incharge_profile: this.currentUserId,
        }
      }

      return filters
    },
    hasFiltersToApply() {
      return Boolean(
        Object.keys(this.filtersToApply).filter(key => !key.includes('lookup'))
          .length
      )
    },
    renderTagSelector() {
      return this.appliedFilters.length
    },
    noFiltersToApplyOrFormVisible() {
      return (
        !this.hasFiltersToApply &&
        !this.advancedFiltersVisibility &&
        !this.basicFiltersVisibility
      )
    },
  },
  watch: {
    componentStorageReady(value, oldValue) {
      if (value) {
        this.applyLocalStorageData()

        if (
          this.formGroupOptions.unfoldBasicFilters &&
          !this.hasFiltersToApply
        ) {
          this.setInitialFilterVisibility()
        }

        this.componentStorageLoaded = true
      }
    },
    noFiltersToApplyOrFormVisible(value, oldValue) {
      if (value && this.formGroupOptions.unfoldBasicFilters) {
        this.setInitialFilterVisibility()
      }
    },
  },
  methods: {
    setInitialFilterVisibility() {
      if (Crm.isCRMList(this.$route.query)) {
        this.advancedFiltersVisibility = true
        this.advancedFiltersActive = true
        this.basicFiltersVisibility = false
        this.basicFiltersActive = false
      } else {
        this.basicFiltersVisibility = true
        this.basicFiltersActive = true
        this.advancedFiltersVisibility = false
        this.advancedFiltersActive = false
      }
    },
    updatedQueryParams(queryParams, schema, componentName) {
      this.formOrigin = componentName
      this.formModel = { ...queryParams }
      this.hideFilters()
      this.cleanBasicAndAdvancedFilters(true)
      this.signalFiltersToApply()
      this.componentStorage = {
        [this.formOrigin]: this.formModel,
      }
      this.appliedFilters = []
      this.updateAppliedFilters()
    },
    onModelUpdatedHandler(model, schema, componentName) {
      if (this.advancedFiltersModelDefaultSet) {
        this.debouncedModelUpdated(model, schema, componentName)
      } else {
        this.modelUpdated(model, schema, componentName)
      }
    },
    modelUpdated(model, schema, componentName) {
      if (
        (componentName === 'FilterFormBasicFilters' &&
          (componentName === this.formOrigin ||
            componentName === this.filterModeComponent)) ||
        (componentName === 'FilterFormAdvancedFilters' &&
          (componentName === this.formOrigin ||
            componentName === this.filterModeComponent) &&
          this.advancedFiltersModelDefaultSet)
      ) {
        this.formOrigin = componentName
        this.formModel = { ...model }
        this.clearQuickSearch()
        this.signalFiltersToApply()
        this.componentStorage = {
          [this.formOrigin]: this.formModel,
        }
        this.updateAppliedFilters()
      }
    },
    hideBasicFilters() {
      this.basicFiltersActive = false
      this.basicFiltersVisibility =
        this.basicFiltersVisibility === null ? null : false
    },
    hideAdvancedFilters() {
      this.advancedFiltersActive = false
      this.advancedFiltersVisibility =
        this.advancedFiltersVisibility === null ? null : false
    },
    hideFilters() {
      this.hideBasicFilters()
      this.hideAdvancedFilters()
    },
    toggleBasicFilters() {
      this.hideAdvancedFilters()
      // if (!this.basicFiltersActive) {
      //   this.basicFiltersClean(true)
      // }
      this.basicFiltersActive = true
      this.advancedFiltersClean(true)
      this.advancedFiltersActive = false
      this.basicFiltersVisibility = !this.basicFiltersVisibility
    },
    toggleAdvancedFilters() {
      this.hideBasicFilters()
      // if (!this.advancedFiltersActive) {
      //   this.advancedFiltersClean(true)
      // }
      this.advancedFiltersActive = true
      this.basicFiltersClean(true)
      this.basicFiltersActive = false
      this.advancedFiltersVisibility = !this.advancedFiltersVisibility
    },
    applyLocalStorageData() {
      let lsValue = { ...this.componentStorage }
      const crmFilters = Crm.getDocumentFilters(this.$route.query)
      const advancedKey = 'FilterFormAdvancedFilters'
      if (
        !_.isEmpty(crmFilters) &&
        this.formGroupOptions.advancedFiltersEnabled
      ) {
        lsValue = lsValue != null ? lsValue : {}
        Object.assign(lsValue, {
          [advancedKey]: { ...lsValue[advancedKey], ...crmFilters },
        })
      }

      if (lsValue && Object.keys(lsValue).length === 1) {
        const lsKey = _.isEmpty(crmFilters)
          ? Object.keys(lsValue)[0]
          : advancedKey
        const lsKeyValue = lsValue[lsKey]

        if (lsKeyValue && Object.keys(lsKeyValue).length) {
          switch (lsKey) {
            case 'FilterFormQuickSearch':
              this.initial.quickFilters = { ...lsKeyValue }
              break
            case 'FilterFormBasicFilters':
              this.initial.basicFilters = { ...lsKeyValue }
              this.basicFiltersActive = true
              this.basicFiltersVisibility = false
              break
            case advancedKey:
              this.initial.advancedFilters = { ...lsKeyValue }
              this.advancedFiltersActive = true
              this.advancedFiltersVisibility = false
              break
          }
          this.formOrigin = lsKey
          this.formModel = { ...lsKeyValue }
          this.signalFiltersToApply()

          this.updateAppliedFilters()
        }
      }
    },
    /**
     * FormModel values that contain objects are changed to use the value as defined on its schema
     */
    signalFiltersToApply() {
      this.$emit('query-params-updated', this.filtersToApply)
    },
    /**
     * On-demand update of appliedFilters
     * formModel is transformed into an object with label, displayValue, and fieldSchema
     * label and displayValue will be used for the tags, fieldSchema is used to get the model and inform on deletion
     */
    updateAppliedFilters() {
      const appliedFilters = {
        ...cleanObject(this.cleanedFormModel, lookupExpressions),
      }

      this.appliedFilters = Object.entries(appliedFilters).map(
        this.mapModelToFilter
      )
    },
    mapModelToFilter(model) {
      const [property, value] = model
      let formField = this.activeFormFields[property]
      let displayValue = value
      let label = ''
      if (formField) {
        // Selects (optionLabelAttribute is present on those)
        if (formField.optionLabelAttribute) {
          // that return an Array (select multiple, we'll return objects on those)
          if (Array.isArray(value)) {
            const valueArray = []
            value.forEach(obj => {
              valueArray.push(obj[formField.optionLabelAttribute])
            })
            displayValue = valueArray.join(', ')
          }
          // that return an Object
          else {
            displayValue = value[formField.optionLabelAttribute]
          }
        } else if (typeof value === 'boolean') {
          if (value) {
            displayValue = this.$t('yes')
          } else {
            displayValue = this.$t('no')
          }
        }
      } else if (
        (property === 'applicant_identifier' ||
          property === 'normalized_record_id') &&
        value
      ) {
        label = this.$t('tasks_auto_search_result_label')
        displayValue = value
        formField = property
      }
      if (!formField) {
        return undefined
      }
      return {
        label: formField.label || label,
        displayValue: displayValue,
        fieldSchema: formField,
      }
    },
    deletedFilter(fieldSchema) {
      this.filterMode
        ? this.$refs[this.filterMode].forceModelUpdate({
            [fieldSchema.model]: null,
          })
        : this.resetQuickSearch()
    },
    clearFilters() {
      if (this.filterMode) {
        this.$refs[this.filterMode].clearModel(true)
        if (this.filterMode === 'advancedFilters') {
          this.advancedFiltersRestoreDefaults(true)
        }
      } else {
        this.resetQuickSearch()
      }
    },
    clearQuickSearch() {
      if (this.$refs.quickSearch) {
        this.$refs.quickSearch.clearField()
      }
    },
    resetQuickSearch() {
      if (this.$refs.quickSearch) {
        this.$refs.quickSearch.resetField()
      }
    },
    basicFiltersClean(noEvent) {
      if (this.$refs.basicFilters) {
        this.$refs.basicFilters.clearModel(false, noEvent)
      }
    },
    advancedFiltersClean(noEvent) {
      if (this.$refs.advancedFilters) {
        this.$refs.advancedFilters.clearModel(false, noEvent)
      }
    },
    advancedFiltersRestoreDefaults(noEvent) {
      if (this.$refs.advancedFilters) {
        this.$refs.advancedFilters.forceModelUpdate(
          this.advancedFiltersInitial,
          noEvent
        )
      }
    },
    cleanBasicAndAdvancedFilters(noEvent) {
      this.basicFiltersClean(noEvent)
      this.advancedFiltersClean(noEvent)
      this.advancedFiltersRestoreDefaults(noEvent)
    },
  },
}
</script>
