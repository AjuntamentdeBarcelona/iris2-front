import { shallowMount } from '@vue/test-utils'
import FieldConfirm from './fieldConfirm'

describe('Field Confirm', () => {
  function factory(initialValue) {
    return shallowMount(FieldConfirm, {
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
        schema: { model: 'test_model' },
        model: { test_model: '' },
      })

      expect(wrapper.vm.value).toBe('')
    })

    it("Shouldn't change when just one of the inputs is filled", () => {
      const wrapper = factory(initialValue)
      const input1Data = 'data1'

      wrapper.setData({
        submodel: {
          original: input1Data,
          confirmation: '',
        },
      })

      wrapper
        .find({ ref: 'value' })
        .vm.$emit('model-updated', input1Data, 'original')
      wrapper
        .find({ ref: 'value' })
        .vm.$emit(
          'validated',
          true,
          [],
          wrapper.find({ ref: 'value' }).find({ ref: 'child' })
        )

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it("Shouldn't change when both are filled but they don't match", () => {
      const wrapper = factory(initialValue)

      const input1Data = 'data1'
      const input2Data = 'data2'

      wrapper.setData({
        submodel: {
          original: input1Data,
          confirmation: input2Data,
        },
      })

      wrapper
        .find({ ref: 'value' })
        .vm.$emit('model-updated', input1Data, 'original')
      wrapper
        .find({ ref: 'value' })
        .vm.$emit(
          'validated',
          true,
          [],
          wrapper.find({ ref: 'value' }).find({ ref: 'child' })
        )

      wrapper
        .find({ ref: 'confirmation' })
        .vm.$emit('model-updated', input2Data, 'confirmation')
      wrapper
        .find({ ref: 'confirmation' })
        .vm.$emit(
          'validated',
          true,
          [],
          wrapper.find({ ref: 'confirmation' }).find({ ref: 'child' })
        )

      expect(wrapper.vm.value).toBe(initialValue)
    })

    it('Should change when both are filled and they match', () => {
      const wrapper = factory(initialValue)

      const input1Data = 'data1'
      const input2Data = 'data1'

      wrapper.setData({
        submodel: {
          original: input1Data,
          confirmation: input2Data,
        },
      })

      wrapper
        .find({ ref: 'value' })
        .vm.$emit('model-updated', input1Data, 'original')
      wrapper
        .find({ ref: 'value' })
        .vm.$emit(
          'validated',
          true,
          [],
          wrapper.find({ ref: 'value' }).find({ ref: 'child' })
        )

      wrapper
        .find({ ref: 'confirmation' })
        .vm.$emit('model-updated', input2Data, 'confirmation')
      wrapper
        .find({ ref: 'confirmation' })
        .vm.$emit(
          'validated',
          true,
          [],
          wrapper.find({ ref: 'confirmation' }).find({ ref: 'child' })
        )

      expect(wrapper.vm.value).toBe(input1Data)
    })
  })
})
