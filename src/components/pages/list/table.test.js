import { shallowMount } from '@vue/test-utils'
import table from './table.vue'

import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({})

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

describe('Table list component', () => {
  const addUrl = '/api/test-list-url/'
  let props = { queryParams: {}, url: addUrl }
  const wrapper = shallowMount(table, {
    i18n: i18n,
    propsData: props,
    data: () => {
      return {
        options: {
          columns: ['column_a', 'column_b'],
          headings: {
            column_a: 'Test Column',
            column_b: 'Test Column B',
          },
        },
      }
    },
  })

  describe('When additional query parameters are given', () => {
    props.queryParams = { test_param: 'test' }
    wrapper.setProps(props)
    it('should include additional query parameters', () => {
      const params = wrapper.vm.getRequestParams()
      expect(props.queryParams.test_param).toBe(props.queryParams.test_param)
    })
  })
  describe('Enpoint url', () => {
    it('should load the data from defined enpoint in props', () => {
      expect(wrapper.vm.getUrl()).toBe(props.url)
    })
  })
  describe('Detail url name', () => {})
  describe('Pagination', () => {})
})
