<script>
import RecordCardSearchList from '~/components/iris-pages/records/RecordCardSearchList.vue'

export default {
  name: 'ExpiredRecordCardList',
  extends: RecordCardSearchList,
  layout: 'Tasks',
  props: {
    title: {
      type: String,
      default: 'record_card_expired',
    },
    url: {
      type: String,
      default:
        '/api/record_cards/record_cards/my-tasks/?expired=1&include_pending',
    },
    showUserPlate: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
