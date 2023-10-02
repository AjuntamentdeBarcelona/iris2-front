<script>
import RecordCardSearchList from '~/components/iris-pages/records/RecordCardSearchList.vue'

export default {
  name: 'UrgentRecordCardList',
  extends: RecordCardSearchList,
  layout: 'Tasks',
  props: {
    title: {
      type: String,
      default: 'record_card_urgent',
    },
    url: {
      type: String,
      default:
        '/api/record_cards/record_cards/my-tasks/?urgent=1&include_pending',
    },
    showUserPlate: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
