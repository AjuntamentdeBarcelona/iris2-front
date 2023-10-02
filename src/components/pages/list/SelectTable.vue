<template>
  <div class="table-wrapper">
    <slot
      :selected="selected"
      name="before-table" />
    <slot />
    <slot
      :selected="selected"
      name="after-table" />
  </div>
</template>


<script>
import TablePlugin from './TablePlugin.vue'
import SelectColumn from './columns/SelectColumn.vue'
import Vuex from 'vuex'

export function getSelectTableStore() {
  return new Vuex.Store({
    state: {
      idAttr: 'id',
      selected: {},
    },
    mutations: {
      setId(state, idAttr) {
        state.idAttr = idAttr
      },
      selected(state, [isSelected, row]) {
        if (isSelected) {
          state.selected[row[state.idAttr]] = row
        } else {
          delete state.selected[row[state.idAttr]]
        }
      },
    },
    getters: {
      isSelected: state => row => {
        return state.selected[row[state.idAttr]] !== undefined
      },
    },
  })
}

/**
 * Table wich elements can be selected. The component will $emit events whenever
 * the selection changes.
 *
 * It's responsability of the parent component to decide and implement which
 * actions can be done with the selection.
 */
export default {
  name: 'SelectTable',
  extends: TablePlugin,
  provide() {
    return {
      onRowSelected(selected, instance) {
        this.addSelect(selected, instance)
      },
      selectStore: this.selectStore,
    }
  },
  props: {
    idAttr: {
      type: String,
      default: 'id',
    },
    initial: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      selected: [],
    }
  },
  watch: {
    initial: {
      handler() {
        if (this.initial != this.selected) {
          this.selected = this.initial
          for (const row of this.selected) {
            this.selectStore.commit('selected', [true, row])
          }
        }
      },
      immediate: true,
    },
  },
  beforeCreate() {
    this.selectStore = getSelectTableStore()
  },
  created() {
    this.selectStore.subscribe((mutation, state) => {
      this.selected = Object.values(state.selected)
      this.$emit('selected-change', this.selected)
    })
  },
  methods: {
    getPluginColumns() {
      return {
        selectable: {
          template: SelectColumn,
          header: '',
        },
      }
    },
  },
}
</script>
