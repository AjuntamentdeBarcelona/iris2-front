import SchemaUtils from './SchemaUtils'

describe('IRIS2 Schema Utils', () => {
  describe('getDescription', () => {
    const fieldName = 'test'
    const testLength = 10000
    const testLabel = 'testLabeltest'
    describe('Generated schema', () => {
      it('should be a valid text schema', () => {
        const d = SchemaUtils.getDescription(
          testLength,
          null,
          testLabel,
          fieldName
        )
        expect(d[fieldName].type).toEqual('input')
        expect(d[fieldName].inputType).toEqual('text')
        expect(d[fieldName].maxlength).toEqual(testLength)
        expect(d[fieldName].label).toEqual(testLabel)
        expect(d[fieldName].validator.length).toBeTruthy()
      })
    })
    describe('Language utility', () => {
      it('Should return the requested langs', () => {
        const langs = ['es', 'en', 'de']
        const d = SchemaUtils.getDescription(
          testLength,
          langs,
          testLabel,
          fieldName
        )
        for (let lang of langs) {
          expect(d[`${fieldName}_${lang}`]).toBeTruthy()
        }
      })
      it('Should return a valid field without lang', () => {
        const d = SchemaUtils.getDescription(
          testLength,
          null,
          testLabel,
          fieldName
        )
        expect(d[fieldName]).toBeTruthy()
      })
    })
    it('Should place default model name as description', () => {
      const d = SchemaUtils.getDescription(testLength, null, testLabel)
      expect(d.description).toBeTruthy()
    })
    it('Should override values as requested', () => {
      const newMax = 1
      const d = SchemaUtils.getDescription(
        testLength,
        null,
        testLabel,
        fieldName,
        { maxlength: newMax }
      )
      expect(d[fieldName].maxlength).toEqual(newMax)
    })
  })
})
