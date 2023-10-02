<script>
import Table from '~/components/pages/list/table'
import SupportDocFile from '~/components/tables/columns/SupportDocFile'
import SupportCategory from '~/components/tables/columns/SupportCategory'
import { supportEndpoint, supportInfoType } from '~/assets/js/iris2/constants'

export default {
  name: 'DocsSupportTable',
  extends: Table,
  props: {
    url: {
      type: String,
      default: supportEndpoint,
    },
    queryParams: {
      type: Object,
      default: () => ({
        type: supportInfoType().documentation.id,
        category: undefined,
      }),
    },
    listResultType: {
      type: String,
      default: 'list_result_type.document',
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        'title',
        'category',
        'description',
        'file',
        ...(this.adminFeatures ? ['external-actions'] : []),
      ],
      options: {
        headings: {
          title: this.$t('title'),
          category: this.$t('support_category'),
          description: this.$t('description'),
          file: this.$t('record_card_file'),
          ...(this.adminFeatures
            ? { 'external-actions': this.$t('actions') }
            : {}),
        },
        templates: {
          category: SupportCategory,
          file: SupportDocFile,
        },
        columnsClasses: {
          file: 'text-center',
        },
        sortable: ['title', 'description'],
      },
    }
  },
  computed: {
    tableClasses() {
      return ['col-12']
    },
  },
}
</script>
