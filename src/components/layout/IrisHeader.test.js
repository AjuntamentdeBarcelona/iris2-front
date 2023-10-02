import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import IrisHeader from './IrisHeader.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('IrisHeader component', () => {
  describe('with a store', () => {
    let store
    let getters

    beforeEach(() => {
      getters = {
        loggedInUser: () => 'user',
      }
      store = new Vuex.Store({
        getters,
      })
    })

    it('is a Vue instance', () => {
      const wrapper = shallowMount(IrisHeader, { store, localVue })
      expect(wrapper.isVueInstance()).toBeTruthy()
    })
  })
})
