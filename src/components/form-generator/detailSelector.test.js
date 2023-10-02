import nuxtShallowMount from '~/assets/js/nuxt/testUtils'
import DetailSelector from './detailSelector'

describe('detailSelector', () => {
  function factory(initialValue, extraProps, extraMocks) {
    return nuxtShallowMount(
      DetailSelector,
      {
        schema: {
          model: 'test_model',
          objectValue: true,
        },
        model: {
          test_model: initialValue,
        },
        ...extraProps,
      },
      {
        ...extraMocks,
      }
    )
  }

  const initialValue = null

  const newValue = {
    id: 3723,
    short_description: "1A TINÈNCIA D'ALCALDIA",
    description: "1a tinència d'alcaldia",
    pda_description: ' ',
    app_description: '',
    validation_place_days: null,
    detail_code: '330300',
    rat_code: 'IRAI',
    similarity_hours: 24,
    similarity_meters: 50,
    show_pda_resolution_time: false,
    app_resolution_radius_meters: null,
    sla_hours: null,
    allow_multiderivation_on_reassignment: false,
    order: 1,
    element: {
      id: 920,
      description: '[920]Tinències i regidories',
      area: {
        id: 32,
        description: 'Participació',
        favourite: false,
        description_es: 'Participación',
        description_ca: 'Participació',
        description_en: 'Participation',
      },
      favourite: false,
      description_es: 'Tinencias y regidurias',
      description_ca: '[920]Tinències i regidories',
      description_en: 'Vance and stage',
    },
    process: '500',
    external_protocol_id: ' ',
    allow_external: false,
    custom_answer: false,
    requires_ubication: false,
    requires_ubication_full_address: false,
    requires_ubication_district: false,
    requires_citizen: false,
    aggrupation_first: false,
    immediate_response: false,
    first_instance_response: false,
    requires_appointment: false,
    allow_resolution_change: false,
    validated_reassignable: true,
    sla_allows_claims: false,
    allows_open_data: true,
    allows_open_data_location: false,
    allows_open_data_sensible_location: false,
    allows_ssi: true,
    allows_ssi_location: false,
    allows_ssi_sensible_location: false,
    autovalidate_records: false,
    record_type_id: 5,
    keywords: [],
    lopd: '',
    head_text: '',
    footer_text: '',
    head_text_es: null,
    head_text_ca: null,
    head_text_en: null,
    app_description_es: '',
    app_description_ca: '',
    app_description_en: '',
    lopd_es: null,
    lopd_ca: null,
    lopd_en: null,
    footer_text_es: null,
    footer_text_ca: null,
    footer_text_en: null,
    description_es: '1a tinencia de alcaldia',
    description_ca: "1a tinència d'alcaldia",
    description_en: 'Vance 1a mayoralty',
    short_description_es: '1A TINENCIA DE ALCALDIA',
    short_description_ca: "1A TINÈNCIA D'ALCALDIA",
    short_description_en: null,
    $odd: true,
  }

  describe('Value', () => {
    it('Should be equal to initial value', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on external change', () => {
      const wrapper = factory(initialValue)

      const newValue = 'test'

      wrapper.setProps({ model: { test_model: newValue } })

      expect(wrapper.vm.value).toBe(newValue)
    })

    it('Should change when selection occurs', () => {
      const wrapper = factory(initialValue)

      wrapper.setData({ selectValue: newValue })

      expect(wrapper.vm.value).toBe(newValue)
    })
  })
})
