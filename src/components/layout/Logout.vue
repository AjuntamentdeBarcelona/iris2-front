<template>
  <span class="logout">
    <a 
      href="#"
      @click="askForLogout" >
      <font-awesome-icon icon="power-off" />
    </a>
    <sweet-modal
      ref="confirmLogout"
      :alt="$t('delete_confirm_title')"
      aria-describedby="modalDescription"
      icon="warning"
      role="alertdialog"
    >
      <p id="modalDescription">{{ $t('logout_sure') }}</p>
      <button
        slot="button"
        class="btn btn-light"
        @click="close"
      >
        {{ $t('delete_confirm_cancel') }}
      </button>
      <button
        slot="button"
        class="btn btn-primary"
        autofocus
        @click="logout"
      >
        {{ $t('logout_ok') }}
        <font-awesome-icon icon="sign-out-alt" />
      </button>
    </sweet-modal>
  </span>
</template>

<script>
import { mapState } from 'vuex'

/**
 * Logout component for IRIS2.
 *
 * Before logout, ask for confirmation with a modal.
 *
 * Logout consists in visiting an URL given by config and
 * stored in the state.
 */
export default {
  name: 'Logout',
  computed: {
    ...mapState({
      logoutUrl: state => state.config.logoutUrl,
    }),
  },
  methods: {
    askForLogout() {
      this.$refs.confirmLogout.open()
    },
    close() {
      this.$refs.confirmLogout.close()
    },
    logout() {
      localStorage.setDefaultLang = undefined

      if (this.logoutUrl) {
        window.location =
          this.logoutUrl + '?urlReturn=' + window.location.origin
      } else {
        this.$auth.logout()
      }
    },
  },
}
</script>

<style>
.logout .sweet-modal {
  color: #000;
}
</style>
