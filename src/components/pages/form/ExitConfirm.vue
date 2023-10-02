<template>
  <sweet-modal
    ref="exitConfirm"
    :alt="$t('form_confirm_exit_title')"
    aria-describedby="modalDescription"
    icon="warning"
    role="alertdialog"
  >
    <p id="modalDescription">{{ $t('form_confirm_exit_discard_changes') }}</p>
    <button
      slot="button"
      class="btn btn-light"
      @click="close"
    >
      {{ $t('form_confirm_exit_quedar') }}
    </button>
    <button
      slot="button"
      class="btn btn-primary"
      autofocus
      @click="nextScreenFn"
    >
      <font-awesome-icon icon="sign-out-alt" />
      {{ $t('form_confirm_exit_sortir') }}
    </button>
  </sweet-modal>
</template>

<script>
export default {
  name: 'ExitConfirm',
  data() {
    return {
      nextScreenFn: () => {},
    }
  },
  methods: {
    open(next) {
      this.nextScreenFn = next
      this.$refs.exitConfirm.open()
    },
    close() {
      this.nextScreenFn(false)
      this.$refs.exitConfirm.close()
    },
  },
}
</script>
