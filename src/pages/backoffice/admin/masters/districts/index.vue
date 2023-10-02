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
      default: '/api/masters/districts/',
    },
    title: {
      type: String,
      default: 'Districts',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: ['name'],
      detailUrl: {
        name: 'backoffice-admin-masters-districts-id',
      },
      options: {
        filterable: false,
        sortable: ['name'],
        headings: {
          description: 'name',
        },
      },
    }
  },
}
</script>
