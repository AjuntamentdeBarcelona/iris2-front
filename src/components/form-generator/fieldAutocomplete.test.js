import fieldAutocomplete from './fieldAutocomplete'
import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

function axiosMock(testUrl, results, axios) {
  let mock = new MockAdapter(axios)
  const result = Array.isArray(results) ? { results: results } : results
  mock.onGet(testUrl).reply(200, result)
  return mock
}

function factory(schema, model, extraProps, testUrl, results) {
  extraProps = extraProps || {}
  testUrl = testUrl || ''
  results = results || []
  const mock = axiosMock(testUrl, results, axios)
  return shallowMount(fieldAutocomplete, {
    propsData: {
      schema: schema,
      model: model,
      ...extraProps,
    },
    mocks: {
      $axios: axios,
      $t: val => val,
    },
  })
}

function testVSelectCreation(wrapper) {
  expect(wrapper.find('.v-select')).toBeTruthy()
}

describe('vue-form-generator autocomplete field', () => {
  const url = '/test/autocomplete/'

  describe('autocomplete with fixed options', () => {
    const schema = {
      model: 'test',
      options: ['test', 'test3'],
    }
    const wrapper = factory(schema, {})

    it('should have options', () => {
      expect(wrapper.vm.$data.options).toBe(schema.options)
    })

    it('should not load data from external service', () => {
      expect(wrapper.vm.initialLoad()).toBeUndefined()
    })

    it('should create v-select field with fixed options', () =>
      testVSelectCreation(wrapper))
  })

  describe('initial value', () => {
    describe('initial value has cached', () => {
      it('should set cached as initial value', () => {
        const value = { id: 1, name: 'Test' }
        const schema = {
          model: 'test',
          options: ['test', 'test3'],
          getInitialOption: model => {
            return value
          },
        }
        const wrapper = factory(schema, { test: value.id }, {}, url, [])
        wrapper.vm.setInitialOption()
        expect(wrapper.vm.internalSelectValue).toBe(value)
        expect(wrapper.vm.value).toBe(value.id)
      })
      it('should retrieve initial from server if isRestful options is set only and cached value is not available', () => {
        const value = { id: 2, name: 'Test' }
        const schema = {
          model: 'test',
          getInitialOption: () => null,
          isRestful: true,
          url: url,
        }
        const wrapper = factory(
          schema,
          { test: value.id },
          {},
          url + value.id,
          value
        )
        wrapper.vm.setInitialOption().then(() => {
          expect(wrapper.vm.model.test).toEqual(value.id)
          expect(wrapper.vm.selectValue).toEqual(value)
          expect(wrapper.vm.options).toEqual([value])
        })
      })
    })
  })

  describe('autocomplete with url', () => {
    const schema = {
      model: 'test',
      options: ['test', 'test3'],
      url: url,
    }
    const results = [{ name: 'test', id: 1 }, { name: 'test2', id: 2 }]
    const wrapper = factory(schema, {}, {}, url, results)

    it('should make initialLoad when value is empty', () => {
      expect(wrapper.vm.setInitialOption(wrapper.vm.model)).toBe(false)
      expect(wrapper.vm.initialLoad()).toBeDefined()
    })

    it('should search performing axios request to defined url', () => {
      const search = 'test'
      wrapper.vm.search(search).then(result => {
        expect(result).toEqual()
      })
    })

    it('should create v-select field with url option', () =>
      testVSelectCreation(wrapper))
  })

  describe('value update', () => {
    const attr = 'value_test'
    const schema = {
      model: attr,
      valueAttribute: null,
      objectValue: true,
    }
    const value = { test: 'test', testB: 'testing props' }

    it('should return value directly when objectValue is set in schema', () => {
      const wrapper = factory(schema, {}, {}, url)
      wrapper.vm.onChange(value)
      expect(wrapper.vm.model[attr]).toBe(value)
    })

    it('should return object attribute defined in valueAttribute in the schema', () => {
      schema.valueAttribute = 'testB'
      schema.objectValue = false
      const wrapper = factory(schema, {}, {}, url)
      wrapper.vm.onChange(value)
      expect(wrapper.vm.model[attr]).toBe(value['testB'])
    })
  })

  describe('test query parameters', () => {
    const searchValue = 'testingsearch'

    it('should use search as default', () => {
      const wrapper = factory({}, {}, {}, url)
      expect(wrapper.vm.getQueryParams(searchValue)).toEqual({
        search: searchValue,
      })
    })
    it('should use defined in schema', () => {
      const queryParam = 'test-search-param'
      const wrapper = factory({ queryParam: queryParam }, {}, {}, url)
      const expectedParams = {}
      expectedParams[queryParam] = searchValue
      expect(wrapper.vm.getQueryParams(searchValue)).toEqual(expectedParams)
    })
    it('should include forward parameters', () => {
      const wrapper = factory(
        { forwardFields: ['test_field', 'another_field'] },
        { another_field: 'field value', test_field: 2 },
        {},
        url
      )
      const params = wrapper.vm.getQueryParams(searchValue)
      wrapper.vm.schema.forwardFields.forEach(field => {
        expect(params[field]).toBe(wrapper.vm.model[field])
      })
    })
  })

  describe('process ajax results', () => {
    const wrapper = factory({}, {}, {}, url)
    it('should return paginated results from API', () => {
      const test = { results: [1, 2, 3, 4, 5, 6] }
      const results = wrapper.vm.processAjaxResult(test)
      expect(results).toEqual(test.results)
    })
    it('should return direct results from API', () => {
      const test = [1, 2, 3, 4, 5, 6]
      const results = wrapper.vm.processAjaxResult(test)
      expect(results).toEqual(test)
    })
  })
})
