import { setFormLocale } from './formLocale.js'

describe('Form locale', () => {
  it('should add locale messages to forms', () => {
    const test = 'TEST_MSG'
    let validators = setFormLocale({
      i18n: {
        t() {
          return test
        },
      },
    })
    for (let validator in validators) {
      expect(validators[validator].locale.translated).toBe(true)
    }
  })
})
