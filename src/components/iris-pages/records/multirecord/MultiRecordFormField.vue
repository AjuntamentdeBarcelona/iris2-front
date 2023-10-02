<template>
  <multi-record-list 
    v-if="record" 
    :record="record" />
</template>


<script>
import MultiRecordList from '~/components/iris-pages/records/multirecord/MultiRecordList.vue'

export default {
  name: 'MultiRecordFormField',
  components: {
    MultiRecordList,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    record() {
      return this.model.multirecord_from
    },
  },
}
</script>
