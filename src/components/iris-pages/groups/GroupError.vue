<template>
  <sweet-modal
    ref="errorModal"
    :alt="$t('error_group')"
    :blocking="true"
    :hide-close-button="true"
    icon="error"
    aria-describedby="modalDescription"
    role="alertdialog"
    class="blocking-error"
  >
    <div 
      v-if="groupsLoading" 
      class="loading-overlay">
      <div class="loader" />
    </div>
    <p id="modalDescription">{{ errorMsg }}</p>
    <button
      slot="button"
      :disabled="groupsLoading"
      class="btn btn-light"
      autofocus
      @click="retry"
    >
      <font-awesome-icon icon="sign-out-alt" />
      {{ $t('retry') }}
    </button>
  </sweet-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'

/**
 * This component checks if the groups and auth has been loaded successfully.
 * In case of error it displays an error modal with options for retry the operation.
 */
export default {
  name: 'GroupError',
  computed: {
    ...mapState('groups', {
      groupsLoading: state => state.loading,
      groupsError: state => state.error,
      isSystem: state => state.errorStatus >= 300,
    }),
    errorMsg() {
      return this.$t(
        this.isSystem ? 'error_group_message_system' : 'error_group_message'
      )
    },
  },
  watch: {
    groupsError() {
      this.updateErrorModal()
    },
  },
  mounted() {
    this.loadParams()
    this.loadGroups()
  },
  methods: {
    updateErrorModal() {
      const op = this.groupsError ? 'open' : 'close'
      this.$refs.errorModal[op]()
    },
    retry() {
      this.loadGroups(true)
    },
    ...mapActions('groups', ['loadGroups']),
    ...mapActions(['loadParams']),
  },
}
</script>
