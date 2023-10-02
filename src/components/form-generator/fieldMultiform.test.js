import Vue from 'vue'
import multiformTest from './test-utils/multiformTest.js'
import fieldMultiform from './fieldMultiform.vue'
import { shallowMount } from '@vue/test-utils'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import IrisFormGenerator from '~/components/pages/form/irisTableFormGenerator.vue'

Vue.component('form-generator', IrisFormGenerator)

describe('Multiform field', () => {
  const uidField = 'id'
  function factory(extraSchema, extraProps) {
    return shallowMount(fieldMultiform, {
      propsData: {
        schema: {
          type: 'multiform',
          model: 'results',
          inlineIdName: uidField,
          labelField: 'name',
          canDelete: false,
          hideGroupErrors: true,
          formOptions: {
            validateDebounceTime: 0,
          },
          ...extraSchema,
        },
        model: {
          results: [
            {
              id: 1,
              name: 'Name 1',
            },
            {
              id: 2,
              name: 'Name 2',
            },
            {
              id: 3,
              name: 'Name 0',
            },
            {
              id: 4,
              name: 'Name 0',
            },
          ],
        },
        ...extraProps,
      },
    })
  }
  describe('multiple schema', () => {
    const wrapper = factory({
      multischema: {
        1: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              model: 'test',
            },
          ],
        },
        2: {
          fields: [
            {
              type: 'input',
              inputType: 'number',
              model: 'test',
            },
          ],
        },
        3: {
          fields: [
            {
              type: 'input',
              inputType: 'number',
              model: 'test',
            },
          ],
        },
        4: {
          fields: [
            {
              type: 'input',
              inputType: 'number',
              model: 'test',
            },
          ],
        },
      },
    })
    multiformTest(wrapper)
  })
  describe('fixed schema', () => {
    const wrapper = factory({
      itemFormDef: new FormDefinition(
        {
          test: {
            type: 'input',
            inputType: 'text',
            model: 'test',
          },
        },
        { fields: ['test'] }
      ),
    })
    multiformTest(wrapper)
  })
})
