import Vue from 'vue'
import { mount } from '@vue/test-utils'
import SideNavigation from './SideNavigation.vue'
import * as navigation from '~/store/navigation.js'
import * as indexStore from '~/store/index.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vuex from 'vuex'

Vue.use(Vuex)

library.add(faBars)

Vue.component('font-awesome-icon', FontAwesomeIcon)

describe('SideNavigation component', () => {
  const wrapper = mount(SideNavigation, {
    mocks: {
      $store: new Vuex.Store({
        ...indexStore,
        modules: {
          navigation: { ...navigation, namespaced: true },
        },
      }),
    },
  })

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
