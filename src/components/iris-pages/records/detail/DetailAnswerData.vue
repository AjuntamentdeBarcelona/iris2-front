<template>
  <div class="cardi__card">
    <div class="cardi__title">
      {{ isNone || !channel ? $t('response_channel') : channel.description }}
    </div>
    <div class="cardi__description">
      {{ destination }}
    </div>
  </div>
</template>

<script>
import { EMAIL, NONE, TELEPHONE, LETTER, SMS } from '../AnswerConfig.vue'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'

/**
 * Given a recordcardresponse, returns the letter destination
 */
export function getLetterDestination(rr) {
  const floor = rr.floor ? `${this.$t('Floor')}: ${rr.floor}, ` : ''
  const door = rr.door ? `${this.$t('Door')}: ${rr.door}, ` : ''
  const stair = rr.stair ? `${this.$t('stair')}: ${rr.stair}, ` : ''

  return (
    `${rr.via_type} ${rr.address_mobile_email}, nº ${rr.number}. ` +
    `${floor}${door}${stair}` +
    `${rr.postal_code}, ${rr.municipality} (${rr.province})`
  )
}

export default {
  name: 'DetailAnswerData',
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  computed: {
    channelId() {
      if (!this.record.recordcardresponse) {
        return NONE
      }
      return this.record.recordcardresponse.response_channel
    },
    isNone() {
      return this.channelId == NONE
    },
    channel() {
      return ResponseChannel.getAll(this).find(
        item => this.channelId == item.id
      )
    },
    destination() {
      return this.isNone
        ? this.$t('none')
        : this.channelId != LETTER
          ? this.record.recordcardresponse.address_mobile_email
          : getLetterDestination.call(this, this.record.recordcardresponse)
    },
  },
}
</script>
