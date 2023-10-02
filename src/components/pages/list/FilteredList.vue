<template>
  <div class="filtered-list">
    <header class="d-flex justify-content-between">
      <h1 class="title-line">{{ pageTitle }}</h1>
      <slot name="titleButtons"/>
    </header>
    <slot name="form">
      <component
        ref="form"
        :is="filterFormComponent"
        :definition="filterFormFinalDefinition"
        :save-on-submit="false"
        @submit="onFormUpdated"
      />
    </slot>
    <slot name="list">
      <component
        ref="list"
        :is="listComponent"
        v-bind="alteredListProps"
        :query-params="filterParams"
        v-on="listEventHandlers"
      >
        <template
          v-for="(value, name) in bypassedSlots"
          slot-scope="slotProps"
          :slot="name"
        >
          <slot
            v-bind="slotProps"
            :name="name"
          />
        </template>
      </component>
    </slot>
  </div>
</template>

<script>
import FilterForm from '~/components/pages/form/FilterForm'
import { isFunction } from 'lodash'

export default {
  name: 'FilteredList',
  layout: 'backoffice',
  props: {
    title: {
      type: String,
      default: '',
    },
    filterFormComponent: {
      type: Object,
      default: () => FilterForm,
    },
    filterFormDefinition: {
      type: [Object, Function],
      default: () => undefined,
    },
    listComponent: {
      type: Object,
      required: true,
    },
    listProps: {
      type: Object,
      default: () => ({ queryParams: {} }),
    },
    listEventHandlers: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      filterParams: {},
      filterFormFinalDefinition: this.getFilterFormFinalDefinition(),
    }
  },
  computed: {
    pageTitle() {
      return this.$t(this.title)
    },
    bypassedSlots() {
      const reducer = (accumulator, currentValue) => {
        accumulator[currentValue] = this.$scopedSlots[currentValue]

        return accumulator
      }

      return Object.keys(this.$scopedSlots)
        .filter(key => key !== 'titleButtons')
        .reduce(reducer, {})
    },
    overrideListProps() {
      return {
        title: '',
        queryParams: this.filterParams,
      }
    },
    alteredListProps() {
      return { ...this.listProps, ...this.overrideListProps }
    },
  },
  created() {
    this.filterParams = this.listProps.queryParams
  },
  methods: {
    getFilterFormFinalDefinition() {
      if (this.filterFormDefinition) {
        if (isFunction(this.filterFormDefinition)) {
          return this.filterFormDefinition(this)
        }
        return this.filterFormDefinition
      }
      return undefined
    },
    async onFormUpdated(model) {
      this.updateFilterParams(model)
      await this.$nextTick()
      this.refreshList()
    },
    /**
     * Hook method for performing additional data transformations before sending the data to the
     * server.
     */
    getFilterParams(formData) {
      return formData
    },
    /**
     * queryParams are placed last, so that you can overwrite from outside, certain model properties
     * Useful for schemaForm's automatic getUrlInitial which often places an id if the route provides it
     */
    updateFilterParams(model) {
      this.filterParams = {
        ...this.getFilterParams(model),
        ...this.listProps.queryParams,
      }
    },
    refreshList() {
      if (this.$refs.list) {
        this.$refs.list.refresh()
      }
    },
  },
}
</script>
