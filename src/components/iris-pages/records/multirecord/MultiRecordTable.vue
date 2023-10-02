<script>
import TableList from '~/components/pages/list/table.vue'
import RecordId from '~/components/tables/columns/RecordId'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'
import RecordStateColumn from '~/components/pages/list/columns/RecordStateColumn.vue'

export default {
  name: 'MultiRecordTable',
  extends: TableList,
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/{id}/multi_complaints/',
    },
    title: {
      type: String,
      default: '',
    },
    listResultType: {
      type: String,
      default: 'list_result_type.record_card',
    },
  },
  data() {
    return {
      columns: [
        'multirecord_from',
        'normalized_record_id',
        'element_detail.element.area.description',
        'element_detail.element.description',
        'element_detail.description',
        'record_state',
        'created_at',
      ],
      options: {
        perPage: 200,
        headings: {
          multirecord_from: 'Principal',
          normalized_record_id: this.$t('record_card_normalized_record_id'),
          'element_detail.element.area.description': 'Àrea',
          'element_detail.element.description': 'Element',
          'element_detail.description': 'Detall',
          record_state: 'Estat',
          created_at: this.$t('notifications_created_at'),
        },
        templates: {
          normalized_record_id: RecordId,
          multirecord_from: function(h, row, index) {
            const isMain = row.multirecord_from == null
            const text = this.$t('multirecord_main')
            return isMain ? <span class="badge badge-danger">{text}</span> : ''
          },
          record_state: RecordStateColumn,
          created_at: DateTimeColumn,
        },
      },
    }
  },
  methods: {
    getUrl() {
      return this.url.replace('{id}', '' + this.id)
    },
  },
}
</script>
