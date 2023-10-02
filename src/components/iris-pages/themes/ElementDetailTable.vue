<script>
import Table from '~/components/pages/list/table'
import BooleanColumn from '~/components/pages/list/columns/BooleanColumn'
import DateColumn from '~/components/pages/list/columns/DateColumn'

export default {
  name: 'ElementDetailTable',
  extends: Table,
  props: {
    url: {
      type: String,
      default: '/api/theme/details/',
    },
    title: {
      type: String,
      default: 'Detalls',
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
      default: 'list_result_type.detail',
    },
  },
  data() {
    return {
      columns: [
        'element.area.description',
        'element.description',
        'description',
        'is_visible',
        'active',
        'activation_date',
      ],
      translated: ['description'],
      addUrl: {
        name: 'backoffice-admin-records-theme-detail-add',
      },
      detailUrl: {
        name: 'backoffice-admin-records-theme-detail-id',
      },
      options: {
        perPage: 200,
        templates: {
          is_visible: BooleanColumn,
          active: BooleanColumn,
          activation_date: DateColumn,
        },
        headings: {
          name: this.$t('name'),
          'element.description': this.$t('element'),
          'element.area.description': this.$t('area'),
          description: this.$t('description'),
          is_visible: this.$t('visible'),
          active: this.$t('detail_active_active'),
          activation_date: this.$t('detail_activation_from_abbv'),
        },
        sortable: ['description', 'active', 'activation_date'],
        columnsClasses: {
          is_visible: 'text-center',
          active: 'text-center',
          activation_date: 'text-center',
        },
      },
      disabledDeleteMessage: this.$t('delete_related_message_detail'),
    }
  },
  computed: {
    /**
     * Adapted local storage key so it isn't element dependant
     */
    lsKeyName() {
      return `${/.+\/(?! [0-9]+)/.exec(this.$route.path)[0]}.${
        this.$options.name
      }`
    },
  },
  methods: {
    getColumns() {
      const columns = ['description']
      return this.isAreaFiltered()
        ? columns
        : ['area.description'].concat(columns)
    },
    isDetailFiltered() {
      return this.queryParams['element_id'] != null
    },
    adjustOrderingParams(params) {
      if (params.ordering == '-active') {
        params.ordering = '-active,-activation_date'
      } else if (params.ordering == 'active') {
        params.ordering = 'active,activation_date'
      }
      return params
    },
    /**
     * Overwritten
     */
    onDelete(row) {
      this.$emit('delete-request', row)
    },
  },
}
</script>
