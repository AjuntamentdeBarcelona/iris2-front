// ~/plugins/i18n.js
import moment from 'moment'

import { setFormLocale } from '~/assets/js/forms/formLocale.js'

export default function({ $axios, $i18n, app }) {
  setFormLocale(app)
  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    $axios.setHeader('Accept-Language', newLocale, [
      'post',
      'get',
      'put',
      'patch',
      'delete',
    ])
  }
  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    setFormLocale(app)
    moment.locale(newLocale)
  }
  $axios.setHeader('Accept-Language', app.i18n.locale, [
    'post',
    'get',
    'put',
    'patch',
    'delete',
  ])
}
