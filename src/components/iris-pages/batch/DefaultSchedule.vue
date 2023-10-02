<template>
  <div 
    v-if="!isEmpty" 
    class="alert alert-info alert-manual-batch">
    <h4>{{ $t('batch_next_scheduled_title') }}</h4>
    <span 
      v-for="item in planned"
      :key="item.schedule"
      class="scheduled">
      {{ item.next_schedule|dateTime }} -
      <strong>{{ item.description }}</strong> - 
      ({{ item.default_plan }})
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DefaultScheduled',
  computed: {
    ...mapState('masters', ['batchTypes']),
    planned() {
      return this.batchTypes.filter(b => b.user_retry)
    },
    isEmpty() {
      return !this.batchTypes || this.planned.length == 0
    },
  },
}
</script>

<style lang="scss">
.alert-manual-batch {
  color: white;
  padding: 20px;
  width: 100%;
  .list {
    min-height: 0;
  }
  .scheduled {
    line-height: 25px;
    font-size: 18px;
    display: block;
  }
  .see-all {
    text-align: right;
    font-size: 10px;
  }
}
</style>
