<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Table from '~/components/pages/list/table'

export default {
  extends: Table,
  mixins: [AdminMixin],
  layout: 'Masters',
  props: {
    url: {
      type: String,
      default: '/api/masters/applicant_types/',
    },
    title: {
      type: String,
      default: 'navigation_applicant_type',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.applicant_type',
    },
  },
  data() {
    return {
      columns: ['description'],
      detailUrl: {
        name: 'backoffice-admin-records-applicant-types-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-applicant-types-types',
      },
      options: {
        filterable: true,
        sortable: ['description'],
        headings: {
          description: this.$t('description'),
        },
      },
    }
  },
}
</script>
