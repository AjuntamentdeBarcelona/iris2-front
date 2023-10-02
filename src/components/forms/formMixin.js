import { isResponseClass, isPlainObject } from '~/assets/js/helpers'
import { ALL_ERROR } from '~/assets/js/iris2/constants'
import _ from 'lodash'

/**
 * Mixin that implements useful and common form utils and behaviour
 */
export default {
  methods: {
    /**
     * Normalize response error
     * @param {Object} error Axios enhanced Error object containing as response, a Django Rest Framework Response object
     * @returns {Object} An object with the errors. Errors being:
     *  If it was a 400:
     *  -the response.data object errors if it was an object with errors
     *  -the response.data string on an object with a generic key if it was a String with errors (and not an html page)
     *  In other cases:
     *  -a generic error with a generic key if it didn't met any of the above conditions
     */
    normalizeErrorResponseData(error) {
      if (isResponseClass(error.response.status, 400)) {
        if (
          isPlainObject(error.response.data) &&
          Object.keys(error.response.data).length
        ) {
          // Object
          return error.response.data
        } else if (
          _.isString(error.response.data) &&
          error.response.data !== '' &&
          !/<html/i.test(error.response.data)
        ) {
          // String
          return { [ALL_ERROR]: error.response.data }
        }
      }

      // Nothing
      return { [ALL_ERROR]: this.$t('delete_error_generic') }
    },
  },
}
