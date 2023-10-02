<template>
  <div class="bg-white">
    <mobile-header/>
    <!-- PERSONAL -->
    <!-- CONTAINER light -->
    <div class="text-dark bg-light px-2 py-1">
      <!-- content for every element -->
      <div class="text-uppercase">DNI 4679212Y</div>
    </div>
    <!-- CONTAINER default -->
    <div class="text-dark px-2 py-1">
      <!-- content for every element -->
      <div class="font-weight-bolder text-dark"> Marla Granda Guinea</div>
      <div class="text-uppercase">DnI 4679212Y</div>
    </div>
    <!-- END PERSONAL -->
    <!-- success -->
    <div class="text-primary text-center p-2">
      <div class="d-flex">
        <div class="proces-succes">
          <font-awesome-icon
            :icon="['fas', 'check']"/>
        </div>
      </div>
      <div class="h3 mb-1">
        fitxa creada amb èxit
      </div>
      <div class="font-weight-bolder h2 text-uppercase">
        oyk5864
      </div>
      <button
        type="button"
        class="btn btn-primary btn-lg btn-block mt-4">
        <font-awesome-icon icon="sign-out-alt" />
        Tancar i continuar</button>
    </div>
    <!-- END success -->
    <!-- MENU -->
    <menu-list/>
    <!-- END MENU -->
    <header class="contentwrapper__header">
      <h1 class="title-line">{{ $t('dashboard_title') }}</h1>
    </header>

    <div
      v-if="groupHasChildren"
      class="row"
    >
      <!-- Ambit month activity -->
      <div class="col-12 col-lg-6 mb-3">
        <div class="irisbox h-100 p-0 m-0 overflow-hidden">
          <header
            class="management-header fixed-header text-uppercase"
          >
            {{ $t('ambit_indicators') }}
          </header>

          <ambit-indicators />

        </div>
      </div>
      <!-- Group month activity doughnut -->
      <div class="col-12 col-lg-6 mb-3">
        <div class="irisbox h-100 p-0 m-0 d-flex flex-column">
          <header
            class="management-header fixed-header text-uppercase d-flex justify-content-between align-items-baseline"
          >
            {{ $t('ambit_month_activity') }}
            <date-selector @value-updated="updateAmbitMonthDate"/>
          </header>
          <ambit-month-activity
            v-if="ambitMonthDate"
            :date="ambitMonthDate"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Group month activity -->
      <div class="management col-12 col-lg-6 mb-3">
        <detail
          url="/api/record_cards/record_cards/summary/"
          class="irisbox h-100 p-0">
          <template
            slot="object"
            slot-scope="{ model }"
          >
            <header
              class="management-header fixed-header text-uppercase"
            >
              {{ $t('management_indicator') }}
            </header>
            <div class="list-content">
              <nuxt-link
                v-for="key in order"
                :key="key"
                :to="localePath(dataLinks[key])"
                :class="colors[key]"
                tag="a"
                class="management-item"
              >
                <div class="management-number">
                  {{ model[key] }}
                </div>
                <div class="management-itemDescription">
                  {{ $t('record_card_' + key).toUpperCase() }}
                </div>
              </nuxt-link>
            </div>
          </template>
        </detail>
      </div>
      <!-- Group month activity doughnut -->
      <div class="col-12 col-lg-6 mb-3">
        <div class="irisbox h-100 p-0 m-0 d-flex flex-column">
          <header
            class="management-header fixed-header text-uppercase d-flex justify-content-between align-items-baseline"
          >
            {{ $t('management_profile_month_activity') }}
            <date-selector @value-updated="updateGroupMonthDate"/>
          </header>
          <profile-month-activity
            v-if="groupMonthDate"
            :date="groupMonthDate"
          />
        </div>
      </div>
    </div>
    <!-- Notifications -->
    <!-- <div class="irisbox row no-gutters"> -->
    <notifications />
    <!-- </div> -->
    <!-- Announcements -->
    <div class="irisbox row no-gutters">
      <announcement />
    </div>

    <mobile-breadcrumb 
      :active="2" 
      :max="10" />
    <div class="mobile-side-btn">
      <!-- you should use  btn-mobile as a default + btn-primary, btn-light...etc like usual -->
      <button class="btn-mobile btn-primary">
        <div class="btn-mobile__name">
          seleccionar alguna cosa
        </div>
        <font-awesome-icon
          :icon="['far', 'dot-circle']"/>
      </button>
      <button class="btn-mobile btn-light">
        <div class="btn-mobile__name">
          seleccionar alguna cosa
        </div>
        <font-awesome-icon
          :icon="['fas', 'plus']"/>
      </button>
      <button class="btn-mobile btn-danger">
        <div class="btn-mobile__name">
          seleccionar alguna cosa
        </div>
        <font-awesome-icon
          :icon="['fas', 'plus']"/>
      </button>
    </div>
  </div>
</template>

<script>
import AmbitIndicators from '~/components/iris-pages/admin/indicators/AmbitIndicators'
import AmbitMonthActivity from '~/components/iris-pages/records/charts/AmbitMonthActivity'
import Detail from '~/components/pages/detail/Detail.vue'
import ProfileMonthActivity from '~/components/iris-pages/records/charts/ProfileMonthActivity.vue'
import Notifications from '~/components/iris-pages/admin/notifications/Notifications'
import Announcement from '~/components/iris-pages/admin/Announcements.vue'
import DateSelector from '~/components/iris-pages/records/charts/DateSelector'
import MobileHeader from '~/components/mobile/header'
import MobileBreadcrumb from '~/components/mobile/breadcrumb'
import menuList from '~/components/mobile/menulist'
import { mapState } from 'vuex'

