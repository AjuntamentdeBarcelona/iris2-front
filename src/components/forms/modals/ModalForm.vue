<template>
  <!-- Modal -->
  <MountingPortal
    mount-to="body"
    append
  >
    <sweet-modal
      ref="modal"
      :style="modalStyle"
      :icon="modalIcon"
      :blocking="modalIsBlocking"
      :width="modalWidth"
      enable-mobile-fullscreen
      @close="onModalClosed"
    >
      <p v-html="modalTextContent"/>
      <slot name="before-form" />
      <!-- Form -->
      <component
        v-if="modalOpen"
        ref="form"
        :is="formComponent"
        v-bind="formProps"
        @form-saved="onFormSaved"
        @go-back="onExit"
      />
    </sweet-modal>
  </MountingPortal>
</template>

<script>
/**
 * Component that renders a form inside a modal.
 * Said form must emit a 'form-saved' event to close the modal
 *
 * Closing the modal is enough to reset the form's state
 */
export default {
  props: {
    formComponent: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    modalTextContent: {
      type: String,
      default: '',
    },
    modalIcon: {
      type: String,
      default: '',
    },
    modalIsBlocking: {
      type: Boolean,
      default: true,
    },
    modalOverflow: {
      type: String,
      default: 'initial',
    },
    modalWidth: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      modalOpen: false,
    }
  },
  computed: {
    modalStyle() {
      return {
        '--modal-overflow': this.modalOverflow,
      }
    },
  },
  methods: {
    open() {
      this.$refs.modal.open()
      this.modalOpen = true
    },
    close() {
      this.$refs.modal.close()
    },
    onModalClosed() {
      this.modalOpen = false
      this.$emit('modal-closed')
    },
    onFormSaved(response, sentObj) {
      this.$emit('form-saved', true)
    },
    onExit(response, sentObj) {
      this.$emit('exit')
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .sweet-modal {
  overflow: var(--modal-overflow);

  .sweet-content-content {
    text-align: left;
  }
}
</style>
