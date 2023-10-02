import { shallowMount } from '@vue/test-utils'
import FieldGeoBcn from './fieldGeoBcn'
import GeoBcn from '~/components/forms/GeoBcn'
import Vuex from 'vuex'
import Vue from 'vue'

describe('Field Geo Bcn', () => {
  function factory(initialValue) {
    Vue.use(Vuex)
    return shallowMount(FieldGeoBcn, {
      mocks: {
        $t: key => key,
        $store: new Vuex.Store({
          modules: {
            create: {
              detail: {
                id: 1,
                requires_ubication: true,
                requires_district: true,
              },
              loadingDetail: false,
              detailError: false,
            },
          },
        }),
      },
      propsData: {
        schema: {
          model: 'test_model',
        },
        model: {
          test_model: initialValue,
        },
      },
    })
  }

  const initialValue = null

  describe('Value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on external change', () => {
      const wrapper = factory(initialValue)

      wrapper.setProps({ model: { test_model: 'test' } })

      expect(wrapper.vm.value).toBe('test')
    })

    it('Should change on value change at creation', () => {
      const newValue = 'aaa'

      const wrapper = factory(newValue)

      expect(wrapper.vm.value).toBe(newValue)
    })

    it('Should change when a coordinate has been set on the map', () => {
      const wrapper = factory(initialValue)

      const address = {
        carrer: {
          tipusVia: {
            nom: 'Carrer',
          },
          nom27: 'València',
          nom: 'VALENCIA',
          nomComplet: 'Carrer València',
        },
        numeroPostalInicial: '0395',
        lletraPostalInicial: '',
        barri: {
          nom: 'la Sagrada Família',
          codi: '06',
        },
        districte: {
          codi: '02',
          descripcio: 'Eixample',
        },
        seccioEst: '291',
        id: '35030800395003950',
        seccioCensal: '052',
        floor: '',
        door: '',
        localitzacio: {
          x: 430991.9446,
          y: 4583624.7715,
        },
        tipusNumero: '1',
      }

      const valueAddress = {
        coordinate_utm_x: null,
        coordinate_utm_y: null,
        coordinate_x: null,
        coordinate_y: null,
        district: '02',
        door: '',
        floor: '',
        geocode_district_id: '02',
        geocode_validation: '35030800395003950',
        latitude: null,
        letter: '',
        longitude: null,
        neighborhood: 'la Sagrada Família',
        neighborhood_b: 'la Sagrada Família',
        neighborhood_id: '06',
        numbering_type: '1',
        official_street_name: 'València',
        research_zone: '052',
        statistical_sector: '291',
        street: 'Carrer València',
        street2: '0395',
        via_type: 'Carrer',
        xetrs89a: 430991.9446,
        yetrs89a: 4583624.7715,
      }

      wrapper.vm.selectAddress(address)

      expect(wrapper.vm.value).toEqual(valueAddress)
    })
  })
})
