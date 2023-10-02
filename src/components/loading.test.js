import { mount } from '@vue/test-utils'
import loading from './loading.vue'

describe('loading component', () => {
  const wrapper = mount(loading)

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should start load', () => {
    wrapper.vm.start()
    expect(wrapper.vm.loading).toBeTruthy()
  })
  it('should finish load', () => {
    wrapper.vm.finish()
    expect(wrapper.vm.loading).toBeFalsy()
  })
})
