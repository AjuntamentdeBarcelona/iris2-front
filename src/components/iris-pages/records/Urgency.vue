<template>
  <div>
    <toggle-button
      :value="value"
      :sync="true"
      :disabled="disabled"
      color="#cc0c2f"
      type="checkbox"
      @change="setUrgency"
    />
    {{ $t('record_card_set_urgent') }}
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="retryUrgency"
        :alt="$t('record_card_set_urgent_error')"
        icon="error"
        aria-describedby="modalDescription"
        role="alertdialog"
      >
        <p id="modalDescription">{{ $t('record_card_set_urgent_error') }}</p>
        <button
          slot="button"
          class="btn btn-primary"
          @click="close"
        >
          {{ $t('record_card_set_urgent_retry') }}
        </button>
      </sweet-modal>
    </MountingPortal>
  </div>
</template>


<script>
var _ = require('lodash')

/**
 * The RecordUrgency component allows to define whether a component is
 * urgent or not. The interface is bassed on the toggle button used widely in IRIS2.
 *
 * The interface follows the optimistic approach, it toggles the state and sends the
 * request in background. If the request fails, an error is shown to the user.
 *
 * When the urgency is changed, the urgency-changed event is triggered. When there is
 * and error the urgency-set-error is triggered.
 */
export default {
  name: 'RecordUrgency',
  props: {
    record: {
      type: Object,
      required: true,
    },
    retryUrl: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: this.record ? this.record.urgent : null,
      sending: false,
    }
  },
  computed: {
    setUrgencyUrl() {
      return this.record
        ? `/api/record_cards/record_cards/${this.record.id}/toogle-urgency/`
        : null
    },
  },
  created() {
    this.debouncedSendRequest = _.debounce(this.sendRequest, 500)
  },
  methods: {
    setUrgency() {
      this.value = !this.value
      this.debouncedSendRequest()
    },
    sendRequest() {
      this.sending = true
      const sentData = {
        urgent: this.value,
        id: this.record.id,
      }
      this.$axios
        .patch(this.setUrgencyUrl, sentData)
        .then(resp => {
          this.$notify({
            group: 'iris',
            title: this.$t('record_card_set_urgent_ok'),
            type: 'success',
            text: '',
          })
          this.valueChanged()
        })
        .catch(error => {
          this.value = !sentData.urgent
          this.valueSetError()
          this.retry()
        })
        .then(() => {
          this.sending = false
        })
    },
    retry() {
      if (this.$refs.retryUrgency) {
        this.$refs.retryUrgency.open()
      } else {
        this.$notify({
          group: 'iris',
          title: this.$t('record_card_set_urgent_error'),
          type: 'error',
          text: `${this.$t('record_card_code')} ${this.record.id}`,
        })
      }
    },
    goBack() {
      this.router.push({
        ...this.retryUrl,
        ...{ params: { id: this.record.id } },
      })
      this.$refs.retryUrgency.close()
    },
    valueChanged() {
      this.$emit('value-changed', this.record, this.value)
    },
    valueSetError() {
      this.$emit('value-set-error', this.record, this.value)
    },
    close() {
      this.$refs.retryUrgency.close()
    },
  },
}
</script>
