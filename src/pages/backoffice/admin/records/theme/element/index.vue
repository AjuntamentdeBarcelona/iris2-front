<script>
import TableList from '~/components/pages/list/table.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'
import IsIssue from '~/components/iris-pages/themes/IsIssue.vue'
import IsQuery from '~/components/iris-pages/themes/IsQuery.vue'

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'ElementList',
  extends: TableList,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/elements/',
    },
    title: {
      type: String,
      default: 'Elements',
    },
    enableSaveOrdering: {
      type: Boolean,
      default: true,
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.element',
    },
    orderUrl: {
      type: String,
      default: '/api/theme/element',
    },
  },
  data() {
    return {
      columns: this.getColumns(),
      addUrl: {
        name: 'backoffice-admin-records-theme-element-add',
      },
      detailUrl: {
        name: 'backoffice-admin-records-theme-element-id',
      },
      translated: ['description'],
      options: {
        filterable: true,
        perPage: 200,
        headings: {
          is_issue: this.$t('element_issue'),
          is_query: this.$t('element_query'),
          'area.description': this.$t('area'),
          description: this.$t('description'),
        },
        templates: {
          is_issue: IsIssue,
          is_query: IsQuery,
        },
        sortable: ['description'],
      },
    }
  },
  computed: {
    /**
     * Adapted local storage key so it isn't area dependant
     */
    lsKeyName() {
      return `${/.+\/(?! [0-9]+)/.exec(this.$route.path)[0]}.${
        this.$options.name
      }`
    },
  },
  methods: {
    getColumns() {
      const columns = ['is_query', 'is_issue', 'description']
      return this.isAreaFiltered()
        ? columns
        : ['area.description'].concat(columns)
    },
    isAreaFiltered() {
      return this.queryParams['area_id'] != null
    },
  },
}
</script>
