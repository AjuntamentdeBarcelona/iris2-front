import { shallowMount } from '@vue/test-utils'
import FieldTimePicker from './fieldTimePicker'
import moment from 'moment'

describe('Field Time Picker', () => {
  function factory(initialValue) {
    return shallowMount(FieldTimePicker, {
      mocks: {
        $t: key => key,
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

      wrapper.setProps({
        model: { test_model: true },
      })

      expect(wrapper.vm.value).toBe(true)
    })

    it("Shouldn't change when just the hours are selected", () => {
      const wrapper = factory(initialValue)

      wrapper.setData({
        selectedHour: 9,
      })

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it("Shouldn't change when just the minutes are selected", () => {
      const wrapper = factory(initialValue)

      wrapper.setData({
        selectedMinute: 59,
      })

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change when both hours and minutes are selected', () => {
      const wrapper = factory(initialValue)
      const expectedTime = moment('9:59', 'HH:mm')

      wrapper.setData({
        selectedHour: 9,
        selectedMinute: 59,
      })

      expect(wrapper.vm.value).toEqual(expectedTime)
    })
  })
})
