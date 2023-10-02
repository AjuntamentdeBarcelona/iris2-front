import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import irisField from './irisField'
import { abstractField } from 'vue-form-generator'

describe('irisField', () => {
  const required = ['requiredA', 'requiredB']
  const dummyComponent = {
    mixins: [irisField, abstractField],
    render() {
      return ''
    },
  }
  const wrapper = shallowMount(dummyComponent, {
    propsData: {
      schema: {
        requiredFields: required,
      },
    },
  })
  it('should return required fields if defined in schema', () => {
    expect(wrapper.vm.getRequired()).toEqual(required)
  })

  it('should work without required fields', () => {
    wrapper.setProps({ schema: {} })
  })

  it('should be disabled if not has all fields', () => {
    wrapper.setProps({
      schema: {
        requiredFields: required,
      },
      model: {
        requiredA: null,
        requiredB: 'test_value',
      },
    })
    expect(wrapper.vm.hasAllRequired()).toBe(false)
    expect(wrapper.vm.isDisabled).toBe(true)
  })

  it('should be enabled if has all fields', () => {
    wrapper.setProps({
      schema: {
        requiredFields: required,
      },
      model: {
        requiredA: 'test_value',
        requiredB: 'test_value',
      },
    })
    expect(wrapper.vm.hasAllRequired()).toBe(true)
    expect(wrapper.vm.isDisabled).toBe(false)
  })
})
