import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import axios from 'axios'
import mockRouter from 'mock-vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('sweet-modal', {
  methods: {
    open() {},
    close() {},
  },
  template: 'mock-modal',
})

export let nuxtMock = {
  $loading: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = true
    },
  },
}

/**
 * Shallow mount wrapper that includes all the necessary mocks in order to perform unit tests.
 * @param {Vue} component
 * @param {*} extraProps
 */
export default function nuxtShallowMount(
  component,
  extraProps,
  mocks = {},
  mountFn = shallowMount
) {
  extraProps = extraProps || {}
  let { $routeM, $routerM } = mockRouter([
    { path: '/add' },
    { path: '/', name: 'test' },
  ])
  $routeM = { path: '/add' }
  return mountFn(component, {
    propsData: {
      ...extraProps,
    },
    mocks: {
      $axios: axios,
      $route: $routeM,
      $router: $routerM,
      $t: value => value,
      localePath: value => value,
      $nuxt: nuxtMock,
      ...mocks,
    },
  })
}

export function nuxtMount(component, extraProps, mocks = {}) {
  return nuxtShallowMount(component, extraProps, mocks, mount)
}
