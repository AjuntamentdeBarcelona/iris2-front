<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import VuexSelect from '~/components/form-generator/masters/VuexSelect'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset'
import AttributeFilterField from '~/components/iris-pages/records/filter/AttributeFilterField.vue'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'
import OpenStreetMapAddressField from '~/components/iris-pages/records/maps/OpenStreeMapAddressField.vue'

export let getAdvancedFiltersFormDefinition = vm =>
  new FormDefinition(
    {
      // RecordCard
      area: {
        type: 'autocomplete-multiple',
        inputType: 'number',
        lazy: true,
        optionLabelAttribute: 'description',
        placeholder: vm.$t('record_card_select_area'),
        label: vm.$t('record_card_area'),
        objectValue: true,
        valueAttribute: 'id',
        url: '/api/theme/areas/autocomplete/',
        isRestful: true,
        styleClasses: 'col-lg-4',
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
        lazy: true,
        valueAttribute: 'id',
        url: '/api/theme/elements/autocomplete/',
        forwardFields: ['area'],
        forwardFlatValues: true,
        isRestful: true,
        styleClasses: 'col-lg-4',
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
        lazy: true,
        forwardFields: ['element'],
        forwardFlatValues: true,
        isRestful: true,
        styleClasses: 'col-lg-4',
        getInitialOption: function(model) {
          return model.elementdetail
        },
        processAjaxResult: response => {
          return response.data.results.slice().sort(compareFnByDescriptionAsc)
        },
      },
      record_type: {
        type: 'select-record-type',
        label: vm.$t('record_card_list_record_type'),
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        styleClasses: 'col-lg-4',
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
      },
      closing_date_ini: {
        type: 'pikaday',
        format: 'DD/MM/YYYY',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('closed_at_start'),
        placeholder: vm.$t('from_date') + ' ...',
        styleClasses: 'col-6 col-lg-2',
      },
      closing_date_end: {
        type: 'pikaday',
        format: 'DD/MM/YYYY',
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('closed_at_end'),
        placeholder: vm.$t('to_date') + ' ...',
        styleClasses: 'col-6 col-lg-2',
      },
      open_records: {
        type: 'select',
        values: [
          { id: true, name: vm.$t('record_card_open_rcs ') },
          { id: false, name: vm.$t('record_card_closed_rcs') },
        ],
        selectOptions: {
          noneSelectedText: '-',
        },
        label: vm.$t('record_card_open_record_cards'),
        styleClasses: 'col-2 col-lg-2',
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
        styleClasses: 'col-3 col-lg-3',
      },
      support: {
        component: VuexSelect,
        lazy: true,
        storeModule: 'masters',
        storeAction: 'retrieveSupports',
        storeAttribute: 'supports',
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        label: vm.$t('navigation_support'),
        required: false,
        styleClasses: 'col-3 col-lg-3',
      },
      alarms: {
        type: 'autocomplete-multiple',
        label: vm.$t('traceability_alarms'),
        placeholder: vm.$t('record_card_select_alarm'),
        styleClasses: 'col-12 col-lg-6',
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
      ariadna_record: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('register_code'),
        placeholder: vm.$t('record_card_code_placeholder'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2',
      },
      mayorship: {
        type: 'toggle',
        default: false,
        label: vm.$t('record_card_mayorship'),
        styleClasses: 'col',
      },
      normalized_record_id_lookup: {
        type: 'select',
        values: [
          { id: 'exact', name: vm.$t('iexact') },
          { id: 'contains', name: vm.$t('ilike_contains') },
          { id: 'startswith', name: vm.$t('istartswith') },
        ],
        default: 'ilike_contains',
        selectOptions: {
          hideNoneSelectedText: true,
        },
        label: vm.$t('lookup'),
        styleClasses: 'col-6 col-lg-2 pr-lg-0 no-round--right',
      },
      normalized_record_id: {
        type: 'input',
        inputType: 'text',
        requiredFields: ['normalized_record_id_lookup'],
        resetIfNotAllRequired: true,
        label: vm.$t('record_card_id'),
        placeholder: vm.$t('record_card_id'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2 pl-lg-0 no-round--left',
      },
      theme_group: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveThemeGroups',
        storeAttribute: 'themeGroups',
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        label: vm.$t('record_card_theme_groups'),
        required: false,
        lazy: true,
        styleClasses: 'col-4 col-lg-4',
      },
      has_communication_media: {
        type: 'toggle',
        default: false,
        label: vm.$t('communication_media_has'),
        styleClasses: 'col',
      },
      communication_media_id: {
        lazy: true,
        type: 'autocomplete-vuex-select',
        label: vm.$t('communication_media'),
        storeModule: 'masters',
        storeAction: 'retrieveCommunicationMedias',
        storeAttribute: 'communicationMedias',
        placeholder: vm.$t('communication_media_select'),
        optionLabelAttribute: 'description',
        options: [],
        styleClasses: 'col-6 col-3',
        objectValue: true,
        valueAttribute: 'id',
      },
      // Operator
      create_operator: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_creation_user_code'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-lg',
      },
      validate_operator: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_validation_user_code'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-lg',
      },
      plan_operator: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_planification_user_code'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-lg',
      },
      resolute_operator: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_resolution_user_code'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-lg',
      },
      close_operator: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_closing_user_code'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-lg',
      },
      reasigned_records: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_reassign_user_code'),
        placeholder: vm.$t('users_username'),
        maxLength: 20,
        styleClasses: 'col-lg',
      },
      // Operator (profiles)
      creation_profile: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('record_card_creation_profile'),
        placeholder: vm.$t('name'),
        url: '/api/profiles/groups/',
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
          return model.creation_profile
        },
      },
      advanced_profile: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('record_card_advanced_profile'),
        placeholder: vm.$t('name'),
        url: '/api/profiles/groups/',
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
        infiniteScroll: true,
        styleClasses: 'col-6 col-lg-4',
        getInitialOption: function(model) {
          return model.advanced_profile
        },
      },
      incharge_profile: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('record_card_incharge_profile'),
        placeholder: vm.$t('name'),
        url: '/api/profiles/groups/',
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
          return model.incharge_profile
        },
      },
      // Applicant
      applicant_type: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveApplicantTypes',
        storeAttribute: 'applicantTypes',
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        label: vm.$t('applicant_type'),
        required: false,
        styleClasses: 'col-6 col-lg-4',
        lazy: true,
      },
      applicant_name_lookup: {
        type: 'select',
        values: [
          { id: 'iexact', name: vm.$t('iexact') },
          { id: 'ilike_contains', name: vm.$t('ilike_contains') },
          { id: 'istartswith', name: vm.$t('istartswith') },
        ],
        default: 'ilike_contains',
        selectOptions: {
          hideNoneSelectedText: true,
        },
        label: vm.$t('lookup'),
        styleClasses: 'col-6 col-lg-2 pr-lg-0 no-round--right',
      },
      applicant_name: {
        type: 'input',
        inputType: 'text',
        requiredFields: ['applicant_name_lookup'],
        resetIfNotAllRequired: true,
        maxlength: 60,
        min: 3,
        label: vm.$t('name'),
        placeholder: vm.$t('name'),
        styleClasses: 'col-6 col-lg-2 pl-lg-0 no-round--left',
      },
      applicant_surname_lookup: {
        type: 'select',
        values: [
          { id: 'iexact', name: vm.$t('iexact') },
          { id: 'ilike_contains', name: vm.$t('ilike_contains') },
          { id: 'istartswith', name: vm.$t('istartswith') },
        ],
        default: 'ilike_contains',
        selectOptions: {
          hideNoneSelectedText: true,
        },
        label: vm.$t('lookup'),
        styleClasses: 'col-6 col-lg-2 pr-0 no-round--right',
      },
      applicant_surname: {
        type: 'input',
        inputType: 'text',
        requiredFields: ['applicant_surname_lookup'],
        resetIfNotAllRequired: true,
        maxlength: 60,
        min: 3,
        label: vm.$t('first_surname'),
        placeholder: vm.$t('first_surname'),
        styleClasses: 'col-6 col-lg-2 pl-lg-0 no-round--left',
      },
      applicant_second_surname_lookup: {
        type: 'select',
        values: [
          { id: 'iexact', name: vm.$t('iexact') },
          { id: 'ilike_contains', name: vm.$t('ilike_contains') },
          { id: 'istartswith', name: vm.$t('istartswith') },
        ],
        default: 'ilike_contains',
        selectOptions: {
          hideNoneSelectedText: true,
        },
        label: vm.$t('lookup'),
        styleClasses: 'col-6 col-lg-2 pr-0 no-round--right',
      },
      applicant_second_surname: {
        type: 'input',
        inputType: 'text',
        requiredFields: ['applicant_second_surname_lookup'],
        resetIfNotAllRequired: true,
        maxlength: 60,
        min: 3,
        label: vm.$t('second_surname'),
        placeholder: vm.$t('second_surname'),
        styleClasses: 'col-6 col-lg-2 pl-lg-0 no-round--left',
      },
      applicant_social_reason_lookup: {
        type: 'select',
        values: [
          { id: 'iexact', name: vm.$t('iexact') },
          { id: 'ilike_contains', name: vm.$t('ilike_contains') },
          { id: 'istartswith', name: vm.$t('istartswith') },
        ],
        default: 'ilike_contains',
        selectOptions: {
          hideNoneSelectedText: true,
        },
        label: vm.$t('lookup'),
        styleClasses: 'col-6 col-lg-2 pr-0  no-round--right',
      },
      applicant_social_reason: {
        type: 'input',
        inputType: 'text',
        requiredFields: ['applicant_social_reason_lookup'],
        resetIfNotAllRequired: true,
        maxlength: 60,
        min: 3,
        label: vm.$t('social_reason'),
        placeholder: vm.$t('social_reason'),
        styleClasses: 'col-6 col-lg-2 pl-lg-0 no-round--left',
      },
      applicant_dni: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_nif'),
        placeholder: vm.$t('record_card_applicant_id_placeholder'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2',
      },
      applicant_cif: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_cif'),
        placeholder: vm.$t('record_card_applicant_id_placeholder'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2',
      },
      applicant_address_response: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_response_address'),
        placeholder: vm.$t('record_card_address'),
        maxLength: 20,
        styleClasses: 'col-lg-4',
      },
      applicant_phone_response: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_response_phone'),
        placeholder: vm.$t('telephone'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-2',
      },
      applicant_email_response: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('record_card_response_email'),
        placeholder: vm.$t('users_email'),
        maxLength: 20,
        styleClasses: 'col-6 col-lg-4',
      },
      response_channel: {
        label: vm.$t('response_channel'),
        placeholder: vm.$t('record_card_response_channel'),
        styleClasses: 'col-12 col-lg-2',
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveResponseChannels',
        storeAttribute: 'responseChannels',
        objectValue: true,
        optionLabelAttribute: 'name',
        valueAttribute: 'id',
      },
      // Features
      attributes: {
        component: AttributeFilterField,
        placeholder: vm.$t('please_select'),
        uniqueField: 'id',
        inlineIdName: 'feature',
        labelField: 'description',
        selectLabel: vm.$t('navigation_attributes'),
        tableLabel: vm.$t('filter_values'),
        url: '/api/features/features/',
        styleClasses: 'col-12',
      },
      // Ubication
      district: {
        type: 'autocomplete-multiple',
        inputType: 'number',
        url: '/api/masters/districts/',
        objectValue: true,
        excludeSelectedValuesByField: 'id',
        optionLabelAttribute: 'name',
        valueAttribute: 'id',
        getInitialOption: function(model) {
          return model.district
        },
        label: vm.$t('record_card_district'),
        placeholder: vm.$t('reports_select_district'),
        styleClasses: 'col',
      },
      street_address: {
        component: OpenStreetMapAddressField,
        optionLabelAttribute: 'description',
        valueAttribute: 'id',
        multiple: true,
        label: vm.$t('record_card_street_address'),
        styleClasses: 'col',
      },
    },
    {
      groups: [
        {
          groups: [
            {
              class: 'col-12 p-0',
              component: TabbedFieldset,
              groups: [
                {
                  class: 'col-12',
                  title: vm.$t('record_cards_advanced_filters_record_card'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: ['area', 'element', 'elementdetail'],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'record_type',
                        'created_at_ini',
                        'created_at_end',
                        'closing_date_ini',
                        'closing_date_end',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'open_records',
                        'state',
                        'support',
                        'theme_group',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'normalized_record_id_lookup',
                        'normalized_record_id',
                        'alarms',
                        'ariadna_record',
                        'communication_media_id',
                        'has_communication_media',
                        'mayorship',
                      ],
                    },
                  ],
                },
                {
                  class: 'col-12',
                  title: vm.$t(
                    'record_cards_advanced_filters_operator_profile'
                  ),
                  groups: [
                    {
                      class: 'col-12',
                      fields: [
                        'create_operator',
                        'validate_operator',
                        'reasigned_records',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'plan_operator',
                        'resolute_operator',
                        'close_operator',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'creation_profile',
                        'advanced_profile',
                        'incharge_profile',
                      ],
                    },
                  ],
                },
                {
                  class: 'col-12',
                  title: vm.$t('record_cards_advanced_filters_applicant'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: [
                        'applicant_type',
                        'applicant_dni',
                        'applicant_cif',
                        'applicant_social_reason_lookup',
                        'applicant_social_reason',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'applicant_name_lookup',
                        'applicant_name',
                        'applicant_surname_lookup',
                        'applicant_surname',
                        'applicant_second_surname_lookup',
                        'applicant_second_surname',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'response_channel',
                        'applicant_address_response',
                        'applicant_phone_response',
                        'applicant_email_response',
                      ],
                    },
                  ],
                },
                {
                  title: vm.$t('navigation_attributes'),
                  groups: [
                    {
                      fields: ['attributes'],
                      class: 'col-10 attributes-filter',
                    },
                  ],
                },
                {
                  class: 'col-12',
                  title: vm.$t('record_cards_advanced_filters_location'),
                  groups: [
                    {
                      class: 'col-6',
                      fields: ['district'],
                    },
                    {
                      class: 'col-12',
                      fields: ['street_address'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  )

export default {
  name: 'FilterFormAdvancedFilters',
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
      default: getAdvancedFiltersFormDefinition,
    },
    submitOnEnter: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    if (this.isNewModel && !Object.keys(this.model).length) {
      this.defaultModel()
    } else {
      this.modelDefaultSet = true
    }
  },
  methods: {
    adaptSchema(def) {
      // If filtering by responsible profile, disable
      def.fields.incharge_profile.readonly =
        this.$route.query.only_group != null
    },
    adaptations(model) {
      return {
        applicant_dni_lookup: 'contains',
        applicant_cif_lookup: 'contains',
      }
    },
    // Overrides
    getSaveData(model) {
      return this.adaptations(model)
    },
    adaptModelUpdated(model) {
      return this.adaptations(model)
    },
    getDefaultButtons() {
      return []
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .no-round--right select {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
/deep/ .no-round--left input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
/deep/ .form-group {
  padding-bottom: 0;
}
/deep/ .attributes-filter {
  table {
    tr {
      td:first {
        width: 200px;
      }
    }
  }
}
</style>
