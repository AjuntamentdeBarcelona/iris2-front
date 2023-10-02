import { validators } from 'vue-form-generator'
import { isString, defaults } from 'lodash'

export function setFormLocale(app) {
  const formLocale = {
    fieldIsRequired: app.i18n.t('required'),
    invalidFormat: app.i18n.t('invalid_format'),

    numberTooSmall: app.i18n.t('numberTooSmall'),
    numberTooBig: app.i18n.t('numberTooBig'),
    invalidNumber: app.i18n.t('invalidNumber'),
    invalidInteger: app.i18n.t('invalidInteger'),

    textTooSmall: app.i18n.t('textTooSmall'),
    textTooBig: app.i18n.t('textTooBig'),
    thisNotText: app.i18n.t('thisNotText'),

    thisNotArray: app.i18n.t('thisNotArray'),

    selectMinItems: app.i18n.t('selectMinItems'),
    selectMaxItems: app.i18n.t('selectMaxItems'),

    invalidDate: app.i18n.t('invalidDate'),
    dateIsEarly: app.i18n.t('dateIsEarly'),
    dateIsLate: app.i18n.t('dateIsLate'),

    dateMinIsToday: app.i18n.t('dateMinIsToday'),

    invalidEmail: app.i18n.t('invalidEmail'),
    invalidURL: app.i18n.t('invalidURL'),

    invalidCard: app.i18n.t('invalidCard'),
    invalidCardNumber: app.i18n.t('invalidCardNumber'),

    invalidTextContainNumber: app.i18n.t('invalidTextContainNumber'),
    invalidTextContainSpec: app.i18n.t('invalidTextContainSpec'),
  }

  Object.keys(validators).forEach(key => {
    const fn = validators[key]
    if (key === 'string') {
      fn.locale = customMessages => (value, field, model) => {
        return fn(
          isString(value) ? value.replace(/\s/g, '') : value,
          field,
          model,
          defaults(customMessages, formLocale)
        )
      }
    } else {
      fn.locale = customMessages => (value, field, model) => {
        return fn(value, field, model, defaults(customMessages, formLocale))
      }
    }
    fn.locale.translated = true
  })
  return validators
}
