<script>
import TableList from '~/components/pages/list/table.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'OperatorList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/record_cards/internal-operators/',
    },
    title: {
      type: String,
      default: 'operators_title',
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
      default: 'list_result_type.operator',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN_USER,
    },
  },
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-access-operators-id',
      },
      columns: [
        'document',
        'applicant_type.description',
        'input_channel.description',
      ],
      addUrl: {
        name: 'backoffice-admin-access-operators-add',
      },
      options: {
        perPage: 200,
        headings: {
          document: this.$t('id_card_citizen'),
          'applicant_type.description': this.$t('applicant_type'),
          'input_channel.description': this.$t('input_channel'),
        },
        filterable: true,
        sortable: [
          'document',
          'applicant_type.description',
          'input_channel.description',
        ],
      },
    }
  },
}
</script>
