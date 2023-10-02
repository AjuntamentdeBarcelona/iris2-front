<template>
  <div class="table-wrapper">
    <slot name="before-table" />
    <slot />
    <slot name="after-table" />
  </div>
</template>

<script>
import Table from './table.vue'

/**
 * TablePlugin are components that can extend server Table components,
 * with new functionality that requires access, modification or addition
 * of columns. Since it needs this fine grained access, the components
 * need to pass props o receive events for this columns.
 *
 * The resulting TablePlugin component respects the original Table interface,
 * so a implementation with a Table can be replaced with a Table wrapper
 * transparently.
 *
 * Also, the TablePlugin can be used together for combining functionality,
 *  so it's important to assign one and only one responsability to each
 * TablePlugin. For example we could find an hierachy of this kind for
 * implementing a drag & drop ordetable table, wich items could be selected:
 *
 * OrderableTable
 * --> SelectTable
 * -----> Table
 */
export default {
  inject: {
    pluginColumns: {
      default() {
        return () => {
          return {}
        }
      },
    },
  },
  provide() {
    return {
      pluginColumns: {
        ...this.getPluginColumns(),
        ...this.pluginColumns,
      },
    }
  },
  methods: {
    getPluginColumns() {
      return {}
    },
  },
}
</script>
