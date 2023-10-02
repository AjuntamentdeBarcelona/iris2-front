import * as Schema from './Schema.js'

describe('Schema module, utils for working with schemas', () => {
  describe('getFieldsFromSchema', () => {
    it('Should get fields with list of fields schema', () => {
      const schema = [{ model: 'a' }, { model: 'b' }]
      expect(Schema.getFieldsFromSchema(schema)).toEqual(schema)
    })
    it('Should get fields with only fields schema', () => {
      const schema = { fields: [{ model: 'a' }, { model: 'b' }] }
      expect(Schema.getFieldsFromSchema(schema)).toEqual(schema.fields)
    })
    it('Should get fields with flat group list', () => {
      const schema = {
        groups: [{ fields: [{ model: 'a' }] }, { fields: [{ model: 'b' }] }],
      }

      expect(Schema.getFieldsFromSchema(schema)).toEqual([
        { model: 'a' },
        { model: 'b' },
      ])
    })
    it('Should get fields with nested groups', () => {
      const schema = {
        groups: [
          { groups: [{ fields: [{ model: 'a' }] }] },
          { fields: [{ model: 'b' }] },
        ],
      }

      expect(Schema.getFieldsFromSchema(schema)).toEqual([
        { model: 'a' },
        { model: 'b' },
      ])
    })
  })
})
