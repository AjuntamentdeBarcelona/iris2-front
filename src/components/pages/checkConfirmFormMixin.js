import RecordState from '~/assets/js/iris2/model/RecordState.js'

/**
 * Mixin that allows SchemaForm to perform a check for group and ambit changes before submiting
 * and present a confirmation modal
 *
 * Please customize:
 * -getCheckUrl
 * -alwaysShowConfirmModal
 * -confirmMessage (not necessary if the previous is false)
 *
 * It may be used in combination with SchemaForm's checkAllRequired or not
 * If not using checkEveryTime, a model watcher may change checkDone to false, to decide when it's necessary to recheck
 */
export default {
  data() {
    return {
      checkDone: false,
      checkResponse: {},
      checkErrorMessage: this.$t('record_card_check_failed'),
      confirmMessage: this.$t('confirm'),
      alwaysShowConfirmModal: true,
      checkEveryTime: true,
    }
  },
  computed: {
    currentGroup() {
      return this.model.responsible_profile
    },
    currentState() {
      return this.model.record_state
    },
    nextGroup() {
      return this.checkResponse.next_group || {}
    },
    nextState() {
      return this.checkResponse.next_state
    },
    differentGroup() {
      return this.nextGroup.id
        ? this.currentGroup.id !== this.nextGroup.id
        : undefined
    },
    differentState() {
      return this.nextState != this.currentState.id
    },
    differentAmbit() {
      return this.checkResponse.different_ambit
    },
    differentGroupOrAmbit() {
      return this.differentGroup || this.differentAmbit
    },
  },
  methods: {
    submit(event, onSuccess) {
      if (this.isReadyForSend(this.model)) {
        if (this.beforeSubmit(this.model)) {
          this.checkSave(onSuccess)
        }
        return false
      }
      this.showNotReadyMessage()
      return false
    },
    checkSave(onSuccess) {
      if (!this.checkDone || this.checkEveryTime) {
        this.performGroupAmbitCheck(onSuccess)
      } else {
        this.showConfirmModal(onSuccess)
      }
    },
    submitForm() {
      if (this.saveOnSubmit) {
        return this.save(this.constructSaveData(this.model))
      } else {
        this.$emit('submit', this.model)
        return true
      }
    },
    async performGroupAmbitCheck(onSuccess) {
      this.saving = true
      this.checkDone = false
      this.resetCheckError()

      try {
        this.checkResponse = (await this.$axios(
          this.getRequestObject()
        )).data.__action__

        this.checkDone = true
        this.showConfirmModal(onSuccess)
      } catch (e) {
        this.saving = false
        if (e.response && e.response.status == 403) {
          this.showCheckError(this.$t('authorization_error_description'))
        } else {
          this.showCheckError(this.checkErrorMessage)
        }
      }
    },
    getRequestObject() {
      return {
        method: this.method,
        url: this.getCheckUrl(),
        data: this.constructSaveData(this.model),
      }
    },
    getCheckUrl() {
      return ''
    },
    getConfirmMessage() {
      const ambit = this.differentGroupOrAmbit
        ? this.getGroupAmbitMessage()
        : this.confirmMessage
      return ambit + this.getStateMessage()
    },
    getStateMessage() {
      try {
        if (this.differentState) {
          return ` ${this.$t('record_card_update_change_state')}: `.replace(
            '{state}',
            this.$t(RecordState.findById(this.nextState, {}).title)
          )
        }
        return ''
      } catch (e) {
        console.log(e)
        return ''
      }
    },
    getGroupAmbitMessage() {
      const groupChangeMessage =
        `${this.$t('checks_different_group')}: ` +
        `"${this.currentGroup.description}" » ` +
        `"${this.nextGroup.description}"`

      return this.differentGroup && !this.differentAmbit
        ? groupChangeMessage
        : `${groupChangeMessage}. ${this.$t('checks_different_ambit_also')}.`
    },
    showConfirmModal(onSuccess) {
      if (this.alwaysShowConfirmModal || this.differentGroupOrAmbit) {
        this.saving = false
        const confirmMessage = this.getConfirmMessage()

        this.$refs.modalConfirm.open(
          confirmMessage,
          confirmMessage,
          this.submitForm
        )
      } else {
        this.saving = true
        this.submitForm(onSuccess)
      }
    },
    showCheckError(error) {
      if (!this.globalErrors.find(e => e === this.checkErrorMessage)) {
        this.globalErrors.push(error || this.checkErrorMessage)
      }

      this.showCheckNotification(error || this.checkErrorMessage)
    },
    showCheckNotification(error) {
      this.$notify({
        group: 'iris',
        title: error || this.checkErrorMessage,
        type: 'error',
        text: '',
      })
    },
    resetCheckError() {
      this.globalErrors = this.globalErrors.filter(
        e => e !== this.checkErrorMessage
      )
    },
  },
}
