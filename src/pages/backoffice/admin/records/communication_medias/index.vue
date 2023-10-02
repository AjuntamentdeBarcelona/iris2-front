<script>
import TableList from '~/components/pages/list/table.vue'

export default {
  name: 'SimpleMasterList',
  extends: TableList,
  layout: 'Masters',
  props: {
    url: {
      type: String,
      default: '/api/masters/communication_medias/',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.communication_media',
    },
  },
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-records-communication_medias-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-communication_medias-add',
      },
      columns: ['description'],
      options: {
        perPage: 15,
        headings: {
          description: this.$t('description'),
        },
        filterable: true,
        sortable: ['description'],
      },
    }
  },
  computed: {
    /**
     * @returns Page title as i18n key. The type will be transformed to lower case, and the "-" will be replaced with undescores.
     */
    pageTitle() {
      return this.$t('communication_medias')
    },
  },
}
</script>
