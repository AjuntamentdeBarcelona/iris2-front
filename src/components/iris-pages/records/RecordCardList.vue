<script>
import TableList from '~/components/pages/list/table.vue'
import urgent from './urgent.vue'
import RecordCardAlarms from '~/components/tables/columns/RecordCardAlarms'
import RecordId from '~/components/tables/columns/RecordId'
import AnsLimitDate from '~/components/tables/columns/AnsLimitDate'
import DivColumn from '~/components/pages/list/columns/DivColumn'
import RecordStateColumn from '~/components/pages/list/columns/RecordStateColumn.vue'
import PrintRecordColumn from '~/components/pages/list/columns/PrintRecordColumn.vue'
import RecordCardAddress from '~/components/tables/columns/RecordCardAddress'
import RecordCardDistrict from '~/components/tables/columns/RecordCardDistrict'
import { date } from '~/assets/js/helpers.js'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RecordCardList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/record_cards/record_cards/pending-validation/',
    },
    title: {
      type: String,
      default: 'Tasques',
    },
    hideActions: {
      type: Boolean,
      default: true,
    },
    showUserPlate: {
      type: Boolean,
      default: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.record_card',
    },
    pageParameter: {
      type: String,
      default: 'NUMPERPAGPETIT',
      required: false,
    },
  },
  data() {
    return {
      tableReady: false,
      detailUrl: {
        name: 'backoffice-records-id',
      },
      columns: [
        'alarms',
        'urgent',
        'normalized_record_id',
        'record_type.description',
        'record_state',
        'created_at',
        'ans_limit_date',
        'element_detail.element.area.description',
        'element_detail.element.description',
        'element_detail.description',
        'address',
        'district',
        'responsible_profile.description',
        'print',
      ],
      addUrl: null,
      options: {
        skin: 'table table-striped table-sm table-fullcontent',
        perPage: 25,
        headings: {
          alarms: this.$t('record_card_list_alarms'),
          urgent: this.$t('record_card_list_urgent'),
          'record_type.description': this.$t('record_card_list_record_type'),
          'responsible_profile.description': this.$t('record_card_list_group'),
          ans_limit_date: this.$t('record_card_list_ans'),
          normalized_record_id: this.$t('record_card_list_record_id'),
          record_state: this.$t('record_card_list_state'),
          created_at: this.$t('notifications_created_at'),
          'element_detail.element.area.description': this.$t(
            'record_card_list_area'
          ),
          'element_detail.element.description': this.$t(
            'record_card_list_element'
          ),
          'element_detail.description': this.$t('record_card_list_detail'),
          address: this.$t('record_card_list_address'),
          district: this.$t('record_card_list_district'),
          print: this.$t('record_card_list_print'),
        },
        templates: {
          alarms: RecordCardAlarms,
          urgent: urgent,
          normalized_record_id: RecordId,
          record_state: RecordStateColumn,
          address: RecordCardAddress,
          district: RecordCardDistrict,
          ans_limit_date: AnsLimitDate,
          'element_detail.element.area.description': DivColumn,
          'element_detail.element.description': DivColumn,
          'element_detail.description': DivColumn,
          'record_type.description': DivColumn,
          'responsible_profile.description': DivColumn,
          print: PrintRecordColumn,
        },
        sortable: [
          'urgent',
          'normalized_record_id',
          'record_type.description',
          ['record_state', 'record_state.description'],
          'created_at',
          'ans_limit_date',
          'element_detail.element.area.description',
          'element_detail.element.description',
          'element_detail.description',
          ['address', 'ubication.street'],
          ['district', 'ubication.district_id'],
          'responsible_profile.description',
        ],
      },
      fixedColumnsWidth: [90, 45, 75],
    }
  },
  computed: {
    ...mapState({
      parameters: 'parameters',
    }),
  },
  created() {
    if (this.columns.length !== this.extendedColumns.length) {
      this.fixedColumnsWidth.unshift(30)
    }
  },
  mounted() {
    if (!this.parameters || this.parameters[this.pageParameter] == undefined) {
      this.loadParams().then(() => {
        this.setOptionsFromParams()
      })
    } else {
      this.setOptionsFromParams()
    }
  },
  methods: {
    ...mapActions({ loadParams: 'loadParams' }),
    setOptionsFromParams() {
      try {
        this.options.perPage = this.parameters[this.pageParameter].valor
      } catch (e) {
        this.options.perPage = 10
      }
      this.$nextTick(() => {
        this.tableReady = true
      })
    },
    getExtraQueryParams() {
      return {
        ...(this.$route.query.only_group
          ? { incharge_profile: this.$route.query.only_group }
          : {}),
      }
      return extra
    },
    processResults(data) {
      let result = data.map(item => {
        return {
          ...item,
          ...{
            user_displayed: this.showUserPlate ? item.user_displayed : null,
            created_at: date(item.created_at),
            updated_at: date(item.created_at),
            ans_limit_date: item.ans_limit_date,
          },
        }
      })
      return result
    },
  },
}
</script>
