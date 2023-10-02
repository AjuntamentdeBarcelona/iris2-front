import { mount } from '@vue/test-utils'
import Navigation from './Navigation.vue'

describe('Navigation component', () => {
  const wrapper = mount(Navigation)

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
