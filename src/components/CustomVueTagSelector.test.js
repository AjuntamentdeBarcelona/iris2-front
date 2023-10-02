import { shallowMount } from '@vue/test-utils'
import CustomVueTagSelector from './CustomVueTagSelector'

describe('CustomVueTagSelector', () => {
  const appliedFilters = [
    {
      label: 'Estat',
      displayValue: 'EN RESOLUCIO',
      fieldSchema: {
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        label: 'Estat',
        id: 'state',
        model: 'state',
      },
    },
    {
      label: 'Tipus de sol·licitant',
      displayValue: 'CIUTADÀ',
      fieldSchema: {
        optionLabelAttribute: 'description',
        objectValue: true,
        valueAttribute: 'id',
        label: 'Tipus de sol·licitant',
        id: 'applicant_type',
        model: 'applicant_type',
      },
    },
  ]

  it('Applies filters passed with a prop', () => {
    const wrapper = shallowMount(CustomVueTagSelector, {
      propsData: { value: appliedFilters },
    })
    expect(wrapper.vm.newValue).toBe(appliedFilters)
  })

  it("Outputs error message when an input value doesn't match the provided regex", () => {
    const wrapper = shallowMount(CustomVueTagSelector, {
      propsData: { regex: /\d/ },
    })

    const newTag = 'aaa'

    const input = wrapper.find({ ref: 'input' })

    wrapper.setData({ tag: newTag })
    input.trigger('keyup.enter')

    expect(wrapper.vm.error).toBe('Invalid format')
  })

  it('Creates tags when text is input', () => {
    const wrapper = shallowMount(CustomVueTagSelector)

    const newTag = 'aaa'
    const expectedTags = ['aaa']

    const input = wrapper.find({ ref: 'input' })

    wrapper.setData({ tag: newTag })
    input.trigger('keyup.enter')

    expect(wrapper.vm.newValue).toEqual(expectedTags)
  })

  it('Creates tags even when value prop or newValue were mutated to be undefined (space key used this time)', () => {
    const wrapper = shallowMount(CustomVueTagSelector)

    const newTag = 'aaa '
    const expectedTags = ['aaa']

    const input = wrapper.find({ ref: 'input' })

    // There's no other way to test that statement since the value prop has a default
    wrapper.setProps({ value: undefined })

    wrapper.setData({ tag: newTag })
    input.trigger('keyup.space')

    expect(wrapper.vm.newValue).toEqual(expectedTags)
  })

  it('Removes the last introduced tag on backspace', () => {
    const wrapper = shallowMount(CustomVueTagSelector)

    const newTag = 'aaa'
    const newTag2 = 'bbb'
    const expectedTags = ['aaa']

    const input = wrapper.find({ ref: 'input' })

    wrapper.setData({ tag: newTag })
    input.trigger('keyup.enter')

    wrapper.setData({ tag: newTag2 })
    input.trigger('keyup.enter')

    wrapper.setData({ tag: '' })
    input.trigger('keyup.backspace')

    expect(wrapper.vm.newValue).toEqual(expectedTags)
  })

  it('Removes introduced tags on multiple backspaces', () => {
    const wrapper = shallowMount(CustomVueTagSelector)

    const newTag = 'aaa'
    const newTag2 = 'bbb'
    const expectedTags = []

    const input = wrapper.find({ ref: 'input' })

    wrapper.setData({ tag: newTag })
    input.trigger('keyup.enter')

    wrapper.setData({ tag: newTag2 })
    input.trigger('keyup.enter')

    input.trigger('keyup.backspace')
    input.trigger('keyup.backspace')

    expect(wrapper.vm.newValue).toEqual(expectedTags)
  })

  it('Removes introduced tag after having deleted the characters from a word', () => {
    const wrapper = shallowMount(CustomVueTagSelector)

    const newTag = 'aaa'
    const newTag2 = 'bbb'
    const expectedTags = ['aaa']

    const input = wrapper.find({ ref: 'input' })

    wrapper.setData({ tag: newTag })
    input.trigger('keyup.enter')

    wrapper.setData({ tag: newTag2 })
    input.trigger('keyup.backspace')
    input.trigger('keyup.backspace')
    input.trigger('keyup.backspace')
    wrapper.setData({ tag: '' })

    input.trigger('keyup.backspace')

    expect(wrapper.vm.newValue).toEqual(expectedTags)
  })
})
