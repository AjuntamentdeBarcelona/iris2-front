<script>
import TableList from '~/components/pages/list/table.vue'
import SimpleMasterMixin from '~/pages/backoffice/admin/masters/SimpleMasterMixin.js'

export default {
  name: 'SimpleMasterList',
  extends: TableList,
  mixins: [SimpleMasterMixin],
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-masters-type-id',
        params: {
          type: this.getType(),
        },
      },
      addUrl: {
        name: 'backoffice-admin-masters-type-addMultDesc',
        params: {
          type: this.getType(),
        },
      },
      columns: ['description'],
      translated: this.isSingleDescription() ? [] : ['description'],
      options: {
        perPage: 15,
        filterable: true,
        sortable: ['description'],
        headings: {
          description: this.$t('description'),
        },
      },
    }
  },
  computed: {
    /**
     * @returns Page title as i18n key. The type will be transformed to lower case, and the "-" will be replaced with undescores.
     */
    pageTitle() {
      return this.$t(this.getType().replace('-', '_'))
    },
    deleteUrl() {
      return `${this.getUrl() + this.delete_id}/`
    },
  },
  methods: {
    /**
     * Overriden since we need to access this.$route to compose the translation key
     */
    getListResultType() {
      return `list_result_type.${this.$route.params.type}`
    },
  },
}
</script>
