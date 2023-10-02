<template>
  <div class="mobile-geobcn">
    <geo-bcn 
      ref="geo"
      v-bind="$props"
      :class="{mapMode: map, formMode: !map}" 
      class="mobile"
      @address-selected="emitSelected"
      @address-deleted="emitDeleted" />
    <div class="mobile-side-btn">
      <a
        class="btn-mobile btn-danger"
        @click="geoLocate">
        <font-awesome-icon
          :icon="['fas', 'search-location']"/>
      </a>
      <a
        class="btn-mobile btn-danger"
        @click="toggleMode">
        <font-awesome-icon
          :icon="['fa', map ? 'pen' : 'map-marked-alt']"/>
      </a>

    </div>
  </div>
</template>


<script>
import GeoBcn from './GeoBcn'

/**
 * GeoBcn component addapted for mobile display
 */
export default {
  components: {
    GeoBcn,
  },
  props: {
    id: {
      type: String,
      default: 'map',
    },
    value: {
      type: Object,
      default: () => {
        return {}
      },
    },
    selectStair: {
      type: Boolean,
      default: false,
    },
    selectDoor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      map: true,
    }
  },
  methods: {
    toggleMode() {
      this.map = !this.map
    },
    geoLocate() {
      this.$refs.geo.geoLocate()
    },
    emitSelected(address) {
      this.$emit('address-selected', address)
    },
    emitDeleted(address) {
      this.$emit('address-deleted', {})
    },
  },
}
</script>

<style lang="scss">
.mobile-geobcn {
  .mobile-side-btn {
    bottom: 13.5rem;
  }
}
.geobcn.mobile {
  &.mapMode {
    .bcn-map {
      min-height: calc(100vh - 15.5rem);
    }
    .form-row {
      display: none;
    }
  }
  &.formMode {
    .bcn-map {
      display: none;
    }
    .form-row {
      padding: 20px;
    }
  }
}
</style>
