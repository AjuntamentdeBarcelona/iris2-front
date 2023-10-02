<script>
import BaseReportForm from '~/components/iris-pages/reports/BaseReportForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'
import VuexSelect from '~/components/form-generator/masters/VuexSelect'
import FieldBcnNeighbourhood from '~/components/form-generator/FieldBcnNeighbourhood'
import { validDateRange, timeSpanDays } from '~/assets/js/utils'

const formDefinition = vm =>
  new FormDefinition(
    {
      create_date_gte: {
        type: 'pikaday',
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('reports_created_at_start'),
        placeholder: vm.$t('reports_from'),
        styleClasses: 'col-lg-3 col-6',
        required: true,
        validator: validators.date,
      },
      create_date_lte: {
        type: 'pikaday',
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('reports_created_at_end'),
        placeholder: vm.$t('reports_to'),
        styleClasses: 'col-lg-3 col-6',
        required: true,
        validator: validators.date,
      },
      close_date_gte: {
        type: 'pikaday',
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('reports_closed_at_start'),
        placeholder: vm.$t('reports_from'),
        styleClasses: 'col-lg-3 col-6',
        required: false,
        validator: validators.date,
      },
      close_date_lte: {
        type: 'pikaday',
        format: 'YYYY-MM-DD',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('reports_closed_at_end'),
        placeholder: vm.$t('reports_to'),
        styleClasses: 'col-lg-3 col-6',
        required: false,
        validator: validators.date,
      },
      area_id: {
        type: 'autocomplete',
        inputType: 'number',
        url: '/api/theme/areas/',
        optionLabelAttribute: 'description',
        label: vm.$t('record_card_area'),
        placeholder: vm.$t('record_card_select_area'),
        styleClasses: 'col-lg-7 col-12',
      },
      record_type_id: {
        type: 'select-record-type',
        label: vm.$t('record_type_title'),
        styleClasses: 'col-xl-4 col-6 mb-0',
      },
      input_channel_id: {
        type: 'autocomplete',
        inputType: 'number',
        url: '/api/masters/input_channels/',
        optionLabelAttribute: 'description',
        label: vm.$t('input_channel'),
        placeholder: vm.$t('reports_select_input_channel'),
        styleClasses: 'col-6',
      },
      applicant_type_id: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveApplicantTypes',
        storeAttribute: 'applicantTypes',
        label: vm.$t('applicant_type'),
        styleClasses: 'col-lg-5 col-6',
      },
      support_id: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveSupports',
        storeAttribute: 'supports',
        label: vm.$t('navigation_support'),
        styleClasses: 'col-6',
      },
      district_id: {
        type: 'autocomplete',
        inputType: 'number',
        url: '/api/masters/districts/',
        optionLabelAttribute: 'name',
        label: vm.$t('district'),
        placeholder: vm.$t('reports_select_district'),
        styleClasses: 'col-xl-4 col-6 mb-0',
      },
      /*neighborhood: {
        component: FieldBcnNeighbourhood,
        label: vm.$t('record_card_neighborhood'),
        styleClasses: 'col-xl-4 col-6 mb-0',
        getSaveValue(model) {
          return model && model.length ? model[0].description : null
        },
      },*/
    },
    {
      groups: [
        {
          legend: vm.$t('reports_select_date'),
          fields: [
            'create_date_gte',
            'create_date_lte',
            'close_date_gte',
            'close_date_lte',
          ],
        },
        {
          fields: [
            'area_id',
            'applicant_type_id',
            'input_channel_id',
            'support_id',
            'district_id',
            // 'neighborhood',
            'record_type_id',
          ],
        },
      ],
    }
  )

