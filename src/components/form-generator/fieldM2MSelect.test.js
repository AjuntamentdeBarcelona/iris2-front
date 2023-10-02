import FieldM2MSelect from './FieldM2MSelect'
import { shallowMount } from '@vue/test-utils'

function createField(initialValue, axiosResults) {
  return shallowMount(FieldM2MSelect, {
    mocks: {
      $t: key => key,
      $axios: {
        get: () => {
          return Promise.resolve({ data: axiosResults })
        },
      },
    },
    propsData: {
      schema: { model: 'test_model', modelAttribute: 'test_model_attr' },
      model: { test_model: initialValue },
    },
  })
}

describe('FieldM2MSelect', () => {
  describe('value', () => {
    it('Should be setted correctly', () => {
      const wrapper = createField([{ test_model_attr: 1, description: 'test' }])

      expect(wrapper.vm.value).toEqual([{ test_model_attr: 1 }])
    })

    it('Should change when adding all options', async () => {
      const axiosResults = [
        { id: 1, description: 'test' },
        { id: 2, description: 'test2' },
      ]
      const expectedValue = [{ test_model_attr: 1 }, { test_model_attr: 2 }]

      const wrapper = createField([], axiosResults)

      await wrapper.vm.$nextTick()

      wrapper.vm.addAll()

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.value).toEqual(expectedValue)
    })

    it('Should change when adding some options', async () => {
      const axiosResults = [
        { id: 1, description: 'test' },
        { id: 2, description: 'test2' },
      ]
      const expectedValue = [{ test_model_attr: 2 }]

      const wrapper = createField([], axiosResults)

      await wrapper.vm.$nextTick()

      wrapper.setData({ markedSelectable: [2] })
      wrapper.vm.addMarked()

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.value).toEqual(expectedValue)
    })

    it('Should reset on user action', () => {
      const wrapper = createField(
        [],
        [{ test_model_attr: 1, description: 'test' }]
      )

      wrapper.vm.removeAll()

      expect(wrapper.vm.value).toEqual([])
    })
  })

  describe('allOptions', () => {
    it('Should contain the api results', async () => {
      const axiosResults = [
        { id: 1, description: 'test' },
        { id: 2, description: 'test2' },
      ]

      const expectedValue = [{ test_model_attr: 1 }, { test_model_attr: 2 }]

      const wrapper = createField([], axiosResults)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.allOptions).toEqual(axiosResults)
    })
  })
})
