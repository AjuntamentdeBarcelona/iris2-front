<template>
  <sweet-modal
    ref="modal"
    :alt="title"
    aria-describedby="modalDescription"
    icon="warning"
    role="alertdialog"
  >
    <p id="modalDescription">{{ message }}</p>
    <button
      slot="button"
      class="btn btn-light"
      @click="decline"
    >
      {{ cancel }}
    </button>
    <button
      slot="button"
      class="btn btn-primary"
      autofocus
      @click="accept"
    >
      <font-awesome-icon icon="sign-out-alt" />
      {{ action }}
    </button>
  </sweet-modal>
</template>

<script>
export default {
  name: 'ExitConfirm',
  data() {
    return {
      title: '',
      message: '',
      action: this.$t('confirm'),
      cancel: this.$t('cancel'),
      callback: () => null,
    }
  },
  methods: {
    /**
     * @param {String} title Title for the modal
     * @param {String} message Message for the modal
     * @param {Function} callback Callback called with the result. If not modal version, won't be called on cancel.
     * @param {String} cancelTxt Cancel button text
     * @param {String} confirmTxt Confirm button text
     * @param {Boolean} modal If true, the user will have to choose between two options, all of the triggering an action.
     */
    open(
      title,
      message,
      callback,
      cancelTxt = null,
      confirmTxt = null,
      modal = false
    ) {
      this.title = title
      this.message = message
      this.callback = callback
      this.cancel = cancelTxt ? cancelTxt : this.cancel
      this.action = confirmTxt ? confirmTxt : this.action
      this.modal = modal
      this.$refs.modal.open()
    },
    accept() {
      this.$emit('accept')
      const result = this.callback(true)
      if (result !== false) {
        this.close()
      }
    },
    decline() {
      if (this.modal) {
        this.callback(false)
      }
      this.close()
    },
    close() {
      this.$refs.modal.close()
    },
    reset() {
      this.title = ''
      this.message = ''
      this.action = this.$t('confirm')
      this.cancel = this.$t('cancel')
      this.callback = () => null
    },
    closeAndReset() {
      this.close()
      this.reset()
    },
  },
}
</script>
