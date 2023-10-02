import nuxtShallowMount from '~/assets/js/nuxt/testUtils'
import fieldFavorite from './fieldFavorite.vue'

describe('Field Favorite', () => {
  function factory(initialValue) {
    return nuxtShallowMount(fieldFavorite, {
      schema: {
        id: 'test',
        model: 'test_model',
      },
      model: {
        test_model: initialValue,
      },
    })
  }

  const initialValue = false

  describe('Value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on external change', () => {
      const wrapper = factory(initialValue)

      wrapper.setProps({
        schema: { model: 'test_model' },
        model: { test_model: true },
      })

      expect(wrapper.vm.value).toBe(true)
    })
  })
})
