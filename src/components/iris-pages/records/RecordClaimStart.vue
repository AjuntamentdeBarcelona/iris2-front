<template>
  <div class="claim">
    <loader v-show="loading" />
    <div
      v-if="error"
      class="alert alert-danger">
      {{ $t('record_card_claim_error_try') }}
    </div>
    <div
      v-else-if="!loading && canBeComment"
      class="comment-claim">
      <div class="alert alert-warning row">
        {{ reason }}.
        {{ $t('record_card_claim_can_comment') }}
      </div>
      <div class="row">
        <insert-comment
          :record-card="record.id"
          :reason-id="commentReason"
          :always-visible="true"
          btn-down
          @new-comment="commentClaimCreated"/>
      </div>
    </div>
    <div
      v-else-if="!loading"
      class="alert alert-warning">
      {{ reason }}
    </div>
  </div>
</template>

<script>
import Loader from '~/components/utils/Loader'
import InsertComment from '~/components/iris-pages/records/InsertComment.vue'
import Claim from '~/assets/js/iris2/model/Claim.js'
import _ from 'lodash'

/**
 * Checks if the record card can be claimed.
 * In function of the record state will redirect to the record claim, otherwise it could allow to insert a comment.
 */
export default {
  name: 'RecordClaimStart',
  components: {
    Loader,
    InsertComment,
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checkResult: null,
      loading: false,
      canComment: false,
      error: false,
    }
  },
  computed: {
    canBeComment() {
      return (
        _.get(this.checkResult, '__action__.claim_type', '') ==
        Claim.CLAIM_TYPE_COMMENT
      )
    },
    commentReason() {
      return _.get(this.checkResult, '__action__.reason_comment_id', null)
    },
    reason() {
      return _.get(this.checkResult, '__action__.reason', '')
    },
    checkUrl() {
      return (
        '/api/record_cards/record_cards/' + this.record.id + '/claim/check/'
      )
    },
  },
  created() {
    this.check()
  },
  methods: {
    check() {
      this.loading = true
      this.$axios
        .post(this.checkUrl)
        .then(resp => {
          this.checkResult = resp.data
          this.error = false
          if (_.get(this.checkResult, '__action__.can_confirm', false)) {
            this.goToClaim()
          }
        })
        .catch(e => {
          this.error = true
        })
        .then(() => {
          this.loading = false
        })
    },
    goToClaim() {
      this.$router.push(
        this.localePath({
          name: 'backoffice-create-claim-id',
          params: { id: this.record.normalized_record_id },
        })
      )
    },
    /**
     * Every time a claim comment is created we should pass the event upwards.
     */
    commentClaimCreated() {
      this.$emit('claim-ready')
    },
  },
}
</script>

<style>
.claim .insert-comment {
  margin-top: 0em;
}
</style>
