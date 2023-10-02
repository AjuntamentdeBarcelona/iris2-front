<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Table from '~/components/pages/list/table'
import BooleanColumn from '~/components/pages/list/columns/BooleanColumn'

export default {
  extends: Table,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/features/features/',
    },
    title: {
      type: String,
      default: 'navigation_attributes',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.feature',
    },
  },
  data() {
    return {
      columns: [
        'description',
        // 'values_type.description',
        // 'mask.description',
        'is_special',
      ],
      translated: ['description'],
      detailUrl: {
        name: 'backoffice-admin-records-attributes-id',
      },
      addUrl: {
        name: 'backoffice-admin-records-attributes-add',
      },
      options: {
        filterable: true,
        templates: {
          is_special: BooleanColumn,
        },
        headings: {
          'values_type.description': this.$t('values_list'),
          'mask.description': this.$t('features_mask'),
          description: this.$t('description'),
          is_special: this.$t('feature_is_special'),
        },
        sortable: [
          'description',
          'values_type.description',
          'mask.description',
          'is_special',
        ],
        columnsClasses: {
          is_special: 'text-center',
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .VueTables__search-field label {
  display: none;
}
</style>
