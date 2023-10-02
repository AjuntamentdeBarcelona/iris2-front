import FormDefinition from './formDefinition'

describe('Defining a form', () => {
  describe('Set model and id attribute on schema', () => {
    ;['model', 'id'].forEach(attr => {
      it(`should respect ${attr} when is defined on schema`, () => {
        const forcedValue = 'forced_definition'
        const schema = {}
        schema[attr] = forcedValue
        const definition = new FormDefinition({ test_field: schema }, {})
        expect(definition.fields.test_field[attr]).toBe(forcedValue)
      })
    })

    it('should add model and id attribute from field_name on incomplete schema', () => {
      const fields = { test_field: {} }
      const definition = new FormDefinition(fields, {})
      expect(definition.fields.test_field.model).toBe('test_field')
      expect(definition.fields.test_field.id).toBe('test_field')
    })
  })

  describe('getEmptyModel', () => {
    const fields = { fieldA: {}, fieldB: {} }
    const definition = new FormDefinition(fields, {})

    it('should return object with all fields as null', () => {
      const emptyModel = definition.getEmptyModel()
      for (let key in fields) {
        expect(emptyModel[key]).toBe(null)
      }
      expect(emptyModel['randomProp']).toBe(undefined)
    })
  })

  describe('Layout construction', () => {
    const fields = {
      fieldA: { testOption: 'test' },
      fieldB: { testOption: 'test' },
      fieldC: {
        testOption: 'test',
        validator: {
          locale() {
            return {
              localeExpanded: true,
            }
          },
        },
      },
    }
    const LAYOUT_NAME = 'layout_b'
    const layout = {
      fields: ['fieldA'],
      groups: [{ layout_name: LAYOUT_NAME, fields: ['fieldB'] }],
    }
    const definition = new FormDefinition(fields, layout)
    const expectedLayout = {
      fields: [
        {
          model: 'fieldA',
          id: 'fieldA',
          uid: 'fieldA',
          testOption: 'test',
          validator: null,
        },
      ],
      groups: [
        {
          fields: [
            {
              model: 'fieldB',
              id: 'fieldB',
              uid: 'fieldB',
              testOption: 'test',
              validator: null,
            },
          ],
        },
      ],
    }

    describe('constructLayout function', () => {
      it('should generate vue-form-genrator schema', () => {
        const formGenratorLayout = definition.constructLayout(layout)
        expect(formGenratorLayout.layout).toEqual(expectedLayout)
      })
      it('should return active fields', () => {
        const formGenratorLayout = definition.constructLayout(layout)
        expect(formGenratorLayout.activeFields).toEqual(['fieldA', 'fieldB'])
      })
      it('should expand locale validators', () => {
        const formGenratorLayout = definition.constructLayout({
          fields: ['fieldC'],
        }).layout
        expect(formGenratorLayout.fields[0].validator[0].localeExpanded).toBe(
          true
        )
      })
    })

    describe('getLayout function', () => {
      it('should generate vue-form-generator schema', () => {
        const formGenratorLayout = definition.getFormSchema()
        expect(formGenratorLayout).toEqual(expectedLayout)
      })
    })

    describe('getLayoutByName', () => {
      it('should find the layout component by its tag', () => {
        const layout = definition.getLayoutByName(LAYOUT_NAME)
        expect(layout.layout_name).toEqual(LAYOUT_NAME)
      })
    })
  })
})
