<script>
import Table from '~/components/pages/list/table.vue'
import { omit } from 'lodash'

const COLUMNS = {
  0: [
    'citizen.dni',
    'citizen.name',
    'citizen.first_surname',
    'citizen.second_surname',
    'actions',
  ],
  1: ['social_entity.cif', 'social_entity.social_reason', 'actions'],
}

const HEADINGS = {
  0: {
    'citizen.dni': 'id_card',
    'citizen.name': 'name',
    'citizen.first_surname': 'first_surname',
    'citizen.second_surname': 'second_surname',
    actions: 'actions',
  },
  1: {
    'social_entity.cif': 'cif',
    'social_entity.social_reason': 'social_reason',
    actions: 'actions',
  },
}

export default {
  name: 'ApplicantTable',
  extends: Table,
  props: {
    url: {
      type: String,
      default: '/api/record_cards/applicants',
    },
    title: {
      type: String,
      default: '',
    },
    queryParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
    defaultOrderBy: {
      type: Object,
      default: () => null,
    },
    applicantType: {
      type: Number,
      required: true,
    },
    disableAdd: {
      type: Boolean,
      default: true,
    },
    inheritedDetailUrl: {
      type: Object,
      default: () => null,
    },
    isPageComponent: {
      type: Boolean,
      default: false,
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
    refreshOnApplicantChange: {
      type: Boolean,
      default: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.applicant',
    },
  },
  data() {
    return {
      detailUrl: this.inheritedDetailUrl,
      options: {
        sortable: this.isPageComponent
          ? [
              'citizen.dni',
              'citizen.name',
              'citizen.first_surname',
              'citizen.second_surname',
              'social_entity.cif',
              'social_entity.social_reason',
            ]
          : [],
        orderBy: this.defaultOrderBy,
      },
      disabledDeleteMessage: this.$t('unauthorized_actions'),
    }
  },
  watch: {
    applicantType() {
      if (this.refreshOnApplicantChange) {
        this.refresh()
        this.setColumns()
      }
    },
    queryParams() {
      this.refresh()
    },
    defaultOrderBy(val) {
      this.options.orderBy = val
    },
  },
  mounted() {
    this.setColumns()
  },
  methods: {
    setColumns() {
      const columns = COLUMNS[this.applicantType]
      let headings = HEADINGS[this.applicantType]
      for (const h in headings) {
        headings[h] = this.$t(headings[h])
      }

      if (this.inheritedDetailUrl) {
        this.columns = columns.filter(col => col !== 'actions')
        this.options.headings = omit(headings, ['actions'])
      } else {
        this.columns = columns
        this.options.headings = headings
      }
    },
    refresh() {
      this.setColumns()
      this.$refs.table.refresh()
    },
    goToDetail(obj) {
      this.$router.push(this.localePath(this.getDetailUrl(obj)))
    },
  },
}
</script>
