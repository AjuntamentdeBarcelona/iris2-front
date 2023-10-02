import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Nuxt from 'nuxt'
import index from './dashboard.vue'
import { shallowMountWithMasterStore } from '~/assets/js/nuxt/testMasters.js'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
  ca: {
    dashboard_title: 'dashboard_title',
  },
}
const i18n = new VueI18n({
  locale: 'ca',
  fallbackLocale: 'ca',
  messages,
})

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
