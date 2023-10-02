<script>
import RecordCardSearchList from '~/components/iris-pages/records/RecordCardSearchList.vue'

export default {
  name: 'PendingRecordCardList',
  extends: RecordCardSearchList,
  layout: 'Tasks',
  props: {
    url: {
      type: String,
      default: '/api/record_cards/record_cards/my-tasks/',
    },
    showUserPlate: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
