<template>
  <nuxt-link
    v-if="hasItemPermission"
    ref="link"
    :tag="tag"
    :to="getPath(route.routerLinkOps)"
    :event="linkActive()"
    :class="{ 'hasChildren' : hasChildren, 'mainexpanded' : !maincollapsed}"
    :id="route.title"
    class="menulink"
    @click.native="closeMenu"
  >
    <div class="menulink-content">
      <font-awesome-icon
        v-if="route.icon"
        :icon="route.icon"
      />
      <span class="topTitle">{{ $t(route.title) }}</span>
    </div>
    <b-collapse
      v-show="hasChildren"
      :id="route.title"
      :visible="showChild"
      accordion="sidemenu"
      role="tabpanel"
      class="menulink-botmenu"
    >
      <ul>
        <template
          v-for="(child, index) in route.children">
          <nuxt-link
            v-if="checkPermission(child)"
            :key="index"
            :tag="tag"
            :to="getPath(child.routerLinkOps)"
            :id="child.title"
            class="menulink-botmenu-item"
            @click.native="SelectSub"
          >
            <a>{{ $t(child.title) }}</a>
          </nuxt-link>
        </template>
      </ul>
    </b-collapse>

  </nuxt-link>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavigationItem',
  props: {
    route: {
      type: Object,
      default: () => {},
    },
    tag: {
      type: String,
      default: 'li',
    },
    maincollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCollapse: false,
      showChild: false,
      showTitle: false,
    }
  },
  computed: {
    hasChildren() {
      return this.route.children.length > 0
    },
    hasItemPermission() {
      return this.checkPermission(this.route)
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
  },
  watch: {
    maincollapsed: function(newVal, oldVal) {
      this.$nextTick(function() {
        if (this.maincollapsed) {
          this.showTitle = false
        }
        this.showChild = this.maincollapsed
      })
    },
  },
  methods: {
    linkActive() {
      if (this.hasChildren) {
        return ''
      } else {
        return 'click'
      }
    },
    closeMenu() {
      if (!this.maincollapsed) {
        if (this.hasChildren) {
          this.showChild = !this.showChild
          this.showTitle = true
        } else {
          if (this.showChild) {
            this.showTitle = !this.showTitle
          } else {
            this.showTitle = false
            this.showChild = !this.showChild
          }
        }
      }
    },
    checkPermission(item) {
      if (item.not_permission) {
        if (this.hasPermission(item.not_permission)) {
          return false
        }
      }
      if (item.permission) {
        if (Array.isArray(item.permission)) {
          for (const perm of item.permission) {
            if (this.hasPermission(perm)) {
              return true
            }
          }
          return false
        }
        return this.hasPermission(item.permission)
      }
      if (item.checkChildPermission) {
        for (const child of this.route.children) {
          if (this.checkPermission(child)) {
            return true
          }
        }
        return false
      }
      return true
    },
    SelectSub() {
      this.showChild = !this.showChild
    },
    getPath(route) {
      if (route.name) {
        return this.localePath(route)
      }
      return route
    },
  },
}
</script>

<style lang="scss" scoped>
$colNav: 43px;
$icon: 1.25rem;
$menu: 259px;
$fontSizeSubmenu: 0.75rem;
.nav-link {
  a {
    text-decoration: none;
  }
}
.topTitle {
  white-space: nowrap;
}
.menulink {
  font-family: 'Nunito Sans', sans-serif;
  cursor: pointer;
  overflow: hidden;
  letter-spacing: 1px;
  width: $menu;
  $colNavCompress: $colNav - 1px;
  max-width: $colNav;
  font-size: 0.85rem;
  position: relative;
  padding: 1.125rem 2.5rem 1.125rem 1.3rem;
  padding: 0.75rem 1.75rem 0.75rem 0.8125rem;
  .svg-inline--fa {
    margin: auto 0;
    display: block;
    color: $gray-700;
  }
  &-content {
    position: relative;
    .svg-inline--fa {
      color: inherit;
    }
    display: flex;
    width: 100%;
    .topTitle {
      text-transform: uppercase;
      position: relative;
      color: $black;
      opacity: 0;
      padding-left: 1.75rem;
    }
  }
  &.showTitle,
  &:hover:not(.mainCollapsed) {
    max-width: $menu;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    overflow: visible;
    @extend .bgPrimaryGradient;
    .menulink-content {
      color: $white;
      min-width: 20px;
      opacity: 0.9;
      .topTitle {
        opacity: 1;
        color: $white;
      }
    }
  }
}

//has children
.menulink.hasChildren {
  &:hover:not(.mainexpanded) {
    border-bottom-right-radius: 0;
    .menulink-botmenu {
      display: block !important;
      border-bottom-right-radius: 0.5rem;
    }
  }
  .menulink-botmenu {
    display: none;
    position: absolute;
    z-index: 1;
    top: 2.75rem;
    left: 0;
    width: $menu;
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      background-color: $white;
      overflow: hidden;
    }
    &-item {
      position: relative;
      // width: $menu - $colNav;
      font-size: $fontSizeSubmenu;
      // font-weight: 900;
      display: flex;
      align-items: center;
      &.nuxt-link-active {
        font-weight: 600;
        color: $black;
      }
      &:hover {
        @extend .bgPrimaryGradient;
        color: $white;
        opacity: 0.8;
      }
      &.nuxt-link-active:hover {
        opacity: 0.9;
      }
      a {
        white-space: nowrap;
        &:before {
          content: '-';
          margin-right: 1rem;
        }
        left: 0;
        top: 0;

        width: 100%;
        height: 100%;
        padding: 0.35em 25px;
        padding-left: 50px;
        height: 100%;
        letter-spacing: 1px;
        color: inherit;
      }
    }
  }
  &.showTitle {
    border-bottom-right-radius: 0;
  }
}

//is active
.menulink.nuxt-link-active {
  @extend .bgPrimaryGradient;
  .menulink {
    &-content {
      color: $white;
      .topTitle {
        color: $white;
        opacity: 1;
        font-weight: 600;
      }
    }
    &-botmenu {
      color: $dark;
    }
  }
  &:not(.hasChildren) {
    overflow: hidden;
    &.showTitle {
      overflow: visible;
    }
  }
  &.showTitle {
    width: $colNav;
  }
  // &.hasChildren {
  //   max-width: $menu;
  // }
}
.menulink:not(.mainexpanded) {
  .menulink-botmenu.collapse.show {
    box-shadow: 2px 2px 6px 1px rgba($dark, 0.2);
    border-bottom-right-radius: 0.5rem;
    ul {
      border-bottom-right-radius: 0.5rem;
    }
  }
}
//mainmenu expanded/displayed
.menulink.mainexpanded {
  width: $menu;
  max-width: $menu;
  border-radius: 0 !important;
  .menulink {
    border-bottom-right-radius: 0;
    &-content {
      // width: 254px;
      .topTitle {
        opacity: 1;
      }
    }
    &-botmenu {
      position: relative;
      top: 1.125rem;
      left: -1.45rem;
      width: $menu;
      ul {
        border-left: none;
        border-right: none;
      }
      &-item {
        width: unset;
        position: relative;
      }

      &.collapse.show {
        box-shadow: none;
      }
    }
  }
  &.hasChildren {
    .menulink-botmenu {
      display: block !important;
    }
    .menulink-content:after {
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      content: '\f054';
      position: absolute;
      top: 1.5em;
      right: -1rem;
      font-size: 0.5em;
      transform: translateY(-50%);
    }
    &.showTitle {
      .menulink-content:after {
        transform: translateY(-50%) rotate(90deg);
      }
    }
  }
}
</style>
