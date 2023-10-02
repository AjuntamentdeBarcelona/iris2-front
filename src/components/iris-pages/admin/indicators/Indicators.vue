<template>
  <div class="d-flex flex-wrap justify-content-between">
    <!-- Selected group indicators -->
    <div class="indicators-category mb-auto">
      <indicator
        v-for="indicator in indicators"
        :key="indicator.key"
        :number="ambitData[indicator.key]"
        :text="indicator.text"
        :active-indicator="activeIndicator"
        :class="getIndicatorClass(indicator)"
        class="text-uppercase cursor-pointer"
        @click.native="selectIndicator(indicator.key)"
      />
    </div>
    <div
      v-if="ambitData.childrens"
      class="indicators-content">
      <indicator
        :number="ambitData['own_' + activeIndicator]"
        :text="ambitData.group_name"
        class="indicator-list"
      />
      <!-- First tier children -->
      <b-card-header
        v-for="child in childrens"
        :key="child.group_id"
        header-tag="header"
        class="p-0 border-0"
        role="tab"
        @click="requestChildrenData(child)"
      >
        <indicator
          v-b-toggle="'accordion-' + child.group_id"
          :number="child[activeIndicator]"
          :text="child.group_name"
          class="indicator-list indicator-list--child"
        >
          <font-awesome-icon
            v-if="requestedGroup === child.group_id"
            icon="spinner"
            class="fa-pulse mr-2 ml-auto"
          />
          <font-awesome-icon
            v-else-if="arrowRenderCondition(child)"
            icon="sort-down"
            class="mx-2"
          />
        </indicator>
        <!-- Second tier children -->
        <b-collapse
          :id="'accordion-' + child.group_id"
          role="tabpanel"
          class="p-0 m-0">
          <indicator
            v-if="child.childrens.length > 0"
            :number="child['own_' + activeIndicator]"
            :text="child.group_name"
            class="indicator-list indicator-list--grandchild"
          />
          <indicator
            v-for="grandson in child.childrens"
            :key="grandson.group_id"
            :number="grandson[activeIndicator]"
            :text="grandson.group_name"
            class="indicator-list active indicator-list--grandchild"
          />
        </b-collapse>
      </b-card-header>
    </div>
  </div>
</template>

<script>
import Indicator from '~/components/iris-pages/admin/indicators/Indicator'
import _ from 'lodash'

export default {
  components: {
    Indicator,
  },
  props: {
    ambitData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      requestedGroup: null,
      activeIndicator: 'pending_validation',
      indicators: [
        {
          key: 'pending_validation',
          text: this.$t('record_card_pending_validation'),
          style: 'pending-validate',
        },
        {
          key: 'processing',
          text: this.$t('record_card_processing'),
          style: 'tramitation',
        },
        {
          key: 'near_expire',
          text: this.$t('record_card_near_expire'),
          style: 'pending-expiration',
        },
        {
          key: 'expired',
          text: this.$t('record_card_expired'),
          style: 'expired',
        },
      ],
    }
  },
  computed: {
    childrens() {
      return _.sortBy(this.ambitData.childrens, 'group_name').map(item => {
        return {
          ...item,
          childrens: _.sortBy(item.childrens, 'group_name'),
        }
      })
    },
  },
  watch: {
    ambitData(val, oldVal) {
      this.requestedGroup = null
    },
  },
  methods: {
    getIndicatorClass(indicator) {
      return {
        'indicator--active': indicator.key === this.activeIndicator,
        [indicator.style]: true,
      }
    },
    selectIndicator(indicatorKey) {
      this.activeIndicator = indicatorKey
    },
    requestChildrenData(group) {
      if (
        !group.hasOwnProperty('childrens') ||
        (group.hasOwnProperty('childrens') &&
          Array.isArray(group.childrens) &&
          !group.childrens.length &&
          !group.loaded)
      ) {
        this.requestedGroup = group.group_id
        this.$emit('request-child-data', group.group_id)
      }
    },
    arrowRenderCondition(child) {
      return (
        !child.hasOwnProperty('childrens') ||
        (child.hasOwnProperty('childrens') &&
          child.childrens !== null &&
          (child.childrens.length > 0 || !child.loaded))
      )
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .groups {
  max-height: 450px;
  overflow-y: auto;
}

.indicators-content {
  flex-grow: 4;
  width: 300px;
  padding: 1rem;
  max-height: 500px;
  overflow: auto;
}

.indicators-category {
  flex: 1 1 auto;
  width: 225px;
  flex-wrap: wrap;
  display: flex;
}
</style>
