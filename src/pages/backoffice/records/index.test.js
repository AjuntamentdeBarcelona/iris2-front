import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Nuxt from 'nuxt'
import index from './index.vue'
import { shallowMountWithMasterStore } from '~/assets/js/nuxt/testMasters.js'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({})

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('nuxt', Nuxt)

describe('index component', () => {
  const wrapper = shallowMountWithMasterStore(index, { i18n })

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
