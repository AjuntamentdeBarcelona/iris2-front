<template>
  <backoffice>
    <div
      slot="before-content">
      <horizontal-nav
        :routes="navigation"
        :active-sub-menus="true"
        :sub-menu-active-function="subMenuActiveFunction"
      />
    </div>
  </backoffice>
</template>


<script>
import Backoffice from './backoffice.vue'
import HorizontalNav from '~/components/layout/navigation/HorizontalNav.vue'

export default {
  name: 'Masters',
  components: {
    Backoffice,
    HorizontalNav,
  },
  data() {
    return {
      navigation: this.getNavigation(),
      rootRoute: 'backoffice-admin-masters-type',
    }
  },
  methods: {
    getNavigation() {
      return [
        {
          title: 'navigation_cancel_reasons',
          routerLinkOps: {
            name: 'backoffice-admin-masters-type',
            params: {
              type: 'cancel-reasons',
            },
          },
          children: [],
        },
        {
          title: 'navigation_reassignation_reasons',
          routerLinkOps: {
            name: 'backoffice-admin-masters-type',
            params: {
              type: 'reasign-reasons',
            },
          },
          children: [],
        },
        {
          title: 'navigation_resolution_types',
          routerLinkOps: {
            name: 'backoffice-admin-masters-type',
            params: {
              type: 'resolution-types',
            },
          },
          children: [],
        },
        {
          title: 'navigation_edit_districts',
          routerLinkOps: {
            name: 'backoffice-admin-masters-districts',
          },
          children: [],
        },
      ]
    },
    subMenuActiveFunction(route) {
      if (this.$route.params.type) {
        if (
          route.routerLinkOps.params &&
          this.$route.params.type === route.routerLinkOps.params.type
        ) {
          return true
        }
      } else if (this.$route.name.indexOf(route.routerLinkOps.name) !== -1) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
