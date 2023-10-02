<script>
import NestedNav from '~/components/pages/NestedNav.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'Access',
  layout: 'backoffice',
  extends: NestedNav,
  methods: {
    getNavigation() {
      return [
        {
          title: 'navigation_groups',
          routerLinkOps: {
            name: 'backoffice-admin-access-groups',
          },
          children: [],
          permission: Permissions.APP.ADMIN,
        },
        {
          title: 'navigation_profiles',
          routerLinkOps: {
            name: 'backoffice-admin-access-profiles',
          },
          children: [],
          permission: Permissions.APP.ADMIN,
        },
        {
          title: 'navigation_users',
          routerLinkOps: {
            name: 'backoffice-admin-access-users',
          },
          children: [],
          permission: Permissions.APP.ADMIN_USERS,
        },
        {
          title: 'navigation_internal_operator',
          routerLinkOps: {
            name: 'backoffice-admin-access-operators',
          },
          children: [],
          permission: Permissions.APP.ADMIN_USERS,
        },
      ]
    },
  },
}
</script>
