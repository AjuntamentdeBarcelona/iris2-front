<script>
import Table from '~/components/pages/list/table'
import RecordId from '~/components/tables/columns/RecordId'

export default {
  name: 'SimilarRecordsTable',
  extends: Table,
  props: {
    listResultType: {
      type: String,
      default: 'list_result_type.record_card',
    },
  },
  data() {
    return {
      columns: ['normalized_record_id', 'actions'],
      options: {
        perPage: 5,
        columnsClasses: {
          normalized_record_id: 'align-middle',
        },
        headings: {
          normalized_record_id: this.$t('record_card_normalized_record_id'),
        },
        templates: { normalized_record_id: RecordId },
      },
    }
  },
}
</script>
