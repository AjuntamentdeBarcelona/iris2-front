<script>
import TableList from '~/components/pages/list/table.vue'
import RecordId from '~/components/tables/columns/RecordId'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'

export default {
  name: 'UnirecordTable',
  extends: TableList,
  props: {
    title: {
      type: String,
      default: '',
    },
    hidePagination: {
      type: Boolean,
      default: true,
      required: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.record_card',
    },
  },
  data() {
    return {
      columns: ['normalized_record_id', 'description', 'created_at'],
      options: {
        perPage: 200,
        headings: {
          normalized_record_id: this.$t('record_card_normalized_record_id'),
          'element_detail.element.area.description': 'Àrea',
          'record_state.description': 'Estat',
          created_at: this.$t('notifications_created_at'),
        },
        templates: {
          normalized_record_id: RecordId,
          created_at: DateTimeColumn,
        },
      },
    }
  },
}
</script>
