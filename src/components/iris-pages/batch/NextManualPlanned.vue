<template>
  <div 
    v-if="!isEmpty" 
    class="alert alert-danger alert-manual-batch">
    <h4>{{ $t('batch_manual_next_scheduled') }}</h4>
    <list 
      :url="url" 
      @loaded="onLoad">
      <template
        slot="list-items"
        slot-scope="{ item }">
        <span class="scheduled">
          {{ item.task }} - 
          {{ item.scheduled_date|dateTime }} -
          {{ $t('requested_by') }} {{ item.created_by }}
        </span>
      </template>
    </list>
  </div>
</template>

<script>
import List from '~/components/pages/list/List.vue'

export default {
  name: 'NextManualPlanned',
  components: {
    List,
  },
  data() {
    return {
      isEmpty: false,
    }
  },
  computed: {
    url() {
      return '/api/integrations/tasks/scheduled/?next=True'
    },
  },
  methods: {
    onLoad(items) {
      this.isEmpty = items.length == 0
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
