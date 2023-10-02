import { shallowMount } from '@vue/test-utils'
import FieldTextAreaCount from './fieldTextAreaCount'

describe('Field Textarea Count', () => {
  function factory(initialValue) {
    return shallowMount(FieldTextAreaCount, {
      mocks: {
        $t: key => key,
      },
      propsData: {
        schema: {
          model: 'test_model',
          minWords: 2,
          minWordLength: 4,
          min: 8,
          max: 80,
        },
        model: {
          test_model: initialValue,
        },
      },
    })
  }

  const initialValue = ''

  describe('Value', () => {
    it('Should be equal to initialValue', () => {
      const wrapper = factory(initialValue)

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change on external change', () => {
      const wrapper = factory(initialValue)
      const testString = 'Test'

      wrapper.setProps({
        model: { test_model: testString },
      })

      expect(wrapper.vm.value).toBe(testString)
    })
  })

  describe('Error messages', () => {
    it("Should show an specific message if requirements aren't met", () => {
      const wrongValue = 'Wrong'
      const wrongMessage = 'valid_words 1/2 min.'

      const wrapper = factory(wrongValue)

      const wordErrors = wrapper.find({ ref: 'words' })

      expect(wordErrors.text()).toBe(wrongMessage)
    })

    it('Should show an specific message if requirements are met', () => {
      const rightValue = 'Right value'
      const rightMessage = 'valid_words 2/2 min.'

      const wrapper = factory(rightValue)

      const wordErrors = wrapper.find({ ref: 'words' })

      expect(wordErrors.text()).toBe(rightMessage)
    })
  })
})
