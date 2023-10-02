<template>
  <nav
    :class="{'show': !collapse}"
    class="border-right bg-white main-menu"
  >
    <ul id="navigation-side-menu">
      <li
        class="nav-link burger"
        role="button"
        @click="toggle()"
      >
        <font-awesome-icon :icon="['fa', 'bars']" />
      </li>
      <navigation-item
        v-for="(route, index) in orderAdminFirst"
        :key="index"
        :route="route"
        :maincollapsed="collapse"
        :show-child="false"
        class="nav-link"
      />
    </ul>
  </nav>
</template>

<script>
import NavigationItem from './NavigationItem.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
    NavigationItem,
  },
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    maxWidth: {
      type: Number,
      default: 300,
    },
    collapsedWidth: {
      type: Number,
      default: 50,
    },
  },
  computed: {
    orderAdminFirst: function() {
      let routes = this.routes
      return routes
      // return this.routes
      var indexAdmin = this.routes
        .map(function(el) {
          return el.title
        })
        .indexOf('navigation_admin')
      let cutOut = routes.splice(indexAdmin, 1)[0] // cut the element at index 'from'
      if (cutOut) {
        routes.splice(1, 0, cutOut)
        return routes
      }
      return []
      // return index
    },
    ...mapState('navigation', ['collapse']),
  },
  methods: {
    ...mapMutations('navigation', ['setCollapsed']),
    toggle: function() {
      this.setCollapsed(!this.collapse)
      this.$emit('collapsed', this.collapse)
    },
  },
}
</script>

<style lang="scss">
@import 'navigation';

$columnNav: 44px;

$iconSize: 1.25rem;
.menuTransition {
  transition: 0.3s linear;
}
.main-menu {
  font-family: 'Source Sans Pro', sans-serif;
  color: $dark;
  @extend .menuTransition;
  display: relative;
  z-index: 1000;
  max-width: $columnNav;
  width: 300px;
  height: auto;
  ul {
    margin: 0;
    padding: 0;
    position: sticky;
    top: 0;
  }
  .svg-inline--fa {
    font-size: $iconSize;
    width: $iconSize;
    position: relative;
    z-index: 10;
  }
  .nav-link {
    cursor: pointer;
    &.burger {
      color: $black;
      position: relative;
      width: $columnNav - 2px;
      margin-top: 1rem;
      margin-bottom: 1rem;
      margin-left: 0;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: center;
    }
  }
  &.show {
    @extend .menuTransition;
    max-width: 251px;
    .nav-link:not(.burger) {
      width: 250px;
    }
  }
}
</style>
