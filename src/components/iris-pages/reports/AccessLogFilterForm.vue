<script>
import BaseReportForm from '~/components/iris-pages/reports/BaseReportForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'
import VuexSelect from '~/components/form-generator/masters/VuexSelect'
import FieldNeighbourhood from '~/components/form-generator/FieldBcnNeighbourhood'
import { validDateRange, timeSpanDays } from '~/assets/js/utils'

const formDefinition = vm =>
  new FormDefinition(
    {
      from_date: {
        type: 'pikaday',
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('reports_created_at_start'),
        placeholder: vm.$t('reports_from'),
        styleClasses: 'col-xl-3 col-lg-3 col-6',
        required: true,
        validator: validators.date,
      },
      to_date: {
        type: 'pikaday',
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('reports_created_at_end'),
        placeholder: vm.$t('reports_to'),
        styleClasses: 'col-xl-3 col-lg-3 col-6',
        required: true,
        validator: validators.date,
      },
    },
    {
      groups: [
        {
          legend: vm.$t('reports_select_date'),
          fields: ['from_date', 'to_date'],
        },
      ],
    }
  )

export default {
  name: 'AccessLogFilterForm',
  extends: BaseReportForm,
  props: {
    title: {
      type: String,
      default: 'reports_access_log_report',
    },
    url: {
      type: String,
      default: '/api/reports/access-log/',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
  },
  methods: {
    /**
     * Overwritten to perform validation
     */
    afterUpdate() {
      this.checkValidRange('from_date', 'to_date')
    },
    checkValidRange(dateStart, dateEnd) {
      if (
        this.model[dateStart] &&
        this.model[dateEnd] &&
        !validDateRange(this.model[dateStart], this.model[dateEnd])
      ) {
        this.errors.push(
          {
            error: this.$t('reports_range_not_possible_first'),
            field: this.schemaDef.fields[dateStart],
          },
          {
            error: this.$t('reports_range_not_possible_last'),
            field: this.schemaDef.fields[dateEnd],
          }
        )
      }
    },
  },
}
</script>
