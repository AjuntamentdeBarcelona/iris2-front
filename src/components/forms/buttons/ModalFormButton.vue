<template>
  <div>
    <div class="d-flex align-items-center">
      <slot/>
      <!-- Open button -->
      <b-button
        :variant="openButtonVariant"
        :disabled="disabled"
        class="btn-sm"
        @click="openModal"
      >
        <font-awesome-icon
          v-if="icon"
          :icon="icon"/>
        {{ $t(openButtonTextKey) }}
      </b-button>
    </div>
    <!-- Modal -->
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="modal"
        :key="renderKey"
        :icon="modalIcon"
        :blocking="modalIsBlocking"
        :width="width"
        :class="{'modal-fixed-scroll': !showScroll}"
        @close="onModalClosed"
      >
        <p>{{ $t(modalContentTextKey) }}</p>

        <slot name="before-form"/>
        <!-- Form -->
        <component
          v-if="formComponentIsSchemaForm && opened"
          :is="formComponent"
          :record-card="recordCard"
          :form-component-data="formComponentData"
          :url="actionUrl"
          :success-url="successUrl"
          v-bind="formProps"
          @form-saved="formSaved"
        />
        <component
          v-else-if="opened"
          :is="formComponent"
          :record-card="recordCard"
          :form-component-data="formComponentData"
          :url="actionUrl"
          v-bind="formProps"
          @form-saved="formSaved"
        />
      </sweet-modal>
    </MountingPortal>
  </div>
</template>

<script>
import { get } from 'lodash'

/**
 * A component to perform actions in the context of a RecordCard
 *
 * A form (SchemaForm) or other component must be inserted to provide a save button
 * Said button will close the modal by sending a 'form-saved' signal when the main action
 * has been carried out succesfully
 *
 * It will create a portal targetting the body element, where the modal will be sent.
 */
export default {
  name: 'ModalActionFormButton',
  props: {
    // Mandatory
    recordCard: {
      type: Object,
      required: true,
    },
    formComponent: {
      type: Object,
      required: true,
    },
    openButtonTextKey: {
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
    action: {
      type: String,
      default: undefined,
    },
    url: {
      type: String,
      default: undefined,
    },
    formComponentData: {
      type: Object,
      default: undefined,
    },
    formComponentIsSchemaForm: {
      type: Boolean,
      default: true,
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    openButtonVariant: {
      type: String,
      default: undefined,
    },
    modalIcon: {
      type: String,
      default: undefined,
    },
    modalIsBlocking: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '40%',
    },
    icon: {
      type: String,
      default: '',
    },
    resetOnClose: {
      type: Boolean,
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
      renderKey: 0,
      opened: false,
    }
  },
  computed: {
    actionUrl() {
      return (
        this.url || get(this, `recordCard.actions.${this.action}.action_url`)
      )
    },
    successUrl() {
      return this.$route.name
    },
  },
  methods: {
    openModal() {
      this.opened = true
      this.$refs.modal.open()
    },
    closeModal() {
      this.$refs.modal.close()
    },
    formSaved(response, sentObj) {
      const success = true
      this.$emit('action-done', success)
    },
    onModalClosed() {
      this.$emit('modal-closed')
      if (this.resetOnClose) {
        this.renderKey = this.renderKey + 1
      }
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
/deep/ .sweet-modal {
  .sweet-content-content {
    text-align: left;
  }
}
</style>
