<script>
import Table from '~/components/pages/list/table'
import { supportEndpoint } from '~/assets/js/iris2/constants'
import SupportResultType from '~/components/tables/columns/SupportResultType'

export default {
  name: 'FilterResultsTable',
  extends: Table,
  props: {
    url: {
      type: String,
      default: supportEndpoint,
    },
    queryParams: {
      type: Object,
      required: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.result',
    },
  },
  data() {
    return {
      columns: ['type', 'title', 'description'],
      options: {
        sortable: ['type', 'title'],
        headings: {
          type: this.$t('support_type'),
          title: this.$t('title'),
          description: this.$t('description'),
        },
        templates: {
          type: SupportResultType,
        },
        rowClassCallback() {
          return 'cursor-pointer'
        },
      },
    }
  },
  watch: {
    queryParams(value, oldVal) {
      this.refresh()
    },
  },
  methods: {
    onRowClick({ row }) {
      this.emitSelection(row)
    },
    emitSelection(item) {
      this.$emit('item-selected', item)
    },
  },
}
</script>
