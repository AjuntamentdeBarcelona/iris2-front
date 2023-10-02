import nuxtShallowMount from '~/assets/js/nuxt/testUtils'
import FieldNestedForm from './FieldNestedForm'

describe('Nested form', () => {
  function factory(initialValue, extraProps, extraMocks) {
    return nuxtShallowMount(
      FieldNestedForm,
      {
        schema: {
          model: 'test_model',
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

  const newValue = {}

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
  })
})
