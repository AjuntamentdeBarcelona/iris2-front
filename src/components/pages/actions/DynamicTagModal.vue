<template>
  <!-- Open button -->
  <component
    :is="component"
    v-bind="componentProps"
    @click="open"
  >
    <slot />
    <!-- Modal -->
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="modal"
        :icon="modalIcon"
        :blocking="blocking"
        :width="width"
        :class="{'modal-fixed-scroll': !showScroll}"
        enable-mobile-fullscreen
        @close="closeFromModal"
      >
        <slot
          v-if="opened || preload"
          name="modal" />
      </sweet-modal>
    </MountingPortal>
  </component>

</template>

<script>
/**
 * Component for implementing flows starting by clicking a button and finishing
 * with some action on the modal. The modal content must be filled in the slot named="modal"
 * by the parent component.
 *
 * The slot content won't be created until the modal has been opened.
 */
export default {
  name: 'DynamicTagModal',
  props: {
    component: {
      type: [String, Object],
      default: () => 'b-button',
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    blocking: {
      type: Boolean,
      default: true,
    },
    preload: {
      type: Boolean,
      default: false,
    },
    modalIcon: {
      type: String,
      default: undefined,
    },
    width: {
      type: [Number, String],
      required: false,
      default: null,
    },
    resetOnClose: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * If true, will allow scroll on the modal.
     */
    showScroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      opened: false,
    }
  },
  methods: {
    open() {
      this.opened = true
      this.$refs.modal.open()
      this.$emit('opened')
    },
    close() {
      this.$refs.modal.close()
      if (this.resetOnClose) {
        this.reset()
      }
    },
    closeFromModal() {
      if (this.resetOnClose) {
        this.reset()
      }
      this.$emit('modal-closed')
    },
    reset() {
      this.opened = false
    },
  },
}
</script>

<style lang="scss">
.modal-fixed-scroll {
  .sweet-modal {
    overflow: initial;
  }
}
</style>


<style lang="scss" scoped>
/deep/ {
  .sweet-modal {
    .sweet-content-content {
      text-align: left;
    }
  }
}
</style>
