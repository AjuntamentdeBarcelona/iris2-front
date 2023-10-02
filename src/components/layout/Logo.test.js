import { mount } from '@vue/test-utils'
import Logo from './Logo.vue'

describe('Logo component', () => {
  const wrapper = mount(Logo)

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
