<template>
  <div class="table-cell">
    <p
      :title="display">
      {{ display }}</p>
  </div>
</template>


<script>
import _ from 'lodash'

export default {
  name: 'DivColumn',
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
  computed: {
    display() {
      return _.get(this.data, this.column, '-')
    },
  },
}
</script>
<style lang="scss">
.table-cell {
  height: 40px;
  margin: 0;
  overflow: hidden;
}
</style>
