<template>
  <ul 
    :class="{ disabled: disabledSchema }" 
    class="nav justify-content-center record-types-readonly">
    <li 
      v-for="rtype in types"
      :key="rtype.id"
      class="nav-item">
      <span
        :class="rtype.badge" 
        class="badge badge-pill">{{ rtype.description }}
        <a 
          v-if="!disabledSchema"
          
          class="btn btn-sm"
          @click="remove(rtype)">
          <font-awesome-icon icon="trash" />
        </a>
      </span>
    </li>
  </ul>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import irisField from '~/components/form-generator/irisField.js'

export default {
  name: 'RecordTypesReadonly',
  mixins: [irisField, abstractField],
  props: {
    model: {
      type: Object,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  computed: {
    types() {
      if (!this.value) {
        return []
      }
      return this.value.map(item => {
        return {
          ...item,
          badge: this.getBadge(item),
        }
      })
    },
    disabledSchema() {
      return this.schema.disabled || !this.value || this.value.length == 1
    },
  },
  methods: {
    getBadge(item) {
      const badges = ['secondary', 'warning', 'danger', 'info']
      return 'badge-' + badges[item.record_type % badges.length]
    },
    remove(item) {
      this.value = this.value.filter(val => val.record_type != item.record_type)
    },
  },
}
</script>

<style>
.record-types-readonly .badge {
  padding: 5px 20px;
}
.record-types-readonly.disabled .badge {
  padding: 15px 30px;
}
</style>
