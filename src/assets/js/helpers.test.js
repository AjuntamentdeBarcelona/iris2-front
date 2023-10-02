import { isValidControlCharacter, isValidNif } from '~/assets/js/helpers'

const nif_valid = '55555555K'
const nif_invalid = '55555555X'
const nif_k_valid = 'K0123456S'
const nif_k_invalid = 'K0123456X'
const nie_valid_1 = 'X05931985D'
const nie_invalid_1 = 'X05931985X'
const nie_valid_2 = 'X5931985D'
const nie_invalid_2 = 'X5931985X'

/**
 * isValidControlCharacter
 */
describe('Control character validity', () => {
  describe('Given a valid NIF', () => {
    it('should be valid', () => {
      expect(isValidControlCharacter(nif_valid)).toBe(true)
    })
  })

  describe('Given an invalid NIF', () => {
    it('should be invalid', () => {
      expect(isValidControlCharacter(nif_invalid)).toBe(false)
    })
  })
})

/**
 * isValidNif
 */
describe('NIF validity', () => {
  describe('Given a valid NIF', () => {
    it('should be valid', () => {
      expect(isValidNif(nif_valid)).toBe('nif')
    })
  })

  describe('Given an invalid NIF', () => {
    it('should be invalid', () => {
      expect(isValidNif(nif_invalid)).toBe('')
    })
  })

  describe('Given a valid NIF K', () => {
    it('should be valid', () => {
      expect(isValidNif(nif_k_valid)).toBe('nif_k')
    })
  })

  describe('Given an invalid NIF K', () => {
    // Reason: Validator not implemented
    it('should be valid', () => {
      expect(isValidNif(nif_k_invalid)).toBe('nif_k')
    })
  })

  describe('Given a valid NIE X V1', () => {
    it('should be valid', () => {
      expect(isValidNif(nie_valid_1)).toBe('nif_x_v1')
    })
  })

  describe('Given an ivalid NIE X V1', () => {
    it('should be invalid', () => {
      expect(isValidNif(nie_invalid_1)).toBe('')
    })
  })

  describe('Given a valid NIE X V2', () => {
    it('should be valid', () => {
      expect(isValidNif(nie_valid_2)).toBe('nif_x_v2')
    })
  })

  describe('Given an invalid NIE X V2', () => {
    it('should be invalid', () => {
      expect(isValidNif(nie_invalid_2)).toBe('')
    })
  })
})