export default {
  name: 'DashboardMobile',
  components: {
    AmbitIndicators,
    AmbitMonthActivity,
    Detail,
    ProfileMonthActivity,
    Notifications,
    Announcement,
    DateSelector,
    MobileHeader,
    MobileBreadcrumb,
    menuList,
  },
  layout: 'backoffice',
  title() {
    return this.$t('my_own_activity')
  },
  data() {
    return {
      ambitMonthDate: null,
      groupMonthDate: null,
    }
  },
  computed: {
    order() {
      return [
        'urgent',
        'pending_validation',
        'processing',
        'expired',
        'near_expire',
      ]
    },
    groupHasChildren() {
      return this.selectedGroup ? this.selectedGroup.is_ambit : false
    },
    selectedGroupQuery() {
      return {
        query: {
          only_group: this.selectedGroup.id,
        },
      }
    },
    dataLinks() {
      return {
        urgent: {
          name: 'backoffice-tasks-urgent',
          query: {
            ...this.selectedGroupQuery.query,
            urgent: 1,
          },
        },
        pending_validation: {
          name: 'backoffice-tasks',
          ...this.selectedGroupQuery,
        },
        processing: {
          name: 'backoffice-tasks-progress',
          ...this.selectedGroupQuery,
        },
        expired: {
          name: 'backoffice-tasks-expired',
          query: {
            ...this.selectedGroupQuery.query,
            expired: 1,
          },
        },
        near_expire: {
          name: 'backoffice-tasks-near_expire',
          query: {
            ...this.selectedGroupQuery.query,
            near_expire: 1,
          },
        },
      }
    },
    colors() {
      return {
        urgent: 'urgent',
        pending_validation: 'pending-validate',
        processing: 'tramitation',
        expired: 'expired',
        near_expire: 'pending-expiration',
      }
    },
    ...mapState('groups', ['selectedGroup']),
  },
  methods: {
    findInTree(tree, id) {
      const callback = function(element) {
        if (element.id === id) return element
        if (element.childrens && Array.isArray(element.childrens)) {
          element.childrens.forEach(child => {
            return this.findInTree(child, id)
          })
        }
      }

      if (tree.id === id) return tree
      if (tree.childrens && Array.isArray(tree.childrens)) {
        return tree.find(callback)
      }
    },
    updateAmbitMonthDate(date) {
      this.ambitMonthDate = date
    },
    updateGroupMonthDate(date) {
      this.groupMonthDate = date
    },
  },
}
</script>

<style lang="scss">
.proces-succes {
  font-size: 2.5rem;
  margin: 2rem auto 1rem;
  border: 2px solid rgba($primary, 0.5);
  line-height: 1;
  padding: 0.5em;
  border-radius: 50%;
}
.mobile-side-btn {
  font-size: 1.75rem;
  position: fixed;
  bottom: 1vmin;
  right: 0;
  z-index: $zindex-fixed;
}
.btn-mobile {
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  margin: 0.25em 1vmin;
  width: 2em;
  height: 2em;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: inherit !important;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 5px 8px 0px rgba($black, 0.5);
  }

  &__name {
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
    position: absolute;
    right: 100%;
    margin-right: 1rem;
    color: $black;
    background-color: rgba($white, 0.7);
    padding: 0.5rem;
  }
  // &.btn-primary
  &:hover {
    .btn-mobile__name {
      opacity: 1;
    }
  }
}

.management {
  min-height: 300px;
  .detail {
    display: flex;
    flex-direction: column;
  }

  &-header {
    background-color: $gray-400;
    padding: 1rem;
    font-size: 1.25rem;
  }
  .list-content {
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
  }
  &-item {
    text-align: center;
    height: initial;
    padding: 1rem;
    margin: 1rem;
    min-width: 150px;
    border: 2px solid $gray-400;
    transition: 0.3s ease-in-out;
    &:hover {
      color: $gray-600;
      text-decoration: none;
      opacity: 0.75;
    }
    $hasExclamation: urgent;
    @each $element, $color in $indicators {
      &.#{$element} {
        color: $color;
        // Exclamation hightlight - to has an exclamation and border color
        @if ($element == $hasExclamation) {
          font-weight: 600;
          border-color: $color;
          .management-number {
            font-weight: 600;
          }
          .management-number::after {
            content: '!';
          }
        }
        // END exclamation
        &:focus {
          outline-color: $color;
        }
      }
    }
  }
  &-number {
    margin-top: 1.5rem;
    font-size: 3.5rem;
    line-height: 1;
    font-weight: 300;
  }
  &-itemDescription {
    min-height: 2rem;
  }
}
.announcements {
  .list-content {
    padding: 1rem;
  }
}
.announcements {
  width: 100%;
  &-header {
    font-size: 1.125rem;
    font-weight: 700;
    background: none;
    display: flex;
    justify-content: space-between;
  }
  &-item {
    height: 100%;
    padding: 2rem 1rem 1rem;
    display: flex;
    flex-direction: column;
  }
  &-itemTitle {
    height: initial;
    font-weight: 700;
  }
  &-itemFooter {
    margin-top: auto;
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
    color: $gray-500;
    align-items: center;
    .fa-info {
      width: 1.6em;
      height: 1.6em;
      display: flex;
      padding: 0.3em 0.6em;
      background-color: $gray-400;
      color: $gray-500;
      border-radius: 1rem;
      margin-right: 0.8em;
    }
  }
}

.announcements-itemTitle {
  background: none;
}
.announcements-itemFooter {
  border: none !important;
}

@include media-breakpoint-up(lg) {
  .management {
    &-item {
      width: 25%;
    }
  }
}
</style>
