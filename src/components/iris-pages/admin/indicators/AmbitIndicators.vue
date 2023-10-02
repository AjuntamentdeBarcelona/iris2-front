<template>
  <loader v-if="loading"/>
  <div
    v-else
  >
    <div class="row form-group pb-0 align-items-center mt-3 mb-1">
      <div class="col-12 col-md-5 col-lg-4 col-xl-4">

        <label
          for="month-ambit-indicator-group-select"
          class="ml-2 text-nowrap"
        >{{ $t('indicators_ambit_group') }}</label>
      </div>

      <div
        class="col-12 col-md-7 col-lg-8 col-xl-8"
      >
        <v-select
          v-model="selectedAmbitGroup"
          :options="apiCalls.ambitGroups.data"
          :clearable="false"
          label="description"
          input-id="month-ambit-indicator-group-select"
          class="mr-2 ml-1"
        />
      </div>
    </div>
    <indicators
      :ambit-data="apiCalls.ambitData.data"
      @request-child-data="requestChildData"
    />
  </div>
</template>

<script>
import Indicators from '~/components/iris-pages/admin/indicators/Indicators'
import vSelect from 'vue-select'
import Loader from '~/components/utils/Loader'
import { mapState } from 'vuex'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'

export default {
  name: 'AmbitIndicators',
  components: { Indicators, Loader, vSelect },
  data() {
    return {
      selectedAmbitGroupModel: {},
      apiCalls: {
        ambitData: {
          data: {},
          loaded: false,
          error: false,
        },
        ambitGroups: {
          data: [],
          loaded: false,
          error: false,
        },
      },
    }
  },
  computed: {
    loading() {
      return Object.values(this.apiCalls)
        .map(ac => ac.loaded)
        .some(v => !v)
    },
    selectedAmbitGroup: {
      get() {
        return this.selectedAmbitGroupModel
      },
      set(newValue) {
        // v-select component deletes the value on empty input text (maybeDeleteValue function)
        if (newValue) {
          // prevent the assignment of null value
          this.selectedAmbitGroupModel = newValue
        } else {
          // force a model update on the current group so that the input text gets repopulated
          this.selectedAmbitGroupModel = { ...this.selectedGroup }
        }
      },
    },
    ...mapState('groups', ['selectedGroup']),
  },
  watch: {
    selectedAmbitGroupModel(val, oldVal) {
      this.loadAmbitData(val.id)
    },
  },
  created() {
    this.setCurrentGroup()
    this.loadAmbitData(this.selectedAmbitGroup.id)
    this.loadGroupTree()
  },
  methods: {
    async requestChildData(childId) {
      const childMatch = this.apiCalls.ambitData.data.childrens.find(
        child => child.group_id === childId
      )

      if (childMatch.children) {
        // Already loaded
        return
      }

      let subChildren = null

      try {
        const ambitData = await this.getAmbitData(childId)
        if (ambitData.childrens && ambitData.childrens.length) {
          subChildren = ambitData.childrens
        }
      } catch (error) {
      } finally {
        this.$set(childMatch, 'childrens', subChildren)
        childMatch.loaded = true
        if (childMatch.childrens) {
          Object.assign(childMatch, this.calculateOwn(childMatch))
        }
        this.apiCalls.ambitData.data = {
          ...this.apiCalls.ambitData.data,
        }
      }
    },
    setCurrentGroup() {
      this.selectedAmbitGroup = { ...this.selectedGroup }
    },
    async loadAmbitData(groupId) {
      this.apiCalls.ambitData.loaded = false
      this.apiCalls.ambitData.error = false
      try {
        this.apiCalls.ambitData.data = await this.getAmbitData(groupId)
      } catch (error) {
        this.apiCalls.ambitData.error = true
      } finally {
        this.apiCalls.ambitData.loaded = true
      }
    },
    async getAmbitData(groupId) {
      let data = {}
      try {
        const response = await this.$axios.get(
          `/api/record_cards/record_cards/summary/ambit/${groupId}/`
        )
        data = {
          ...this.calculateOwn(response.data),
          loaded: true,
          group_name: this.selectedAmbitGroupModel.description,
        }
      } catch (error) {
      } finally {
        return data
      }
    },
    async loadGroupTree() {
      this.apiCalls.ambitGroups.loaded = false
      this.apiCalls.ambitGroups.error = false
      let ambitGroups = []

      try {
        const response = await this.$axios.get('api/profiles/groups/tree/')
        ambitGroups = this.getAmbitGroups([this.findGroup(response.data)]).sort(
          compareFnByDescriptionAsc
        )
      } catch (error) {
        this.apiCalls.ambitGroups.error = true
      } finally {
        this.apiCalls.ambitGroups.data = ambitGroups
        this.apiCalls.ambitGroups.loaded = true
      }
    },
    /**
     * Calculate the selected group numbers without its childrens.
     * AmbitData contains the children list and totals, so we calculate
     * it by substrating the children number to the total.
     */
    calculateOwn(groupData) {
      const indicators = [
        'pending_validation',
        'near_expire',
        'processing',
        'expired',
      ]
      let acumulator = { ...groupData }
      for (const ind of indicators) {
        acumulator['own_' + ind] = groupData[ind]
      }
      return groupData.childrens.reduce((acumulator, value) => {
        for (const ind of indicators) {
          acumulator['own_' + ind] -= value[ind]
        }
        return acumulator
      }, acumulator)
    },
    findGroup(groupTree) {
      if (groupTree.id == this.selectedGroup.id) {
        return groupTree
      }
      let result = null
      for (const child of groupTree.childrens) {
        result = this.findGroup(child)
        if (result) {
          return result
        }
      }
      return result
    },
    getAmbitGroups(ambitData) {
      const reducer = (accumulator, currentValue) => {
        if (currentValue.childrens && currentValue.childrens.length) {
          accumulator.push({
            id: currentValue.id,
            description: currentValue.name,
          })

          currentValue.childrens.forEach(child => {
            accumulator.push(...this.getAmbitGroups([child]))
          })
        }
        return accumulator
      }

      return ambitData.reduce(reducer, [])
    },
  },
}
</script>

<style lang="scss" scoped>
.loader.irisbox {
  margin-bottom: 0;
  height: 100%;
}

/deep/ .v-select .vs__selected-options {
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  .selected-tag {
    width: 100%;
    padding: 0.1em;
  }
}
/deep/ .v-select input[type='search'].form-control,
/deep/ .v-select input[type='search'].form-control:focus {
  position: absolute;
}

/deep/ .dropdown-toggle::after {
  display: none;
}
</style>
