<script>
import TableList from '~/components/pages/list/table.vue'
import DateColumn from '~/components/pages/list/columns/DateColumn.vue'
import BooleanColumn from '~/components/pages/list/columns/BooleanColumn.vue'
import TypeColumn from './TypeColumn.vue'

export default {
  name: 'RegisterList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/ariadna/',
    },
    title: {
      type: String,
      default: '',
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
    hideActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      columns: [
        'code',
        'applicant_doc',
        'applicant_type',
        'name',
        'surnames',
        'presentation_date',
        'used',
        'select',
      ],
      options: {
        perPage: 30,
        templates: {
          presentation_date: DateColumn,
          used: BooleanColumn,
          applicant_type: TypeColumn,
        },
        headings: {
          code: 'Codi registre',
          applicant_doc: 'Document',
          name: 'Nom/Raó social',
          surnames: 'Llinatges',
          applicant_type: 'Tipus',
          presentation_date: 'Data presentació',
          used: 'Assign.',
          select: '',
        },
      },
    }
  },
  methods: {
    processResults(data) {
      return data.map(r => {
        return {
          ...r,
          applicant_doc: r.applicant_doc || '', // Ensure applican doc is a string
          name: r.social_reason ? r.social_reason : r.applicant_name,
          surnames: r.applicant_surnames
            ? r.applicant_surnames.split('*').join(' ')
            : '',
        }
      })
    },
  },
}
</script>
