import Vue from 'vue'
import ElementForm from './add.vue'
import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockRouter from 'mock-vue-router'
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
    return shallowMount(ElementForm, {
      propsData: {
        ...extraProps,
      },
      mocks: {
        $axios: axios,
        $route: $route,
        $router: $router,
        $store: getGroupStore(),
        $t: value => value,
        localePath: value => value,
      },
    })
  }

  describe('Action buttons', () => {
    const wrapper = factory()
    it('should have three buttons and one for adding elements', () => {
      expect(wrapper.vm.actionButtons.length).toBe(4)
      expect(
        wrapper.vm.actionButtons.filter(
          element => element.name == 'save_and_add_detail'
        ).length
      ).toBe(1)
    })
  })

  describe('Go to add details', () => {
    const wrapper = factory()
    it('should go to add details page with selected element', () => {
      jest.spyOn($router, 'push')
      const id = 1000
      wrapper.vm.goToAddDetails({ id: id })
      expect($router.push).toHaveBeenCalledWith({
        name: wrapper.vm.addDetailUrl.name,
        query: { element_id: id },
      })
    })
  })
})
