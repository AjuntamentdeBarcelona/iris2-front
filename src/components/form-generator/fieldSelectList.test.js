import nuxtShallowMount from '~/assets/js/nuxt/testUtils'

import FieldSelectList from './fieldSelectList'
import vSelect from 'vue-select'

describe('Field Select List', () => {
  function factory(initialValue) {
    return nuxtShallowMount(FieldSelectList, {
      schema: {
        model: 'test_model',
      },
      model: {
        test_model: initialValue,
      },
    })
  }

  const initialValue = []

  describe('Value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on external change', () => {
      const wrapper = factory(initialValue)

      const newData = [
        { application: 0, description: 'App01', favourited: false },
      ]

      wrapper.setProps({ model: { test_model: newData } })

      expect(wrapper.vm.value).toBe(newData)
    })

    it('Should change when a new one is selected', () => {
      const wrapper = factory(initialValue)

      const newSelectedItem = { id: 0, description: 'App01' }

      wrapper.find(vSelect).vm.$emit('change', newSelectedItem)

      expect(wrapper.vm.value).toEqual([newSelectedItem])
    })

    it('Should collect succesive selected values', () => {
      const wrapper = factory(initialValue)

      const newSelectedItem1 = { id: 0, description: 'App01', order: 0 }
      const newSelectedItem2 = { id: 1, description: 'App02' }

      wrapper.find(vSelect).vm.$emit('change', newSelectedItem1)
      wrapper.find(vSelect).vm.$emit('change', newSelectedItem2)

      expect(wrapper.vm.value).toEqual([newSelectedItem1, newSelectedItem2])
    })
  })
})
