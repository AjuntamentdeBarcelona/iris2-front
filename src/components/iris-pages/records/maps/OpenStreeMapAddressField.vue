<template>
  <div
    class="geobcn"
  >
    <div class="form-row">
      <div
        v-for="(street, index) of addresses"
        :key="index"
        class="row w-100">
        
        <search-location 
          :location="street" 
          label="refresh"
          @addNewPoint="updateStreet(index, $event)" />
        
        <button
          class="btn btn-danger"
          @click="onRemoveStreet(index)"
          v-text="'-'"
        />
        
      </div>
      <search-location @addNewPoint="onSelectStreet" />
    </div>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import { uniqueId } from 'lodash'
import SearchLocation from './SearchLocation.vue'

/**
 * Extra schema options:
 * - multiple: enables adding multiple value pairs
 */
export default {
  name: 'OpenStreetMapAdressField',
  components: {
    SearchLocation,
  },
  mixins: [abstractField],
  data() {
    return {
      addresses: {},
      loadingMap: false,
      loadingError: false,
      initialModel: null,
    }
  },
  computed: {
    groupedValues() {
      return Object.entries(this.addresses).map(([id, loc]) => {
        return {
          description: `${loc.street} ${loc.street2}`,
          id: id,
          street: { value: loc.street, description: loc.street },
          number: { value: loc.street2, description: loc.street2 },
          location: loc,
        }
      })
    },
  },
  watch: {
    inputValues(val, oldVal) {
      this.value = val
    },
    value() {
      this.syncFromModel()
    },
  },
  mounted() {
    this.syncFromModel()
  },
  methods: {
    onSelectStreet(street) {
      const uid = uniqueId()
      this.$set(this.addresses, uid, street)
      this.syncToModel()
    },
    onRemoveStreet(uid) {
      let newVals = {
        ...this.addresses,
      }
      delete newVals[uid]
      this.addresses = newVals
      this.syncToModel()
    },
    updateStreet(uid, street) {
      this.$set(this.addresses, uid, street)
      this.syncToModel()
    },
    syncToModel() {
      this.value = this.groupedValues
    },
    syncFromModel() {
      let addresses = {}
      if (Array.isArray(this.value)) {
        for (const addr of this.value) {
          addresses[addr.id] = addr.location
        }
      }
      this.addresses = addresses
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .form-row {
  margin-right: unset;
  margin-left: unset;
}

/deep/ label {
  display: none;
}

/deep/ .unset-top {
  top: unset !important;
}

.form-size {
  height: 2.5rem;
}
</style>
