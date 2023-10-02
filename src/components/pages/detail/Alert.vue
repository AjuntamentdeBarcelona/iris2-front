<template>
  <div>
    <slot
      v-if="showNonModal && mustShow && active"
      :message="nonModalMessage"
      :value="value">
      <span class="text-danger">{{ nonModalMessage }}</span>
    </slot>
    <sweet-modal
      ref="modal"
      :alt="$t('alert')"
      aria-describedby="modalDescription"
      icon="warning"
      role="alertdialog"
    >
      <p id="modalDescription">{{ alertMessage }}</p>
      <button
        slot="button"
        class="btn btn-light"
        @click="accept"
      >
        {{ $t('ok') }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
/**
 * Component for displaying alerts or similar interruptive messages.
 * The component watches for changes in the value prop, and when the
 * value mets a given condition displays the message.
 *
 * The component can work with props or can be extended easily by overriding
 * its methods for adapting the behaviour.
 *
 * In addition, the component can display or not the same message without the
 * alert, combining the interruptive notification with a normal message text.
 * The HTML for this message can be customized using the default slot, which
 * receives the message var.
 */
export default {
  name: 'Alert',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    showCondition: {
      type: Function,
      default() {
        return value => true
      },
    },
    messageKey: {
      type: String,
      default: '',
    },
    showNonModal: {
      type: Boolean,
      default: true,
    },
    /**
     * Defines if the modal is active or not.
     */
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
  },
  data() {
    return {
      shown: false,
    }
  },
  computed: {
    alertMessage() {
      return this.messageKey ? this.$t(this.messageKey) : ''
    },
    nonModalMessage() {
      return this.alertMessage
    },
    mustShow() {
      return this.mustShowAlert(this.value)
    },
  },
  watch: {
    value() {
      this.checkShow()
    },
  },
  mounted() {
    this.checkShow()
  },
  methods: {
    checkShow() {
      if (this.mustShowAlert(this.value)) {
        this.shown = false
        this.open()
      }
    },
    mustShowAlert(value) {
      return this.showCondition()
    },
    accept() {
      this.shown = true
      this.$refs.modal.close()
      this.$emit('message-accepted', true)
    },
    open() {
      if (!this.shown && this.active) {
        this.$refs.modal.open()
      }
    },
    close() {
      this.$refs.modal.close()
    },
  },
}
</script>
