import FieldPikaday from './FieldPikaday.vue'
import { formatValueToModel } from './FieldPikaday'
import { shallowMount, mount } from '@vue/test-utils'
import fecha from 'fecha'
import _ from 'lodash'

const options = initialValue => ({
  mocks: {
    $t: key => key,
  },
  propsData: {
    schema: {
      model: 'created_at_ini',
      format: 'DD/MM/YYYY',
      pikadayOptions: {
        format: 'DD/MM/YYYY',
      },
    },
    model: { created_at_ini: initialValue },
  },
})

function createField(initialValue) {
  return shallowMount(FieldPikaday, options(initialValue))
}

function mountField(initialValue) {
  return mount(FieldPikaday, options(initialValue))
}

describe('FieldPikaday', () => {
  describe('value', () => {
    it('Should be set correctly at initialization', () => {
      const wrapper = createField('24/10/2019')

      expect(wrapper.vm.value).toEqual('24/10/2019')
    })

    it('Should change accordingly when the model changes', () => {
      const wrapper = createField('24/10/2019')
      wrapper.setData({ model: { created_at_ini: '25/10/2019' } })

      expect(wrapper.vm.value).toEqual('25/10/2019')
    })
  })

  describe('formatValueToModel', () => {
    it("Should return null if the value can't be parsed by fecha", () => {
      const boundFormatFn = formatValueToModel.bind({
        getDateFormat: () => 'YYYY-MM-DD',
      })

      expect(boundFormatFn('2019-09-')).toBe(null)
    })

    it('Should return the value if it can be parsed by fecha', () => {
      const boundFormatFn = formatValueToModel.bind({
        getDateFormat: () => 'YYYY-MM-DD',
        schema: {},
      })

      const date = '2019-09-24'

      expect(_.trimEnd(boundFormatFn(date), '0')).toEqual(
        _.trimEnd(
          (fecha.parse(date, 'YYYY-MM-DD').getTime() / 1000).toFixed(0),
          '0'
        )
      )
    })
  })
})
