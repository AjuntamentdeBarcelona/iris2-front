<template>
  <div>
    <sweet-modal
      ref="modal"
      :alt="$t('authorization_error')"
      :aria-describedby="$t('authorization_error')"
      hide-close-button
      icon="warning"
      role="alertdialog"
    >
      <h2 class="text-danger">{{ $t('authorization_error') }}</h2>
      <p id="modalDescription">{{ $t('authorization_error_description') }}</p>
      <button
        slot="button"
        class="btn btn-light"
        @click="close"
      >
        {{ $t('ok') }}
      </button>
    </sweet-modal>
  </div>
</template>


<script>
/**
 * Displays a model showing an authorization error.
 */
export default {
  name: 'AuthorizationError',
  data() {
    return {
      shown: false,
    }
  },
  methods: {
    open() {
      this.$refs.modal.open()
    },
    close() {
      this.$refs.modal.close()
    },
  },
}
</script>
