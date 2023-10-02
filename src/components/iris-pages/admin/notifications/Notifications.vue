<template>
  <div
    v-if="canSeeNotifications"
    class="notification__list irisbox row no-gutters"
  >
    <header class="announcements-header col-12 mb-2">
      <span>
        {{ $t('notifications_title') }}
      </span>
    </header>
    <b-tabs class="col-12">
      <b-tab
        v-for="(component, key, index) in tableComponents"
        :key="index"
      >

        <template slot="title">
          <div class="d-flex align-items-center">
            <font-awesome-icon
              :icon="component.icon"
              class="mr-1"/>
            <span>{{ $t(get(component.table, 'props.title.default')) }}</span>
            <unread-badge
              v-if="component.notifications > 0"
              :unread="component.notifications"/>
          </div>
        </template>
        <div class="">
          <component
            :is="component.table"
            @loaded="setNotifications($event, key)"
          />
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import UnreadBadge from '~/components/iris-pages/records/communications/UnreadBadge'
import InternalNotifications from '~/components/iris-pages/admin/notifications/InternalNotifications'
import ExternalNotifications from '~/components/iris-pages/admin/notifications/ExternalNotifications'
import ApplicantNotifications from '~/components/iris-pages/admin/notifications/ApplicantNotifications'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  components: {
    UnreadBadge,
  },
  data() {
    return {
      tableComponents: {
        InternalNotifications: {
          table: InternalNotifications,
          notifications: null,
          icon: ['fas', 'pen-square'],
        },
        ExternalNotifications: {
          table: ExternalNotifications,
          notifications: null,
          icon: ['fas', 'external-link-square-alt'],
        },
        ApplicantNotifications: {
          table: ApplicantNotifications,
          notifications: null,
          icon: ['fas', 'user-tie'],
        },
      },
      get: _.get,
    }
  },
  computed: {
    newNotificacions() {
      const notification = this.tableComponents
      const Internal = notification.InternalNotifications.notifications
      const External = notification.ExternalNotifications.notifications
      const Aplicant = notification.ApplicantNotifications.notifications
      if (Internal || External || Aplicant) {
        return true
      }
      return false
    },
    canSeeNotifications() {
      return this.hasPermission(Permissions.RECORD.NOTIFICATIONS)
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
  },
  methods: {
    setNotifications(event, key) {
      this.tableComponents[key].notifications = event.count
    },
  },
}
</script>

<style lang='scss' scoped>
.notification__list {
  overflow: hidden;
  width: 100%;
  /deep/ .VueTables {
    border: 0;
    padding: 0.5rem;
    margin-bottom: 0;
  }
}
</style>
