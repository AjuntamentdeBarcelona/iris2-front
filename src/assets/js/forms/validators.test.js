import validators from './validators.js'

describe('Validators Library', () => {
  describe('Date validator', () => {
    const TEST_MSG = 'invalid'
    const validator = validators.getDateValidator(TEST_MSG)
    it('should return no message with valid date', () => {
      expect(validator('22/02/2021')).toBe(undefined)
    })
    it('should return invalid day', () => {
      expect(validator('31/04/2021')).toBe(TEST_MSG)
    })
    it('should return invalid month', () => {
      expect(validator('31/22/2021')).toBe(TEST_MSG)
    })
    it('should return invalid (invalid leap year)', () => {
      expect(validator('29/02/2021')).toBe(TEST_MSG)
    })
  })
  describe('Hour validator', () => {
    const TEST_MSG = 'invalid'
    const validator = validators.getHourValidator(TEST_MSG)
    it('should return no message with valid date', () => {
      expect(validator('23:55')).toBe(undefined)
    })
    it('should return invalid day', () => {
      expect(validator('24:00')).toBe(TEST_MSG)
    })
    it('should return invalid month', () => {
      expect(validator('23:75')).toBe(TEST_MSG)
    })
    it('should return invalid (invalid leap year)', () => {
      expect(validator('00:75')).toBe(TEST_MSG)
    })
  })
})
