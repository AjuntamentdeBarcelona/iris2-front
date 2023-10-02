import Vue from 'vue'
import fieldSwitchResponseChannel from './fieldSwitchResponseChannel'
import {
  shallowMountWithMasterStore,
  responseChannels,
} from '~/assets/js/nuxt/testMasters'
import ToggleButton from 'vue-js-toggle-button'

Vue.use(ToggleButton)

describe('Select response channels', () => {
  describe('When values area loaded', () => {
    const active = [{ responsechannel: 1 }, { responsechannel: 2 }]
    const wrapper = shallowMountWithMasterStore(fieldSwitchResponseChannel, {
      model: { test: active },
      schema: { model: 'test' },
    })
    it('Should receive options', () => {
      expect(wrapper.vm.loaded).toBeTruthy()
      expect(wrapper.vm.toggles).toEqual(responseChannels)
    })
    it('Should mark active options', () => {
      expect(wrapper.vm.activeChannelsToggles).toEqual(['1', '2'])
    })
    it('Should toggle state if activated', () => {
      wrapper.vm.changeToggleState({
        value: true,
        srcEvent: { srcElement: { name: '3' } },
      })
      wrapper.vm.changeToggleState({
        value: true,
        srcEvent: { srcElement: { name: '2' } },
      })
      expect(wrapper.vm.activeChannelsToggles).toEqual(['1', '2', '3'])
      expect(wrapper.vm.value).toEqual([
        { responsechannel: 1 },
        { responsechannel: 2 },
        { responsechannel: 3 },
      ])
    })
    it('Should toggle state if deactivated', () => {
      wrapper.vm.changeToggleState({
        value: false,
        srcEvent: { srcElement: { name: '3' } },
      })
      wrapper.vm.changeToggleState({
        value: false,
        srcEvent: { srcElement: { name: '1' } },
      })
      expect(wrapper.vm.activeChannelsToggles).toEqual(['2'])
      expect(wrapper.vm.value).toEqual([{ responsechannel: 2 }])
    })
  })
  describe('When init without values', () => {
    const wrapper = shallowMountWithMasterStore(fieldSwitchResponseChannel, {
      model: {},
      schema: { model: 'test' },
    })
    it('should not have any toggled', () => {
      expect(wrapper.vm.activeChannelsToggles).toEqual([])
    })
  })
})
