<template>
  <div v-b-popover.hover="canConfirm ? undefined : hint">
    <!-- Button -->
    <b-button

      :variant="buttonContextualVariant"
      :disabled="disabled || !canConfirm"
      @click="openModal"
    >
      <font-awesome-icon
        v-if="buttonIcon"
        :icon="buttonIcon"
        :class="buttonIconClass"
      />
      {{ $t(buttonTextKey) }}
    </b-button>

    <!-- Confirm modal -->
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="modal"
        :blocking="true"
      >
        <p>{{ $t(modalContentTextKey) }}</p>

        <b-button
          variant="outline-dark"
          @click="closeModal"
        >{{ $t('cancel') }}</b-button>

        <b-button
          @click="onConfirm"
        >{{ $t('ok') }}</b-button>
      </sweet-modal>
    </MountingPortal>
  </div>
</template>

<script>
export default {
  props: {
    // Mandatory
    buttonTextKey: {
      type: String,
      required: true,
    },
    modalContentTextKey: {
      type: String,
      required: true,
    },
    // Optional
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonContextualVariant: {
      type: String,
      default: undefined,
    },
    buttonIcon: {
      type: String,
      default: undefined,
    },
    buttonIconClass: {
      type: String,
      default: undefined,
    },
    hint: {
      type: String,
      default: '',
      required: false,
    },
    beforeConfirm: {
      type: Function,
      default() {
        return () => {
          true
        }
      },
    },
  },
  computed: {
    canConfirm() {
      return this.beforeConfirm()
    },
  },
  methods: {
    openModal() {
      if (this.beforeConfirm()) {
        this.$refs.modal.open()
      }
    },
    closeModal() {
      this.$refs.modal.close()
    },
    onConfirm() {
      this.$emit('action-done')
      this.closeModal()
    },
  },
}
</script>
