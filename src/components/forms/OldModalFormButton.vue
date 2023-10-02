<template>
  <div v-show="isAuthorized">
    <b-button
      :variant="variant"
      @click="openModal"
    >
      <font-awesome-icon
        :icon="['fas', 'exchange-alt']"/>
      <slot>{{ $t(buttonTextKey) }}</slot>
    </b-button>
    <MountingPortal
      mount-to="body"
      append
    >
      <b-modal
        ref="modal"
        :title="$t(modalTextKey)"
        :hide-footer="true"
        class="modal-fixed-scroll"
        @hidden="onHidden"
      >
        <slot name="before-form" />
        <slot name="form">
          <div
            v-if="alert"
            class="alert alert-warning">
            {{ alert }}
          </div>
          <button
            v-if="!alertAccepted"
            class="btn btn-primary float-right"
            @click="acceptAlert">
            {{ $t('accept') }}
          </button>
          <component
            v-if="alertAccepted && showForm && opened"
            :is="formComponent"
            :prop-model="model"
            :url="url"
            :success-url="successUrl"
            @form-saved="formSaved"
            @cancel="closeModal"
          />
        </slot>
      </b-modal>
    </MountingPortal>
  </div>
</template>

<script>
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'

export default {
  name: 'OldModalFormButton',
  mixins: [AuthorizationMixin],
  props: {
    buttonTextKey: {
      type: String,
      required: true,
    },
    modalTextKey: {
      type: String,
      required: true,
    },
    formComponent: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      default: undefined,
    },
    successUrl: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: undefined,
    },
    alert: {
      type: String,
      default: undefined,
      required: false,
    },
    /**
     * If true the alert text will be shown as a modal, that must be accepted before
     * starting the work.
     */
    alertModalMode: {
      type: Boolean,
      default: true,
      required: false,
    },
    resetFormOnModalClosed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      alertAccepted: !this.alertModalMode,
      showForm: true,
      opened: false,
    }
  },
  methods: {
    acceptAlert() {
      this.alertAccepted = true
    },
    openModal() {
      this.opened = true
      this.$refs.modal.show()
    },
    closeModal() {
      this.$refs.modal.hide()
    },
    formSaved(response, sentObj) {
      this.$emit('action-done', true, response.data)
      this.closeModal()
    },
    async onHidden() {
      if (this.resetFormOnModalClosed) {
        this.showForm = false
        await this.$nextTick()
        this.showForm = true
      }
    },
  },
}
</script>

<style lang="scss">
.modal-fixed-scroll {
  .modal-body {
    overflow-y: auto;
    max-height: 85vh;
  }
}
</style>
