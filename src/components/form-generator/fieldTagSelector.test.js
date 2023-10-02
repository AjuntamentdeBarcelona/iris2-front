import Vue from 'vue'
import fieldTagSelector from './fieldTagSelector.vue'
import TagSelector from 'vue-tag-selector'
import { nuxtMount } from '~/assets/js/nuxt/testUtils'

Vue.use(TagSelector)

describe('Field Tag Selector', () => {
  function factory(initialValue) {
    return nuxtMount(fieldTagSelector, {
      schema: {
        id: 'test_id',
        model: 'test_model',
      },
      model: {
        test_model: initialValue.slice(),
      },
    })
  }

  const initialValue = ['value_1', 'value_2']

  describe('Initial value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)
      expect(wrapper.vm.value).toEqual(initialValue)
    })
  })

  describe('Deletion', () => {
    it('Should remove the value', () => {
      const wrapper = factory(initialValue)

      wrapper
        .find('.tag-selector--input .tag-selector--item:first-of-type i')
        .trigger('click')
      expect(wrapper.vm.value).toEqual(initialValue.slice(1))
    })
  })
})
