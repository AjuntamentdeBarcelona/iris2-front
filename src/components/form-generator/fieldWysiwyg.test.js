import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import fieldWysiwyg from './fieldWysiwyg.vue'

describe('Field Wysiwyg', () => {
  function factory(initialValue) {
    return shallowMount(fieldWysiwyg, {
      propsData: {
        schema: {
          id: 'test_id',
          model: 'test_model',
        },
        model: {
          test_model: initialValue,
        },
      },
    })
  }

  const initialValue = '<p>This is a test message.</p>'
  const newValue = '<p>This is a <b>new</b> test message</p>'

  describe('Value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on external change', () => {
      const wrapper = factory(initialValue)

      wrapper.setProps({
        schema: {
          model: 'test_model',
        },
        model: {
          test_model: newValue,
        },
      })

      expect(wrapper.vm.value).toBe(newValue)
    })
  })
})