export default {
  name: 'BaseReportFormManagement',
  extends: BaseReportForm,
  props: {
    url: {
      type: String,
      required: true,
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
  },
  created() {
    this.startDynamicRequirements()
  },
  methods: {
    startDynamicRequirements() {
      this.alternateRequirementsIntervalId = setInterval(() => {
        this.alternateRequirements()
      }, 1500)
    },
    stopDynamicRequirements() {
      clearInterval(this.alternateRequirementsIntervalId)
      this.alternateRequirementsIntervalId = null
    },
    resetDynamicRequirements() {
      this.schemaDef.fields.create_date_gte.required = this.definition(
        this
      ).fields.create_date_gte.required
      this.schemaDef.fields.create_date_lte.required = this.definition(
        this
      ).fields.create_date_lte.required
      this.schemaDef.fields.close_date_gte.required = this.definition(
        this
      ).fields.close_date_gte.required
      this.schemaDef.fields.close_date_lte.required = this.definition(
        this
      ).fields.close_date_lte.required
    },
    clearRequirements() {
      this.removeCreateRequirements()
      this.removeCloseRequirements()
    },
    setCreateRequirements() {
      this.schemaDef.fields.create_date_gte.required = true
      this.schemaDef.fields.create_date_lte.required = true
    },
    removeCreateRequirements() {
      this.schemaDef.fields.create_date_gte.required = false
      this.schemaDef.fields.create_date_lte.required = false
    },
    setCloseRequirements() {
      this.schemaDef.fields.close_date_gte.required = true
      this.schemaDef.fields.close_date_lte.required = true
    },
    removeCloseRequirements() {
      this.schemaDef.fields.close_date_gte.required = false
      this.schemaDef.fields.close_date_lte.required = false
    },
    alternateRequirements() {
      this.schemaDef.fields.create_date_gte.required = !this.schemaDef.fields
        .create_date_gte.required
      this.schemaDef.fields.create_date_lte.required = !this.schemaDef.fields
        .create_date_lte.required
      this.schemaDef.fields.close_date_gte.required = !this.schemaDef.fields
        .close_date_gte.required
      this.schemaDef.fields.close_date_lte.required = !this.schemaDef.fields
        .close_date_lte.required
    },
    checkDynamicRequirements() {
      if (
        this.model.create_date_gte ||
        this.model.create_date_lte ||
        this.model.close_date_gte ||
        this.model.close_date_lte
      ) {
        this.stopDynamicRequirements()
        this.clearRequirements()
      }

      if (this.model.create_date_gte || this.model.create_date_lte) {
        this.setCreateRequirements()
      } else if (!this.alternateRequirementsIntervalId) {
        this.removeCreateRequirements()
      }

      if (this.model.close_date_gte || this.model.close_date_lte) {
        this.setCloseRequirements()
      } else if (!this.alternateRequirementsIntervalId) {
        this.removeCloseRequirements()
      }

      if (
        !this.model.create_date_gte &&
        !this.model.create_date_lte &&
        !this.model.close_date_gte &&
        !this.model.close_date_lte &&
        !this.alternateRequirementsIntervalId
      ) {
        this.resetDynamicRequirements()
        this.startDynamicRequirements()
      }
    },
    /**
     * Overwritten to perform validation
     */
    afterUpdate() {
      this.checkDates()
      this.checkDynamicRequirements()
    },
    checkDates() {
      this.clearOwnValidationErrors()

      this.checkDatePair('create_date_gte', 'create_date_lte')
      this.checkDatePair('close_date_gte', 'close_date_lte')
      this.checkDatesCombined()
    },
    checkDatePair(dateStart, dateEnd) {
      this.checkValidRange(
        dateStart,
        dateEnd,
        'reports_range_not_possible_start',
        'reports_range_not_possible_end'
      )

      this.checkValidDays(
        dateStart,
        dateEnd,
        'reports_range_year',
        'reports_range_year'
      )
    },
    checkDatesCombined() {
      this.checkValidRange(
        'create_date_gte',
        'close_date_gte',
        'reports_range_not_possible_created_start',
        'reports_range_not_possible_closed_start'
      )

      this.checkValidRange(
        'create_date_lte',
        'close_date_lte',
        'reports_range_not_possible_created_end',
        'reports_range_not_possible_closed_end'
      )

      this.checkValidDays(
        'create_date_gte',
        'close_date_lte',
        'reports_range_year_created_closed',
        'reports_range_year_created_closed'
      )
    },
    checkValidRange(dateStart, dateEnd, msgKeyStart, msgKeyEnd) {
      if (
        this.model[dateStart] &&
        this.model[dateEnd] &&
        !validDateRange(this.model[dateStart], this.model[dateEnd])
      ) {
        this.errors.push(
          {
            error: this.$t(msgKeyStart),
            field: this.schemaDef.fields[dateStart],
          },
          {
            error: this.$t(msgKeyEnd),
            field: this.schemaDef.fields[dateEnd],
          }
        )
      }
    },
    checkValidDays(dateStart, dateEnd, msgKeyStart, msgKeyEnd) {
      if (
        this.model[dateStart] &&
        this.model[dateEnd] &&
        timeSpanDays(this.model[dateStart], this.model[dateEnd]) > 366
      ) {
        this.errors.push(
          {
            error: this.$t(msgKeyStart),
            field: this.schemaDef.fields[dateStart],
          },
          {
            error: this.$t(msgKeyEnd),
            field: this.schemaDef.fields[dateEnd],
          }
        )
      }
    },
    clearOwnValidationErrors() {
      this.errors = this.errors.filter(
        error =>
          ![
            this.$t('reports_range_not_possible_start'),
            this.$t('reports_range_not_possible_end'),
            this.$t('reports_range_not_possible_created_start'),
            this.$t('reports_range_not_possible_closed_start'),
            this.$t('reports_range_not_possible_created_end'),
            this.$t('reports_range_not_possible_closed_end'),

            this.$t('reports_range_year'),
            this.$t('reports_range_year_created_closed'),
          ].includes(error.error)
      )
    },
    getExtraNonNullableFields(fields = []) {
      return fields
    },
    /**
     * Overriden to delete null values
     */
    getSaveData(model) {
      const nonNullableFields = [
        'create_date_gte',
        'create_date_lte',
        'close_date_gte',
        'close_date_lte',
        'neighborhood',
        'record_type_id',
        'area_id',
        'input_channel_id',
        'applicant_type_id',
        'support_id',
        'district_id',
        ...this.getExtraNonNullableFields(),
      ]

      const newModel = {}

      Object.entries(model).forEach(entry => {
        const [key, value] = entry

        if (
          nonNullableFields.includes(key) &&
          (value === null || (Array.isArray(value) && !value.length))
        ) {
          newModel[key] = undefined
        }
      })

      return newModel
    },
  },
}
</script>
