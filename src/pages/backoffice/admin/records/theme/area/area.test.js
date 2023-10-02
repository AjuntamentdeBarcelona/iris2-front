import Vue from 'vue'
import AreaForm from './area.vue'
import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockRouter from 'mock-vue-router'
import nuxtMock from '~/components/pages/form/schemaForm.test.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getGroupStore } from '~/store/groups.test.js'

Vue.component('font-awesome-icon', FontAwesomeIcon)

describe('Area form component', () => {
  const axiosMock = new MockAdapter(axios)
  const { $route, $router } = mockRouter([
    { path: '/add' },
    { path: '/', name: 'test' },
  ])

  function factory(extraProps) {
    extraProps = extraProps || {}
    return shallowMount(AreaForm, {
      propsData: {
        ...extraProps,
      },
      mocks: {
        $axios: axios,
        $route: $route,
        $store: getGroupStore(),
        $router: $router,
        $t: value => value,
        localePath: value => value,
        $nuxt: nuxtMock,
      },
    })
  }

  describe('Action buttons', () => {
    const wrapper = factory()
    jest.spyOn(wrapper.vm, 'goToAddElements')
    it('should have three buttons and one for adding elements', () => {
      expect(wrapper.vm.actionButtons.length).toBe(4)
      expect(
        wrapper.vm.actionButtons.filter(
          element => element.name == 'save_and_add_element'
        ).length
      ).toBe(1)
    })
  })

  describe('Go to add elements', () => {
    const wrapper = factory()
    it('should go to add elements page with selected area', () => {
      jest.spyOn($router, 'replace')
      const id = 1000
      wrapper.vm.goToAddElements({ id: id })
      expect($router.replace).toHaveBeenCalledWith({
        name: wrapper.vm.addElementUrl.name,
        query: { area_id: id },
      })
    })
  })
})
