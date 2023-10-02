<script>
import TableList from '~/components/pages/list/table.vue'

export default {
  name: 'AnswerTypeList',
  extends: TableList,
  layout: 'backoffice',
  props: {
    url: {
      type: String,
      default: '/api/masters/response_types/',
    },
    listResultType: {
      type: String,
      default: 'list_result_type.response_type',
    },
  },
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-records-templates-answer-types-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-templates-answer-types-add',
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
      return this.$t('response_type_title')
    },
  },
}
</script>
