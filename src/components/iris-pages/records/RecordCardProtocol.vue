<template>
  <div class="protocol-detail">
    <div 
      v-if="!pk && detail && !loadingDetail"
      class="alert alert-info">
      {{ $t('detail_no_protocol') }}
    </div>
    <div 
      v-show="loadingDetail" 
      class="alert alert-info">
      {{ $t('detail_loading') }}
    </div>
    <div 
      v-if="!detail && !loadingDetail"
      class="alert alert-info">
      {{ $t('detail_select_to_protocol') }}
    </div>
    <protocol
      v-if="pk && !loadingDetail" 
      :pk="pk" />
  </div>
</template>


<script>
import Protocol from './Protocol.vue'
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

/**
 * Displays the protocol of given RecordCard.
 */
export default {
  name: 'RecordCardProtocol',
  components: {
    protocol: Protocol,
  },
  props: {
    model: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    /**
     * Obtains the PK from the recordCard
     * @return {String} Protocol pk
     */
    pk() {
      if (this.detail && this.detail.external_protocol_id) {
        return this.detail.external_protocol_id.trim()
      }
    },
    ...mapState('create', {
      detail: 'detail',
      loadingDetail: 'loading',
      detailError: 'error',
    }),
  },
}
</script>
