<template>
  <portal-modal
    v-if="!askForExternal"
    ref="modalInfo"
    :blocking="true"
    :portal="true"
  >
    <p>{{ $t('record_card_validate_confirm_and_external') }}</p>

    <b-button
      @click="closeInfo"
    >{{ $t('ok') }}</b-button>
  </portal-modal>
  <modal-form 
    v-else
    ref="modalForm"
    :form-component="formComponent"
    :form-props="formProps"
    @form-saved="close(true)"
    @exit="close(false)">
    <template slot="before-form">
      <div 
        class="alert alert-warning">
        {{ message }} 
      </div>
    </template>
  </modal-form>
</template>

<script>
import ModalForm from '~/components/forms/modals/ModalForm'
import PortalModal from '~/components/forms/modals/PortalModal'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import AutoritasForm from './AutoritasForm.vue'
import DefaultExternalForm from './DefaultExternalForm.vue'

const forms = {
  AUT: AutoritasForm,
}

/**
 * Some themes require the user to decide whether to send the record to an external service or not.
 *
 * It appears as a popup with a form for configuring the options to send to external service. If the user chooses to
 * manage the record in IRIS, it simple closes and continues as a normal validation.
 */
export default {
  name: 'ExternalServiceChecker',
  components: {
    ModalForm,
    PortalModal,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    checkResponse: {
      type: Object,
      required: true,
    },
    actionUrl: {
      type: String,
      required: true,
    },
  },
  computed: {
    /**
     * If this is true, we have to ask user if he wants to sen the record to external
     * service or manage it in IRIS.
     */
    askForExternal() {
      return this.checkResponse && this.checkResponse.ask_for_external_service
    },
    /**
     * Is going to be sent to an external tramitation state, so we have to show the info modal.
     */
    isExternal() {
      return RecordState.isExternal(this.checkResponse.next_state)
    },
    /**
     * Message for the modal.
     */
    message() {
      if (this.askForExternal) {
        return this.$t('external_service_send', [
          this.checkResponse.external_service_name,
        ])
      }
    },
    /**
     * Select the form component according to the external service.
     */
    formComponent() {
      return forms[this.checkResponse.external_service] || DefaultExternalForm
    },
    formProps() {
      return {
        url: this.actionUrl,
        title: this.$t('external_service_send_title', [
          this.checkResponse.external_service_name,
        ]),
        saveButtonText: this.$t('external_service_send_title', [
          this.checkResponse.external_service_name,
        ]),
        backButtonText: this.$t('external_service_no_send'),
        extraData: {
          // If the form is used, always has to be send to external and not managed in IRIS.
          send_external: true,
        },
      }
    },
  },
  mounted() {
    if (this.askForExternal) {
      this.$nextTick(() => this.open())
    } else if (this.isExternal) {
      this.$nextTick(() => this.openInfo())
    }
  },
  methods: {
    open() {
      this.$refs.modalForm.open()
    },
    close(sendExternal) {
      if (sendExternal) {
        this.$refs.modalForm.close()
        // Validation has been done with a custom flow
        this.$emit('done')
      }
    },
    closeInfo() {
      this.$refs.modalInfo.close()
    },
    openInfo() {
      this.$refs.modalInfo.open()
    },
  },
}
</script>
