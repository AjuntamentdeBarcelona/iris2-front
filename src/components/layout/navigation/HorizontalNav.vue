<template>
  <ul
    :class="navClasses"
    class="nav component-horizontal-nav">
    <template
      :tag="itemTag"
      class="nav-item">
      <nuxt-link
        v-for="(route, index) in visibleRoutes"
        :key="index"
        :to="localePath(route.routerLinkOps)"
        :class="{'active': subMenuIsActive(route)}"
        :active-class="activeClass"
        exact-active-class="active"
        tag="a"
        class="nav-link"
      >
        {{ $t(route.title) }}
      </nuxt-link>
    </template>
  </ul>
</template>



<script>
import NavigationItem from './NavigationItem.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'HorizontalNav',
  components: {
    NavigationItem,
  },
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    navType: {
      type: String,
      default: 'pills',
    },
    itemTag: {
      type: String,
      default: 'li',
    },
    activeSubMenus: {
      type: Boolean,
      default: false,
    },
    subMenuActiveFunction: {
      type: Function,
      default: () => {},
    },
    activeClass: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    navClasses() {
      return 'nav-' + this.navType
    },
    visibleRoutes() {
      return this.routes.filter(item => {
        if (!item.permission) {
          return true
        }
        return this.hasPermission(item.permission)
      })
    },
    ...mapGetters('groups', ['hasPermission']),
  },
  methods: {
    subMenuIsActive(route) {
      if (this.activeSubMenus) {
        if (this.subMenuActiveFunction(route)) {
          return true
        }
      }
      return false
    },
  },
}
</script>

<style>
.component-horizontal-nav {
  margin-bottom: 10px;
}
</style>
