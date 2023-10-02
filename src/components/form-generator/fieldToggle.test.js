import Vue from 'vue'
import { mount } from '@vue/test-utils'
import fieldToggle from './fieldToggle.vue'
import ToggleButton from 'vue-js-toggle-button'

Vue.use(ToggleButton)

describe('Field toggle', () => {
  function factory(initialValue) {
    return mount(fieldToggle, {
      propsData: {
        schema: {
          id: 'id',
          model: 'test',
        },
        model: {
          test: initialValue,
        },
      },
    })
  }

  function expectToggle(wrapper) {
    expect(wrapper.find('.vue-js-switch').is('.toggled')).toBeTruthy()
    expect(wrapper.vm.value).toBeTruthy()
  }

  function expectUntoggled(wrapper) {
    expect(wrapper.find('.vue-js-switch').is('.toggled')).toBeFalsy()
    expect(wrapper.vm.model.value).toBeFalsy()
  }

  function toggleState(wrapper) {
    wrapper.find('.vue-js-switch').trigger('click')
  }

  describe('Initial value', () => {
    it('Should be toggle when initial value is true', () => {
      const wrapper = factory(true)
      expectToggle(wrapper)
    })
    it('Should be untoggle when initial value is false', () => {
      const wrapper = factory(false)
      expectUntoggled(wrapper)
    })
  })

  describe('Activation', () => {
    it('Should toggle state to true', () => {
      const wrapper = factory(false)
      toggleState(wrapper)
      expectToggle(wrapper)
    })
  })
  describe('Deactivation', () => {
    it('Should toggle state to false', () => {
      const wrapper = factory(true)
      toggleState(wrapper)
      expectUntoggled(wrapper)
    })
  })
})
