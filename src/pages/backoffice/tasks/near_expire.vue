<script>
import RecordCardSearchList from '~/components/iris-pages/records/RecordCardSearchList.vue'

export default {
  name: 'NearExpireRecordCardList',
  extends: RecordCardSearchList,
  layout: 'Tasks',
  props: {
    title: {
      type: String,
      default: 'record_card_near_expire',
    },
    url: {
      type: String,
      default:
        '/api/record_cards/record_cards/my-tasks/?near_expire=1&include_pending',
    },
    showUserPlate: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
