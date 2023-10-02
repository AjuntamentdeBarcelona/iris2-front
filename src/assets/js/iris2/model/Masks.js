import { validators } from 'vue-form-generator'
import customValidators from '~/assets/js/forms/validators.js'

export const ANY = 1,
  ONLY_ALPHABET = 2,
  NUMBER = 3,
  POSITIVE_INTEGER = 4, // 4 NOMBRE ENTER POSITIU
  TELEPHONE = 5, // 5 NOMBRE DE TELÈFON (9 DÍGITS)
  POSTAL_CODE = 6, // 6 CODI POSTAL (5 DÍGITS)
  DATE = 7, // 7 DATA EN FORMAT DD/MM/YYYY
  TIME = 8 // 8 DATA EN FORMAT HH:MM

/**
 * The Mask class allows to control the values of a given text input.
 * A mask is composed by an ID (iris2 ID), a regexp and a description
 * for helping the user.
 */
export class Mask {
  /**
   * @param {Number} id
   * @param {RegExp} regexp
   * @param {String} maskDescription
   * @param {String} errorText
   * @param {String} inputType Valid HTML input type: text, number, date, etc
   * @param {String} validator Additional validation function
   */
  constructor(
    id,
    regexp,
    maskDescription,
    errorText,
    inputType,
    validator,
    extraErrorText,
    autoformat
  ) {
    if (_.isObject(arguments[0])) {
      Object.assign(this, arguments[0])
    } else {
      this.id = id
      this.regexp = regexp
      this.maskDescription = maskDescription
      this.errorText = errorText
      this.extraErrorText = extraErrorText
      this.inputType = inputType
      this.validator = validator
      this.autoformat = autoformat
    }
  }
  /**
   * Validates a given value with the mask.
   * @param {*} value
   * @return {Boolean} True if valid
   */
  validate(value) {
    if (this.regexp && !this.regexp.test(value)) {
      return false
    }
    if (this.validator) {
      return this.validator('error')(value) == null
    }
    return true
  }
}

/**
 * Transforms a mask into a valid form generator Schema.
 * This schema only refers to the type and validations for the object, the additional
 * information like field name or labels belong to the Features, so the returned object
 * must be extended with these additional options.
 *
 * @param {Mask} mask
 * @param {Object} trans Object with a $t property for translating strings
 * @param {function} trans.$t Function for translating the string
 * @return {Object} Valid VueFormGenerator Schema object
 */
Mask.toFormGeneratorSchema = function(mask, trans) {
  if (!mask || !mask.regexp) {
    return {}
  }
  trans = trans || { $t: value => value }
  return {
    type: 'input',
    inputType: mask.inputType || 'text',
    pattern: mask.regexp.source,
    placeholder: mask.maskDescription,
    validator: [Mask.getFormGeneratorValidators(mask, trans)],
  }
}

/**
 *  *
 * @param {Mask} mask
 * @param {Object} trans Object with a $t property for translating strings
 * @param {function} trans.$t Function for translating the string
 * @return {function|Array} VueFormGenerator validators for the given masks
 */
Mask.getFormGeneratorValidators = function(mask, trans) {
  const regexpValidator = validators.regexp.locale({
    invalidFormat: trans.$t(mask.errorText),
    fieldIsRequired: trans.$t('mask_field_is_required'),
  })
  if (mask.validator) {
    const extraValidator = mask.validator(trans.$t(mask.extraErrorText))
    return function(value, field, model, messages) {
      return (
        regexpValidator(value, field, model, messages) || extraValidator(value)
      )
    }
  }
  return regexpValidator
}

/**
 * @returns {Boolean} True if the mask id allows partial search on filters
 * (numbers and integers won't allow, since they are indexed as text)
 */
export function maskAllowsPartialSearch(maskId) {
  return maskId != NUMBER && maskId != POSITIVE_INTEGER
}

/**
 * @returns {Object} Returns a lists of all the default masks of the system mapped by ID.
 */
export function getMasks() {
  return {
    [ONLY_ALPHABET]: new Mask(ONLY_ALPHABET, /^(\D)+$/, '', 'mask_only_words'),
    [NUMBER]: new Mask({
      id: NUMBER,
      regexp: /^([+|-]?)(\d*)(([\.,]?\d+)|(\d*))$/,
      maskDescription: '',
      errorText: 'mask_only_numbers',
      inputType: 'number',
    }),
    [POSITIVE_INTEGER]: new Mask({
      id: POSITIVE_INTEGER,
      regexp: /^(\+)?([0-9])+$/,
      maskDescription: '',
      errorText: 'mask_only_positive',
    }),
    [TELEPHONE]: new Mask({
      id: TELEPHONE,
      regexp: /^([0-9]){9}$/,
      maskDescription: '',
      errorText: 'mask_only_telephone',
    }),
    [POSTAL_CODE]: new Mask({
      id: POSTAL_CODE,
      regexp: /^([0-9]){5}$/,
      maskDescription: '',
      errorText: 'mask_only_postal_code',
    }),
    [DATE]: new Mask({
      id: DATE,
      regexp: /^(\d){2}\/(\d){2}\/(\d){4}$/,
      maskDescription: '',
      autoformat: 'DD/MM/YYYY',
      errorText: 'mask_only_date',
      extraErrorText: 'invalid_date',
      validator: customValidators.getDateValidator,
    }),
    [TIME]: new Mask({
      id: TIME,
      regexp: /^(\d){2}:(\d){2}$/,
      maskDescription: '',
      autoformat: 'HH:mm',
      errorText: 'mask_only_time',
      extraErrorText: 'invalid_time',
      validator: customValidators.getHourValidator,
    }),
  }
}
