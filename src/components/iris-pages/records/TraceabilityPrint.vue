<template>
  <loader v-if="!ready"/>
  <div v-else>
    <div 
      v-for="(categoryData, key) in tableData"
      :key="key">
      <h3>{{ categoryData.title }}</h3>
      <traceability-table
        ref="table"
        :items-per-page="undefined"
        :prop-data="categoryData.data"
      />
    </div>
  </div>
</template>

<script>
import Traceability from './Traceability.vue'
import TraceabilityTablePrint from './TraceabilityTablePrint'

/**
 * Elaborates three lists to feed three different tables: Alarms, Process and Audit
 */
export default {
  name: 'TraceabilityPrint',
  components: {
    TraceabilityTablePrint,
  },
  extends: Traceability,
}
</script>
