<template>
  <div>
    <b-button
      v-if="isAuthorized"
      :disabled="false"
      variant="secondary"
      @click="openModal">
      <slot>
        <font-awesome-icon
          :icon="['fas', 'file-alt']"/>
        {{ $t('record_card_claim_create') }}
      </slot>
    </b-button>

    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="modal"
        :alt="$t('record_card_claim_create')"
        role="alertdialog">
        <record-claim-start
          v-if="opened"
          :record="recordCard"
          @claim-ready="claimReady" />
      </sweet-modal>
    </MountingPortal>
  </div>
</template>

<script>
import bButton from 'bootstrap-vue/es/components/button/button'
import RecordClaimStart from '~/components/iris-pages/records/RecordClaimStart.vue'
import { get } from 'lodash'

export default {
  name: 'RecordClaimAction',
  components: { bButton, RecordClaimStart },
  props: {
    recordCard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      opened: false,
    }
  },
  computed: {
    isAuthorized() {
      return (
        get(this.recordCard, 'actions.claim.check_url', false) &&
        get(this.recordCard, 'actions.claim.has_permission', false)
      )
    },
  },
  methods: {
    claimReady() {
      this.opened = false
      this.$refs.modal.close()
      this.$emit('claim-ready'), []
    },
    openModal() {
      this.opened = true
      this.$refs.modal.open()
    },
  },
}
</script>
