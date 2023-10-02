<template>
  <div>
    <span class="text-danger">{{ message }}</span>
    <sweet-modal
      ref="modal"
      :alt="$t('alert')"
      hide-close-button
      aria-describedby="modalDescription"
      icon="warning"
      role="alertdialog"
    >
      <p id="modalDescription">{{ message }}</p>
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
import { mapState } from 'vuex'
/**
 * On RecordCard creation when an immediate esponse ElementDetail is selected, the ANS
 * must be informed to the operator with extra indications about the possibility of
 * giving an Answer even if not mandatory.
 */
export default {
  name: 'AnswerConfirmAns',
  props: {
    elementDetailId: {
      type: Number,
      default: null,
    },
    ans: {
      type: Number,
      default: null,
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
    message() {
      const days = `${this.ansDays} ${this.$t('days')}`
      const hours = `${this.ansHours} ${this.$t('hours')}`
      return this.$t('record_card_inmediate_answer_info', {
        user: this.user,
        ans_days: [
          ...(this.ansDays > 0 ? [days] : []),
          ...(this.ansHours > 0 ? [hours] : []),
        ].join(` ${this.$t('and')} `),
      })
    },
    ansDays() {
      return Math.floor(this.ans / 24)
    },
    ansHours() {
      return this.ans % 24
    },
    ...mapState({ user: state => state.auth.user }),
  },
  watch: {
    elementDetailId() {
      this.shown = false
      this.$emit('ans-message-accepted', false)
      this.open()
    },
    active() {
      if (this.active) {
        this.open()
      }
    },
  },
  mounted() {
    this.open()
  },
  methods: {
    accept() {
      this.shown = true
      this.$refs.modal.close()
      this.$emit('ans-message-accepted', true)
    },
    open() {
      if (!this.shown && this.active && this.elementDetailId) {
        this.$refs.modal.open()
      }
    },
    close() {
      this.$refs.modal.close()
    },
  },
}
</script>
