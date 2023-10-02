<script>
import RecordCardSearchList from '~/components/iris-pages/records/RecordCardSearchList.vue'

export default {
  name: 'RecordCardList',
  extends: RecordCardSearchList,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/record_cards/record_cards/',
    },
    formGroupOptions: {
      type: Object,
      default: () => ({
        advancedFiltersEnabled: true,
        unfoldBasicFilters: true,
        enableDisplayOnMap: true,
      }),
    },
    listWithFiltersOnly: {
      type: Boolean,
      default: true,
    },
    pageParameter: {
      type: String,
      default: 'CERCA_RESULTATS_IRIS',
      required: false,
    },
  },
}
</script>
