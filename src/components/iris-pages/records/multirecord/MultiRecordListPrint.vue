<template>
  <multi-record-table
    v-if="mustLoad"
    :id="recordId" 
    @loaded="loaded"/>
</template>


<script>
import MultiRecordTable from '~/components/iris-pages/records/multirecord/MultiRecordTable.vue'

export default {
  name: 'MultirecordList',
  components: {
    MultiRecordTable,
  },
  props: {
    record: {
      type: [Object, Number],
      required: true,
    },
  },
  computed: {
    recordId() {
      return this.record.id != null ? this.record.id : this.record
    },
    mustLoad() {
      if (this.record.id != null) {
        return this.record.is_multirecord || this.record.multirecord_from
      }
      return true
    },
  },
  created() {
    this.$emit('mustTobeLoaded', 'multiRecordList')
  },
  methods: {
    loaded(e) {
      this.$emit('loadedComponent', 'multiRecordList')
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ {
  .VueTables {
    padding: 0;
    margin: 0;
    border: none;
  }
  .VuePagination {
    display: none;
  }
}
</style>
