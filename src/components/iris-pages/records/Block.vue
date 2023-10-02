<template>
  <div class="toggle">
    <blocked-alert
      v-if="blockedByOtherUser"
      :user="blocked.user_id"
      class="toggle__item"/>
    <confirm
      ref="confirm"
      @accept="setNextCheck()" />
  </div>
</template>

<script>
import BlockedAlert from '~/components/iris-pages/records/BlockedAlert'
import Confirm from '~/components/pages/form/Confirm.vue'
import moment from 'moment'
var _ = require('lodash')

/**
 * Allows blocking and unblocking RecordCards, or shows if another user has blocked it
 * When a user enters into a record card sets the block in order to inform other users that
 * this record is work in progress. Every x minutes the user receive an advice and can refresh
 * the block for another ten minutes.
 */
export default {
  components: {
    BlockedAlert,
    Confirm,
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: this.record.blocked ? this.record.blocked.blocked : null,
      sending: false,
      nextBlockTime: null,
    }
  },
  computed: {
    blocked() {
      return this.record.blocked
    },
    /**
     * Time margin in seconds before showing an alert of losing block.
     */
    lostBlockAlertTime() {
      return 60 * 1000
    },
    blockedUntil() {
      return moment(_.get(this.blocked, 'expire_time', moment()))
    },
    isBlocked() {
      return this.blockedUntil > moment()
    },
    blockedByOtherUser() {
      return (
        this.isBlocked &&
        _.get(this.blocked, 'user_id', '').toUpperCase() !==
          this.$auth.$state.user.toUpperCase()
      )
    },
    setBlockUrl() {
      return _.get(this.record, 'actions.set-block.action_url', null)
    },
  },
  watch: {
    blocked: {
      handler() {
        if (!this.isBlocked) {
          this.sendRequest()
        } else if (!this.blockedByOtherUser) {
          this.setNextCheck()
        }
      },
      immediate: true,
    },
  },
  created() {
    this.debouncedSendRequest = _.debounce(this.sendRequest, 400)
  },
  methods: {
    setBlock() {
      this.value = !this.value
      this.debouncedSendRequest()
    },
    sendRequest() {
      this.sending = true

      const sentData = {
        block: this.value,
        id: this.record.id,
      }

      this.$axios
        .post(this.setBlockUrl, sentData)
        .then(resp => {
          Object.assign(this.record, { blocked: resp.data })
        })
        .catch(error => {
          if (error.response.status == 409) {
            Object.assign(this.record, { blocked: error.response.data })
          } else {
            this.valueSetError()
          }
        })
        .then(() => {
          this.sending = false
        })
    },
    confirmNextCheck() {
      if (!this.$refs.confirm) {
        return
      }
      this.$refs.confirm.open(
        this.$t('record_card_block'),
        this.$t('record_card_confirm_block'),
        () => {},
        null,
        this.$t('record_card_block')
      )
    },
    valueSetError() {
      if (!this.$refs.confirm) {
        return
      }
      this.$notify({
        group: 'iris',
        title: '',
        type: 'error',
        text: this.$t('record_card_blocked_error'),
      })
    },
    setNextCheck() {
      this.nextBlockTime = this.getNextBlockTime()
      if (this.nextBlockTime < 0 && !this.sending) {
        this.sendRequest()
      } else {
        setTimeout(() => {
          this.nextBlockTime = null
          if (!this.sending) {
            this.confirmNextCheck()
          }
        }, this.nextBlockTime)
      }
    },
    /**
     * Given a block time, returns the moment the next timeout will be called.
     */
    getNextBlockTime() {
      return (
        this.blockedUntil.diff(moment(), 'seconds') * 1000 -
        this.lostBlockAlertTime
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle {
  display: flex;
  flex-direction: row;
  &__item {
    padding-left: 5px;
    // /deep/ span.text-danger {
    //   color: black !important;
    // }
  }
}
</style>
