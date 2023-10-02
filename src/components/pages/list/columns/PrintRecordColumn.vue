<template>
  <dynamic-tag-modal 
    :width="'900px'" 
    :show-scroll="true"
    red="dynamicmodal" >
    <font-awesome-icon icon="file-pdf" />
    <template slot="modal">
      <detail-record-print 
        :id-record="detailRecordId"
        :dynamic-class="classDetailRecordPrint"
      /> 
    </template>
  </dynamic-tag-modal>  
</template>


<script>
import DetailRecordPrint from '../../detail/DetailRecordPrint.vue'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'

export default {
  name: 'PrintRecordColumn',
  components: {
    DetailRecordPrint,
    DynamicTagModal,
  },
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
      classDetailRecordPrint: '',
    }
  },
  computed: {
    detailRecordId() {
      return [this.data.normalized_record_id]
    },
  },
  created() {
    // create a dynamic class so that the tables that have de selectable column can be hidden
    if (this.$route.fullPath.indexOf('/tasks') !== -1) {
      this.classDetailRecordPrint = 'fromTask'
    }
  },
}
</script>

<style>
</style>
