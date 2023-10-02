<script>
import TableList from '~/components/pages/list/table.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'ProfileList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/profiles/profiles/',
    },
    title: {
      type: String,
      default: 'navigation_profiles',
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.profile',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN,
    },
  },
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-access-profiles-id',
      },
      columns: ['description'],
      addUrl: {
        name: 'backoffice-admin-access-profiles-add',
      },
      options: {
        perPage: 200,
        headings: {
          description: this.$t('description'),
        },
        filterable: true,
        sortable: ['description'],
      },
    }
  },
}
</script>
