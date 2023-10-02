import nuxtShallowMount from '~/assets/js/nuxt/testUtils'
import AttributeFilterField from './AttributeFilterField.vue'
import Feature from '~/assets/js/iris2/model/Feature.js'

describe('Attribute filter field', () => {
  function factory(model) {
    return nuxtShallowMount(AttributeFilterField, {
      model: model,
      schema: {},
    })
  }

  describe('Process select options according to its origin', () => {
    const w = factory({})
    it('should take feature attribute when origin is detail features', () => {
      const testData = {
        results: [{ id: 1, feature: { id: 1 }, enabled: true }],
      }
      expect(w.vm.processAjaxResult(testData)).toEqual([
        testData.results[0].feature,
      ])
    })
    it('should take full result when origin is the whole feature set', () => {
      const testData = {
        results: [{ id: 1 }, { id: 2 }, { id: 3 }],
      }
      expect(w.vm.processAjaxResult(testData)).toEqual(testData.results)
    })
  })

  describe('Generate form schema for a feature', () => {
    const w = factory({})

    it('Should generate schema from a valid feature addapting the returned by Feature.js utilities', () => {
      const feature = {
        id: 1,
        mask: {
          id: 1000,
          regexp: /^(\d){2}:(\d){2}$/,
          maskDescription: 'TEST',
          errorText: 'TEST ERROR',
          extraErrorText: 'TEST ERROR',
          validator: function testValidator() {},
        },
        value: 'AAAA',
      }
      const definition = w.vm.getSchemaForItem(feature),
        expectedSchema = Feature.schemaFromFeature(feature)
      expect(definition.fields.value).toBeTruthy()
      const schema = definition.fields.value
      expect(schema.required).toBeFalsy()
      expect(schema.validator).toEqual([])
      expect(schema.type).toEqual(expectedSchema.type)
      expect(schema.inputType).toEqual(expectedSchema.inputType)
      expect(schema.pattern).toEqual(expectedSchema.pattern)
    })
  })
})
