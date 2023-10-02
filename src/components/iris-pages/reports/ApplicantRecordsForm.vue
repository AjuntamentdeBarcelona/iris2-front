<script>
import BaseReportFormManagement from '~/components/iris-pages/reports/BaseReportFormManagement'
import {
  applicantTypeCitizenChoice,
  applicantTypeSocialEntityChoice,
} from '~/assets/js/iris2/constants'

export default {
  name: 'ApplicantRecordsForm',
  extends: BaseReportFormManagement,
  props: {
    title: {
      type: String,
      default: 'reports_applicant_records',
    },
    url: {
      type: String,
      default: '/api/reports/applicants_records/',
    },
  },
  methods: {
    /**
     * Overriden to insert a new field
     */
    adaptSchema(schemaDef) {
      schemaDef.define('applicant', {
        model: 'applicant',
        type: 'select',
        values: [
          { id: applicantTypeCitizenChoice, name: this.$t('citizen') },
          {
            id: applicantTypeSocialEntityChoice,
            name: this.$t('social_entity'),
          },
        ],
        selectOptions: {
          noneSelectedText: '-',
        },
        label: this.$t('applicant_type'),
        styleClasses: 'col-6',
      })
      schemaDef.define('min_requests', {
        model: 'min_requests',
        type: 'input',
        inputType: 'number',
        label: this.$t('reports_min_requests'),
        placeholder: this.$t('reports_min_requests'),
        styleClasses: 'col-3',
      })

      schemaDef.layout.groups[1].fields.push('applicant', 'min_requests')
    },
  },
}
</script>
