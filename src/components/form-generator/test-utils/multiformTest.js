var _ = require('lodash')

export default function multiformTest(wrapper) {
  describe('formset API', () => {
    it('should return item label', () => {
      const label = wrapper.vm.getItemLabel(wrapper.vm.value[0])
      expect(label).toBe(wrapper.vm.value[0][wrapper.vm.schema.labelField])
    })
    it('should update value', () => {
      wrapper.vm.setValue()
    })
    it('should return array of inline items', () => {
      expect(Array.isArray(wrapper.vm.getInlineItems())).toBe(true)
    })
    if (wrapper.vm.fixedSchema) {
      it('should return fixed schema for unknown items when schema is fixed', () => {
        expect(wrapper.vm.getSchemaForItem({})).toEqual(wrapper.vm.fixedSchema)
      })
    } else {
      it('should return schema for an existent item', () => {
        expect(wrapper.vm.getItemLabel(wrapper.vm.value[0])).toBeTruthy()
      })
      it('should have one form per model', () => {
        expect(wrapper.vm.forms.length).toBe(wrapper.vm.getInlineItems().length)
      })
      it('should render one form per model', () => {
        /**
         * @todo Reenable when test-util bug fixed https://github.com/MattRynbrand/test-utils-components-option-reproduction
         */
        // expect(wrapper.findAll('.iris-table-form').length).toBe(
        //  wrapper.vm.getInlineItems().length
        // )
      })
      it('should throw error when getting schema for unknown items with variable schemas', () => {
        expect(() => {
          wrapper.vm.getSchemaForItem({})
        }).toThrow()
      })
    }
    describe('Individual form event consolidation', () => {
      /**
       * @todo Reenable when test-util bug fixed https://github.com/MattRynbrand/test-utils-components-option-reproduction
       wrapper.find('input[type="text"]').setValue('Value changed')
       it('should handle item updated event', () => {
         expect(wrapper.emitted()['model-updated']).toBeTruthy()
        })
        it('should handle form validated', () => {
          expect(wrapper.emitted()['validated']).toBeTruthy()
        })
*/
    })
    describe('Error handling', () => {
      it('should process valid error array', () => {
        const error = 'This is a test error'
        const result = wrapper.vm.processFormErrors([
          {
            1: {
              test: [error],
            },
          },
        ])
        expect(Array.isArray(result[1])).toBe(true)
        expect(result[1].length).toBe(1)
        expect(result[1][0].error).toBe(error)
      })
      it('should return empty errors', () => {
        expect(wrapper.vm.processFormErrors()).toEqual({})
      })
    })
  })
}
