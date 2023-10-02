<script>
import TableList from '~/components/pages/list/table.vue'

export default {
  name: 'RecordTypeList',
  extends: TableList,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/masters/record_types/',
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.record_type',
    },
  },
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-records-templates-record-types-id',
      },
      columns: ['description'],
      options: {
        perPage: 15,
        headings: {
          description: this.$t('description'),
        },
      },
    }
  },
  computed: {
    pageTitle() {
      return this.$t('record_type_title')
    },
  },
}
</script>
