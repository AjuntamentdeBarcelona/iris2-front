<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'
import SchemaForm from '~/components/pages/form/schemaForm'
import VuexSelect from '~/components/form-generator/masters/VuexSelect'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'

export let getBasicFiltersForm = function(vm) {
  return new FormDefinition(
    {
      normalized_record_id: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_id'),
        placeholder: vm.$t('record_card_id'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2',
      },
      user_id: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('plate'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2',
        validator: validators.string,
      },
      applicant_dni: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_nif'),
        placeholder: vm.$t('record_card_applicant_id_placeholder'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-3',
      },
      applicant_cif: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_cif'),
        placeholder: vm.$t('record_card_applicant_id_placeholder'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-3',
      },
      responsible_profile_id: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('responsible_profile'),
        placeholder: vm.$t('name'),
        url: '/api/profiles/responsible/',
        infiniteScroll: true,
        lazy: true,
        processAjaxResult: response => {
          return response.data.results.slice().sort(compareFnByDescriptionAsc)
        },
        offlineSearch: false,
        valueAttribute: 'id',
        optionLabelAttribute: 'description',
        objectValue: true,
        values: [],
        isRestful: true,
        styleClasses: 'col-6 col-lg-4',
        getInitialOption: function(model) {
          return model.responsible_profile_id
        },
      },
      created_at_ini: {
        type: 'pikaday',
        format: 'DD/MM/YYYY',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('created_at_start'),
        placeholder: vm.$t('from_date') + ' ...',
        styleClasses: 'col-6 col-lg-2',
        validator: validators.date,
      },
      created_at_end: {
        type: 'pikaday',
        format: 'DD/MM/YYYY',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('created_at_end'),
        placeholder: vm.$t('to_date') + ' ...',
        styleClasses: 'col-6 col-lg-2',
        validator: validators.date,
      },
      district: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveDistricts',
        storeAttribute: 'districts',
        optionLabelAttribute: 'name',
        objectValue: true,
        valueAttribute: 'id',
        id: 'district',
        label: vm.$t('district'),
        required: false,
        styleClasses: 'col-6 col-lg-3',
      },
      alarms: {
        type: 'autocomplete-multiple',
        label: vm.$t('traceability_alarms'),
        placeholder: vm.$t('record_card_select_alarm'),
        styleClasses: 'col-12 col-lg-3',
        optionLabelAttribute: 'description',
        valueAttribute: 'id',
        objectValue: true,
        getInitialOption: function(model) {
          return model.alarms
        },
        excludeSelectedValuesByField: 'id',
        options: [
          {
            description: vm.$t('alarm_urgent'),
            id: 'urgent',
          },
          {
            description: vm.$t('alarm_mayorship'),
            id: 'mayorship',
          },
          {
            description: vm.$t('alarm_pend_citizen_response'),
            id: 'pend_citizen_response',
          },
          {
            description: vm.$t('alarm_response_time_expired'),
            id: 'response_time_expired',
          },
          {
            description: vm.$t('alarm_citizen_response'),
            id: 'citizen_response',
          },
          {
            description: vm.$t('alarm_related_records'),
            id: 'related_records',
          },
          {
            description: vm.$t('alarm_reasigned_task'),
            id: 'reasigned_task',
          },
          {
            description: vm.$t('alarm_cancel_request'),
            id: 'cancel_request',
          },
          {
            description: vm.$t('alarm_possible_similar_records'),
            id: 'possible_similar_records',
          },
          {
            description: vm.$t('alarm_citizen_claim'),
            id: 'citizen_claim',
          },
          {
            description: vm.$t('alarm_citizen_web_claim'),
            id: 'citizen_web_claim',
          },
          {
            description: vm.$t('alarm_response_to_responsible'),
            id: 'response_to_responsible',
          },
          {
            description: vm.$t('alarm_pend_response_responsible'),
            id: 'pend_response_responsible',
          },
        ].sort(compareFnByDescriptionAsc),
      },
      state: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveRecordStates',
        storeAttribute: 'recordStates',
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        label: vm.$t('record_card_state'),
        required: false,
        styleClasses: 'col-6 col-lg-2 field-select',
      },
      ans_limit_date_ini: {
        type: 'input',
        inputType: 'number',
        min: 0,
        label: vm.$t('record_cards_basic_filters_ans_limit_date_ini'),
        placeholder: vm.$t('from_date'),
        styleClasses: 'col-6 col-lg-2',
      },
      ans_limit_date_end: {
        type: 'input',
        inputType: 'number',
        min: 0,
        label: vm.$t('record_cards_basic_filters_ans_limit_date_end'),
        placeholder: vm.$t('to_date'),
        styleClasses: 'col-6 col-lg-2',
      },
      area: {
        type: 'autocomplete-multiple',
        inputType: 'number',
        placeholder: vm.$t('record_card_select_area'),
        label: vm.$t('record_card_area'),
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        url: '/api/theme/areas/autocomplete/',
        isRestful: true,
        styleClasses: 'col-md-6 col-lg-4',
        lazy: true,
        getInitialOption: function(model) {
          return model.area
        },
        processAjaxResult: response => {
          return response.data.results.slice().sort(compareFnByDescriptionAsc)
        },
      },
      element: {
        type: 'autocomplete-multiple',
        inputType: 'number',
        label: vm.$t('record_card_element'),
        placeholder: vm.$t('record_card_select_element'),
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        url: '/api/theme/elements/autocomplete/',
        forwardFields: ['area'],
        forwardFlatValues: true,
        isRestful: true,
        styleClasses: 'col-md-6 col-lg-4',
        lazy: true,
        getInitialOption: function(model) {
          return model.element
        },
        processAjaxResult: response => {
          return response.data.results.slice().sort(compareFnByDescriptionAsc)
        },
      },
      elementdetail: {
        type: 'autocomplete-multiple',
        inputType: 'number',
        label: vm.$t('record_card_detail'),
        placeholder: vm.$t('record_card_select_detail'),
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        url: '/api/theme/details/autocomplete/',
        forwardFields: ['element'],
        forwardFlatValues: true,
        isRestful: true,
        styleClasses: 'col-md-6 col-lg-4',
        lazy: true,
        getInitialOption: function(model) {
          return model.elementdetail
        },
        processAjaxResult: response => {
          return response.data.results.slice().sort(compareFnByDescriptionAsc)
        },
      },
    },
    {
      groups: [
        {
          fields: ['normalized_record_id', 'applicant_dni', 'applicant_cif'],
        },
        {
          fields: [
            'district',
            'created_at_ini',
            'created_at_end',
            'ans_limit_date_ini',
            'ans_limit_date_end',
          ],
        },
        {
          fields: ['alarms', 'state', 'responsible_profile_id', 'user_id'],
        },
        {
          fields: ['area', 'element', 'elementdetail'],
        },
      ],
    }
  )
}

export default {
  name: 'FilterFormBasicFilters',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/record_cards/record_cards/',
    },
    method: {
      type: String,
      default: 'get',
    },
    definition: {
      type: Function,
      default: getBasicFiltersForm,
    },
    submitOnEnter: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    adaptSchema(def) {
      // If filtering by responsible profile, disable
      def.fields.responsible_profile_id.readonly =
        this.$route.query.only_group != null
    },
    getSaveData(model) {
      return {
        normalized_record_id_lookup: 'startswith',
        applicant_dni_lookup: 'contains',
        applicant_cif_lookup: 'contains',
        ans_limit_date_ini: Number.isNaN(model.ans_limit_date_ini)
          ? null
          : model.ans_limit_date_ini,
        ans_limit_date_end: Number.isNaN(model.ans_limit_date_end)
          ? null
          : model.ans_limit_date_end,
      }
    },
    getDefaultButtons() {
      return []
    },
    showSuccessMessage() {},
  },
}
</script>

<style lang="scss" scoped>
/deep/ .form-group {
  padding-bottom: 0;
}
</style>
