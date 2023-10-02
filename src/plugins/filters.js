import Vue from 'vue'
import { date, dateTime, def, truncate, pad } from '~/assets/js/helpers'

Vue.filter('date', (value, yearFormat) => {
  try {
    return date(value, yearFormat)
  } catch (e) {
    return ''
  }
})
Vue.filter('dateTime', value => dateTime(value))
Vue.filter('pad', pad)
Vue.filter('def', value => def(value))
Vue.filter('truncate', (value, length, ellipsis) =>
  truncate(value, length, ellipsis)
)
Vue.filter('formatSize', size => {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
})
