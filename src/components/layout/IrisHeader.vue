<template>
  <header
    class="main-header" >


    <div class="header-left">
      <div
        v-if="mobile"
        class="my-auto text-uppercase mr-4 back">
        <nuxt-link :to="localePath({name: 'backoffice-mobile-app-dashboard', params: {app: $route.params.app}})">
          <font-awesome-icon
            icon="chevron-left"
            class="mr-2"/> {{ $t('go_back') }}
        </nuxt-link>
      </div>
      <div
        :class="{active: !collapsed}"
        class="logo">
        <badged class="logo-escut"/>
        <div class="logo-namebox">
          <logo-name class="logo-name"/>
          <h1 class="maintitle">
            <b class="font-weight-bold">IRIS2C</b>
          </h1>
        </div>
      </div>

    </div>
    <div class="header-right">
      <LanguageSelector />
      <group-selector v-if="!mobile" />
      <div class="input-group">
        <input
          id="inlineFormInputGroup"
          type="text"
          placeholder="search">
        <div class="input-group-after">
          <div class="input-group-search"><i class="fas fa-search"/></div>
        </div>
      </div>
      <logout />
    </div>
  </header>
</template>

<script>
import Logo from '~/components/layout/Logo.vue'
import Logout from '~/components/layout/Logout.vue'
import Badged from '~/components/icons/Badged.vue'
import LogoName from '~/components/icons/logoName.vue'
import GroupSelector from '~/components/iris-pages/groups/GroupSelector.vue'
import LanguageSelector from '~/components/utils/LanguageSelector.vue'

export default {
  components: {
    Logo,
    Badged,
    LogoName,
    Logout,
    GroupSelector,
    LanguageSelector,
  },
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.logo {
  display: flex;
  position: relative;
  $logoSize: 30px;
  border-radius: $logoSize;
  width: $logoSize * 1.25 + 120px;
  max-width: $logoSize * 1.25;
  transition: max-width 0.75s ease-out;
  &-escut {
    position: relative;
    z-index: 3;
    height: $logoSize * 1.25;
    width: $logoSize * 1.25;

    // background: $red;
    // background coruña
    background: #009fe3;
    fill: $white;
    border-radius: $logoSize;
    padding: $logoSize/5;
  }
  &-namebox {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: $logoSize * 0.75;
    z-index: 2;
    display: flex;
    justify-content: center;
  }
  &-name {
    position: relative;
    background-color: $black;
    height: $logoSize * 1.25;
    // padding: $logoSize/5;
    padding: $logoSize/6;
    padding-left: $logoSize/1.5;
    padding-right: $logoSize/3;
    fill: $white;
    border-radius: 0 $logoSize $logoSize 0;
    transition: 0.7s ease;
    transform: translateX(-100%);
  }
  .maintitle {
    // line-height: 70px;
    padding-right: 150px;
    font-size: 1.5rem;
    transition: 0.7s ease;
    transform: translateX(-100px + $logoSize);
  }
  &.active {
    max-width: 250px;
    .logo-name {
      transform: translateX(0);
    }
    .maintitle {
      transform: translateX(25px);
    }
  }
}

.header-left {
  .back {
    .nuxt-link-exact-active {
      display: none;
    }
  }
}

.header-right {
  color: $white;
  display: flex;
  align-items: center;
  span {
    margin-right: 1rem;
  }
  .input-group {
    display: none;
    padding-left: 1.5rem;
    padding-right: 1rem;
    font-size: 0.9rem;
    #inlineFormInputGroup {
      width: 270px;
      padding: 0.2rem;
      transition: max-width 0.4s ease-out;
      max-width: 100px;
      &:focus {
        max-width: 270px;
      }
    }
    .input-group-after {
      pointer-events: none;
      color: $dark;
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
