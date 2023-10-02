<template>
  <backoffice>
    <div
      slot="before-content">
      <horizontal-nav 
        :routes="navigation" 
        :active-sub-menus="true"
        :sub-menu-active-function="subMenuActiveFunction" />
    </div>
  </backoffice>
</template>


<script>
import Backoffice from './backoffice.vue'
import HorizontalNav from '~/components/layout/navigation/HorizontalNav.vue'

export default {
  name: 'Tasks',
  components: {
    Backoffice,
    HorizontalNav,
  },
  data() {
    return {
      navigation: this.getNavigation(),
    }
  },
  methods: {
    getNavigation() {
      return [
        {
          title: 'record_card_my_tasks',
          icon: 'life-ring',
          children: [],
          routerLinkOps: {
            name: 'backoffice-tasks-progress',
          },
        },
        {
          title: 'record_card_pending_validation',
          icon: 'life-ring',
          children: [],
          routerLinkOps: {
            name: 'backoffice-tasks',
          },
        },
      ]
    },
    subMenuActiveFunction(route) {
      if (this.$route.name.split('__')[0] == route.routerLinkOps.name) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
