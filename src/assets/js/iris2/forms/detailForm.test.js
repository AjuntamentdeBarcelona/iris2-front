import detailFormDefinition from './detailForm.js'

describe('Detail form definition', () => {
  const model = {
    element: {
      id: 2000,
      description: 'Test',
      area: {
        id: 1,
        description: 'test',
      },
    },
  }
  it('should return form generator schema', () => {
    const schema = detailFormDefinition.getFormSchema()
    expect(schema).toBeTruthy()
  })
  describe('Area field', () => {
    const areaField = detailFormDefinition.fields.area_id
    it('should return initial option from area', () => {
      const initial = areaField.getInitialOption(model)
      expect(initial).toEqual(model.element.area)
    })
    it('should return none when there is no area', () => {
      const initial = areaField.getInitialOption({ element: {} })
      expect(initial).toBeNull()
    })
    it('should return none when there is no element', () => {
      const initial = areaField.getInitialOption({})
      expect(initial).toBeNull()
    })
  })
  describe('Element field', () => {
    const areaField = detailFormDefinition.fields.element_id
    it('should return initial option from element', () => {
      const initial = areaField.getInitialOption(model)
      expect(initial).toEqual(model.element)
    })
    it('should return none when there is no element', () => {
      const initial = areaField.getInitialOption({})
      expect(initial).toBeNull()
    })
  })
})
