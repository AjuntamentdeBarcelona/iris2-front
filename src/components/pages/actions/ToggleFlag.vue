<template>
  <div 
    v-if="canPerform"
    class="toggle">
    <toggle-button
      :value="value"
      :sync="true"
      :disabled="disableButton"
      color="#ffc900"
      type="checkbox"
      @change="toggleValue"
    />
    <slot>
      <span class="toggle__item">{{ labelText }}</span>
    </slot>
    <sweet-modal
      ref="retryModal"
      :alt="actionErrorText"
      icon="error"
      aria-describedby="modalDescription"
      role="alertdialog"
    >
      <p id="modalDescription">{{ actionErrorText }}</p>
      <button
        slot="button"
        class="btn btn-primary"
        @click="close"
      >
        {{ actionRetryText }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
import _ from 'lodash'

/**
 * Component meant for setting the value of flags on objects, bassed on their actions.
 * Each object has an actions Object which defines the diferent state transitions and
 * changes that can be made on it. This class takes that format and allows to change
 * flag values (true or false), with a convenient toggle interface.
 */
export default {
  name: 'ToggleFlag',
  props: {
    /**
     * Actionable object (with an action dict which defines what could do)
     */
    object: {
      type: Object,
      required: true,
      validate(value) {
        if (!value.actions) {
          console.error(
            'ToggleFlag object requires an object with actions definition'
          )
        }
      },
    },
    /**
     * Action name (must be in the object actions, so it must be accesible as this.objects[this.action])
     */
    action: {
      type: String,
      required: true,
    },
    /**
     * Object attribute which contains the value of the flag being set.
     */
    flagAttr: {
      type: String,
      required: true,
    },
    /**
     * Forces the toggle to disable (useful for read-only views).
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Translation key for the action label.
     */
    labelKey: {
      type: String,
      required: false,
      default: '',
    },
    /**
     * Translation key for the retry button.
     */
    actionRetryKey: {
      type: String,
      default: 'action_retry',
    },
    /**
     * Translation key for the error message.
     */
    actionErrorKey: {
      type: String,
      default: 'action_error',
    },
    /**
     * Success message translation key.
     */
    successMessageKey: {
      type: String,
      default: 'action_success',
    },
    /**
     * Success message translation key when flag is set to false.
     * If not passed, the successMessageKey will be used.
     */
    successMessageKeyFalse: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      sending: false,
      error: false,
    }
  },
  computed: {
    /**
     * @return {Object} Map of available object that can be made to the object
     */
    actions() {
      return this.object.actions || {}
    },
    /**
     * @return {Object} Action spec (found in object actions)
     */
    spec() {
      return this.actions[this.action] || {}
    },
    /**
     * @return {Boolean} True if the user can perform the action (action present in object).
     */
    canPerform() {
      return this.requestUrl != null
    },
    /**
     * Current toggle value
     */
    value: {
      get() {
        return this.object[this.flagAttr] || false
      },
      set(value) {
        if (!this.sending) {
          this.object[this.flagAttr] = value
        }
      },
    },
    /**
     * @return {String} Endpoint URL.
     */
    requestUrl() {
      return this.spec.action_url
    },
    /**
     * @return {String} HTTP verb for the request.
     */
    requestMethod() {
      return this.spec.action_method || 'post'
    },
    /**
     * @return {Boolean} True if the toggle must bi disabled.
     */
    disableButton() {
      return this.disabled || this.sending
    },
    /**
     * @return {String} Label for the toggle
     */
    labelText() {
      return this.spec.label || this.$t(this.labelKey)
    },
    actionRetryText() {
      return this.$t(this.actionRetryKey)
    },
    actionErrorText() {
      return this.$t(this.actionErrorKey)
    },
    successMessageTextTrue() {
      return this.$t(this.successMessageKey)
    },
    successMessageTextFalse() {
      return this.$t(this.successMessageKeyFalse || this.successMessageKeyTrue)
    },
  },
  created() {
    this.debouncedSendRequest = _.debounce(this.sendRequest, 200)
  },
  methods: {
    /**
     * Toggles the value, debouncing requests.
     */
    toggleValue() {
      this.value = !this.value
      this.debouncedSendRequest()
    },
    /**
     * Sends the toggle flag chnage request.
     * @return {Promise}
     */
    sendRequest() {
      this.sending = true

      const sentData = {
        [this.flagAttr]: this.value,
      }
      this.$emit('sending')
      const promise = this.$axios[this.requestMethod](this.requestUrl, sentData)
      promise
        .then(resp => {
          this.onFlagChangeSent(resp)
          this.valueChanged()
        })
        .catch(error => {
          this.value = !sentData.block
          this.onFlagChangeRequestError(error, sentData)
          this.valueSetError()
          this.retry()
        })
        .then(() => {
          this.sending = false
        })
      return promise
    },
    /**
     * Opens the retry modal if possible, sometimes the component will be disposed,
     * so the message must be sent throught the central notify system.
     */
    retry() {
      if (this.$refs.retryModal) {
        this.$refs.retryModal.open()
      } else {
        this.$notify({
          group: 'iris',
          title: this.actionErrorText,
          type: 'error',
          text: null,
        })
      }
    },
    /**
     * Method invoked on correct flag chang request made on endpoint.
     * @param {Object} resp Axios response object
     */
    onFlagChangeSent(resp) {
      this.$notify({
        group: 'iris',
        title: this.value
          ? this.successMessageTextTrue
          : this.successMessageTextFalse,
        type: 'success',
        text: '',
      })
    },
    /**
     * Called when the answer has an error.
     * @param {Object|Error} error Axios response object or Error produced by an exception due to an unexpected server answer.
     * @param {Object} sentData Data sent to the server within the failed request.
     */
    onFlagChangeRequestError(error, sentData) {},
    /**
     * Closes the retry modal.
     */
    close() {
      this.$refs.retryModal.close()
    },
    valueChanged() {
      this.$emit('value-changed', this.object, this.value)
    },
    valueSetError() {
      this.$emit('value-set-error', this.object, this.value)
    },
  },
}
</script>
