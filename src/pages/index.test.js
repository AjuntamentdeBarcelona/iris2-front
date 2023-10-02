import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Nuxt from 'nuxt'
import index from './index.vue'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
  ca: {
    index_welcome: 'index_welcome',
    index_username: 'index_username',
    index_identificacio: 'index_identificacio',
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
  const wrapper = mount(index, { i18n })

  it('is a Vue instance', () => {
    const actual = wrapper.html()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
