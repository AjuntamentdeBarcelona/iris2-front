<template>
  <div class="form-group field-checkbox big">
    <div class="field-wrap">
      <input
        v-model="selected"
        type="checkbox"
        @change="selectChanged"
      >
    </div>
  </div>
</template>

<script>
/**
 * Column component for selecting one or more rows.
 * This component is meant for work with the SelectTable plugin,
 * which is responsible of creating a selectStore provided to all of
 * its childrens. So, the communication with the SelectColumn and
 * the SelectTable is made through the selectStore and provide/inject.
 */
export default {
  inject: ['selectStore'],
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selected: this.selectStore.getters.isSelected(this.data),
    }
  },
  watch: {
    data(value, old) {
      if (old) {
        this.clearSelection(old)
      }
    },
  },
  beforeDestroy() {
    this.clearSelection()
  },
  methods: {
    clearSelection(data) {
      this.selected = false
      this.setSelection(data)
    },
    setSelection(data = undefined) {
      this.selectStore.commit('selected', [
        this.selected,
        this.getSelectedRow(data === undefined ? this.data : data),
      ])
    },
    selectChanged() {
      this.setSelection(this.data)
    },
    /**
     * This method can be overriden for customizing the data passed as
     * selection.
     */
    getSelectedRow(data) {
      return data
    },
  },
}
</script>
