import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    /**
     * Codename of the permission required for using this component.
     */
    permission: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      authorizationError: false,
    }
  },
  computed: {
    ...mapGetters('groups', { hasPagePermission: 'hasPermission' }),
    computedPermission() {
      return this.permission
    },
    /**
     * True if the user is authorized to use the component.
     */
    isAuthorized() {
      return this.hasPermission && !this.authorizationError
    },
    /**
     * True if the user has permission to use the component, according to the initial list of permissions.
     */
    hasPermission() {
      if (this.computedPermission) {
        return this.hasPagePermission(this.computedPermission)
      }
      return true
    },
  },
  methods: {
    ...mapActions('groups', { reloadPermissions: 'reloadPermissions' }),
    /**
     * If a request is send and the result is Unauthorized, an error must be displayed and the permissions must be reloaded.
     */
    onUnauthorized() {
      this.authorizationError = true
      this.reloadPermissions()
      this.showAuthorizationError()
    },
    /**
     * Displays an authorization error when trying to perform an action.
     * By default tries to show the AuthorizationError component, finding it on the $refs as authorizationError.
     */
    showAuthorizationError() {
      if (this.$refs.authorizationError) {
        this.$refs.authorizationError.open()
      }
    },
  },
}
