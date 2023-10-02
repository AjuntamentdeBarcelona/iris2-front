import IrisFormGenerator from './irisFormGenerator.vue'
import { shallowMount } from '@vue/test-utils'

function factory(externalErrors, errors, extraProps) {
  extraProps = extraProps || {}
  return shallowMount(IrisFormGenerator, {
    propsData: {
      externalErrors: externalErrors,
      ...extraProps,
    },
    data: () => {
      return { errors: errors }
    },
  })
}

describe('Iris Form Generator', () => {
  it('should mount default', () => {
    shallowMount(IrisFormGenerator)
  })

  describe('External error handling', () => {
    it('allErrors should be union of external and internal errors', () => {
      const wrapper = factory(['External Error 1', 'External error 2'])
      wrapper.setData({ errors: ['Internal error 1', 'Internal Error 2'] })
      expect(wrapper.vm.allErrors).toEqual([
        'Internal error 1',
        'Internal Error 2',
        'External Error 1',
        'External error 2',
      ])
    })
  })

  describe('group defined classes', () => {
    it('should return group defined class', () => {
      const wrapper = factory([], [])
      const groupClass = 'test-group-class'
      const classes = wrapper.vm.getFieldsetRowClasses({ class: groupClass })
      expect(classes).toContain(groupClass)
    })
  })
})
