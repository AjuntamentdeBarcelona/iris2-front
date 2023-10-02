import Vue from 'vue'
import { mount } from '@vue/test-utils'
import irisFormGroup from './irisFormGroup.vue'
import VueFormGenerator from 'vue-form-generator'

describe('Iris form group', () => {
  const FormGenerator = Vue.extend(VueFormGenerator.component)
  function factory(extraSchema) {
    extraSchema = extraSchema || {}
    const schema = {
      test: {
        id: 'id',
        type: 'input',
        inputType: 'text',
        model: 'test',
        ...extraSchema,
      },
    }
    const model = {}
    return mount(irisFormGroup, {
      propsData: {
        vfg: new FormGenerator({
          propsData: {
            schema: schema,
            model: model,
          },
        }),
        model: model,
        options: {},
        field: schema.test,
        errors: [{ field: schema.test, error: 'This is a test error' }],
        model: {
          test: 'AAAA',
        },
      },
    })
  }
  describe('Group render', () => {
    const group = factory()
    it('should render', () => {
      expect(group.contains('.field-wrap input[type="text"]')).toBeTruthy()
    })
    it('should have child ref', () => {
      expect(group.vm.$refs.child).toBeTruthy()
    })
    it('should display errors', () => {
      expect(group.contains('.errors')).toBeTruthy()
    })
  })
  describe('Hide group errors', () => {
    const group = factory({ hideGroupErrors: true })
    it('Should not render errors and delegate their rendering to its own fields', () => {
      expect(group.contains('.errors')).toBeFalsy()
    })
  })
})
