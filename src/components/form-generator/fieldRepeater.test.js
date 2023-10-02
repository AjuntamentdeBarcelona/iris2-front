import { shallowMount } from '@vue/test-utils'
import fieldRepeater from './fieldRepeater.vue'

describe('Field Repeater', () => {
  function factory(initialValue) {
    return shallowMount(fieldRepeater, {
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

  const initialValue = [{ id: 1, value: 'One' }, { id: 2, value: 'Two' }]
  const newValue = initialValue.concat([{ id: 3, value: 'Three' }])

  describe('Value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on model update', () => {
      const wrapper = factory(initialValue)

      wrapper.setData({ internalModel: { values: newValue } })
      wrapper.vm.modelUpdated()

      expect(wrapper.vm.value).toBe(newValue)
    })
  })

  describe('Internal value', () => {
    it('Should change on external change', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.internalModel.values).toBe(initialValue)

      wrapper.setProps({
        schema: { model: 'test_model' },
        model: { test_model: newValue },
      })

      expect(wrapper.vm.internalModel.values).toBe(newValue)
    })
  })
})
