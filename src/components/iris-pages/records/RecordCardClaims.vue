<template>
  <div class="claim-list">
    <slot
      v-for="recordLink in recordIds"
      :record-id="recordLink">
      <template v-if="recordLink.active">
        <!-- Add element detail decription to the title -->
        <strong
          :key="recordLink.normalized_record_id"
          :title="recordLink.description">#{{ recordLink.normalized_record_id }}</strong>
      </template>
      <nuxt-link
        v-else
        :to="recordLink.detailUrl"
      >
        #{{ recordLink.normalized_record_id }}
      </nuxt-link>
    </slot>
  </div>
</template>

<script>
import Claim from '~/assets/js/iris2/model/Claim.js'

export default {
  name: 'RecordCardClaims',
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  computed: {
    recordIds() {
      return Claim.getClaimCodes(this.record).map(recordId => {
        return {
          normalized_record_id: recordId,
          active: recordId == this.record.normalized_record_id,
          detailUrl: this.localePath({
            name: 'backoffice-records-id',
            params: { id: recordId },
            query: this.$route.query,
          }),
        }
      })
    },
  },
}
</script>
