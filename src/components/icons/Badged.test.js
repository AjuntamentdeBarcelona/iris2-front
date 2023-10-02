import { mount } from '@vue/test-utils'
import Badged from './Badged.vue'

describe('Badged component', () => {
  const wrapper = mount(Badged)

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(actual).toMatchSnapshot()
  })
})
