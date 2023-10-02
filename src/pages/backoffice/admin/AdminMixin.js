import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  props: {
    permission: {
      type: String,
      default: Permissions.APP.ADMIN,
    },
  },
}
