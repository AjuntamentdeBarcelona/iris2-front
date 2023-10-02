<template>
  <div class="col-12">
    <h3>{{ $t('table_order_items') }}</h3>
    <p>{{ $t('table_order_items_explain') }}</p>
    <div 
      v-if="loading" 
      class="loading-overlay">
      <div class="loader"/>
    </div>
    <draggable
      :value="items"
      :disabled="loading"
      class="list-group draggable"
      ghost-class="ghost"
      @change="checkMove"
    >
      <div
        v-for="(item, idx) in items"
        :key="item[idField]" 
        class="list-group-item">
        {{ idx }} - 
        {{ item[labelField] }}
      </div>
    </draggable>
  </div>
</template>


<script>
import draggable from 'vuedraggable'
import _ from 'lodash'

/**
 * Drag&Drop ordering a list of items, with post requests for each ordering.
 * Its prepared for sending request using the /set-order/ calls from backend.
 */
export default {
  name: 'DragAndOrderPage',
  components: {
    draggable,
  },
  props: {
    itemList: {
      type: Array,
      default: () => [],
    },
    setOrderUrl: {
      type: String,
      default: '',
    },
    orderField: {
      type: String,
      default: 'order',
    },
    idField: {
      type: String,
      default: 'id',
    },
    labelField: {
      type: String,
      default: 'description',
    },
  },
  data() {
    return {
      items: this.getData(),
      loading: false,
    }
  },
  methods: {
    getData() {
      return _.orderBy(this.itemList, this.orderField).map((item, idx) => ({
        ...item,
        order: idx,
      }))
    },
    sendToServer(item, position) {
      const url = this.getUrl(item, position)
      this.loading = true
      this.$axios
        .post(url)
        .then(resp => resp)
        .catch(resp => {
          this.$notify({
            group: 'iris',
            title: this.$t('table_order_error_title'),
            type: 'error',
            text: this.$t('table_order_error'),
          })
        })
        .then(() => {
          this.loading = false
        })
    },
    getUrl(item, position) {
      return `${this.setOrderUrl}/${item[this.idField]}/set-order/${position}/`
    },
    checkMove: function({ moved }) {
      this.items.splice(moved.oldIndex, 1)
      this.items.splice(moved.newIndex, 0, moved.element)
      this.sendToServer(moved.element, moved.newIndex)
    },
  },
}
</script>
<style lang="scss">
.draggable .list-group-item {
  cursor: pointer;
}
</style>
