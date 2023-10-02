import moment from 'moment'

export default {
  getDateValidator(errorMessage) {
    return function(value) {
      const result = moment(value, 'DD-MM-YYYY')
      if (!result.isValid()) {
        return errorMessage
      }
    }
  },
  getHourValidator(errorMessage) {
    return function(value) {
      const result = moment(value, 'H:m')
      if (!result.isValid() || value.split(':')[0] == '24') {
        return errorMessage
      }
    }
  },
}
