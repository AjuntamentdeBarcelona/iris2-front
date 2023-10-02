<template>
  <div
    :class="{'show-content': inputVisible}"
    class="insert-comment">
    <slot/>
    <span
      v-if="!btnDown && !inputVisible"
      class="d-flex py-0 flex-nowrap align-items-center form-group">
      <span
        class="overflow-hidden">
        <button
          v-if="!alwaysVisible"
          ref="cancelButton"
          class="btn btn-danger ml-1 btn-sm"
          @click.prevent="cancel"
        >
          <font-awesome-icon
            :icon="['fas', 'trash']"/>
          {{ $t('delete_confirm_ok') }}
        </button>
      </span>
      <button
        :disabled="sending || (inputVisible && !trimmedComment)"
        class="btn btn-primary ml-1 my-1 btn-sm"
        @click.prevent="cycleShowInsert"
      >
        <font-awesome-icon
          :icon="['far', 'comment']"/>
        {{ $t('insert_comment') }}
      </button>
    </span>

    <div
      class="row form-group overflow-hidden insert-comment__textarea">
      <textarea
        ref="commentInput"
        v-model="comment"
        :placeholder="$t('comment')"
        class="form-control"
        rows="5"
      />
    </div>
    <span
      v-if="btnDown || inputVisible"
      class="d-flex py-0 flex-nowrap align-items-center form-group">
      <span
        class="overflow-hidden">
        <button
          v-if="!alwaysVisible"
          ref="cancelButton"
          class="btn btn-danger ml-1 btn-sm"
          @click.prevent="cancel"
        >
          <font-awesome-icon
            :icon="['fa', 'trash']"/>
          {{ $t('delete_confirm_ok') }}
        </button>
      </span>
      <button
        :disabled="sending || (inputVisible && !trimmedComment)"
        class="btn btn-primary ml-1 my-1 btn-sm"
        @click.prevent="cycleShowInsert"
      >
        <font-awesome-icon
          :icon="['far', 'save']"/>
        {{ $t('save_comment') }}
      </button>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    btnDown: {
      type: Boolean,
      default: false,
    },
    recordCard: {
      type: Number,
      required: true,
    },
    reasonId: {
      type: Number,
      required: false,
      default: () => null,
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/add-comment/',
      required: false,
    },
    /**
     * If true, the input will be always opened an available.
     */
    alwaysVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      comment: '',
      sending: false,
      inputVisible: this.alwaysVisible,
    }
  },
  computed: {
    trimmedComment() {
      return this.comment.trim()
    },
  },
  methods: {
    getUrl() {
      return this.url
    },
    cycleShowInsert() {
      this.inputVisible ? this.insertComment() : this.showInput()
    },
    cancel() {
      this.comment = ''
      this.hideInput()
    },
    hideInput() {
      if (this.alwaysVisible) {
        return
      }
      this.inputVisible = false
      this.$refs.cancelButton.blur()
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() =>
        this.$refs.commentInput.focus({ preventScroll: true })
      )
    },
    insertComment() {
      if (this.trimmedComment) {
        this.performRequest(this.getUrl(), this.trimmedComment)
      } else {
        this.sendErrorMessage('record_card_insert_comment_empty')
      }
    },
    successActions(comment) {
      this.sendSuccessMessage()
      this.comment = ''
      this.$refs.commentInput.blur()
      this.inputVisible = false
      this.$emit('new-comment', comment)
    },
    errorActions() {
      this.sendErrorMessage('record_card_insert_comment_bad')
    },
    sendSuccessMessage() {
      this.$notify({
        group: 'iris',
        title: this.$t('record_card_insert_comment_ok'),
        type: 'success',
        text: '',
      })
    },
    sendErrorMessage(message) {
      this.$notify({
        group: 'iris',
        title: this.$t(message),
        type: 'error',
        text: '',
      })
      this.$nextTick(() =>
        this.$refs.commentInput.focus({ preventScroll: true })
      )
    },
    performRequest(url, comment) {
      this.sending = true
      const sentData = {
        comment: comment,
        record_card: this.recordCard,
        reason: this.reasonId,
      }

      this.$axios
        .post(url, sentData)
        .then(resp => {
          if (200 <= resp.request.status < 300) {
            this.successActions({ ...resp.data })
          } else {
            this.errorActions()
          }
        })
        .catch(error => {
          this.errorActions()
        })
        .then(() => {
          this.sending = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.insert-comment {
  flex: 0 1 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  @include media-breakpoint-down(md) {
    margin-top: 0;
  }
  .btn-danger {
    transform: translateX(120%);
  }
  &__textarea {
    padding: 0;
    margin-right: 0;
    flex: 0 1 100%;
    transition: 0.7s ease-in-out;
    max-height: 0;
    textarea {
      margin: 0.5rem 0;
      transition: 0.7s ease-in-out;
      transform: translateY(-100%);
    }
  }

  &.show-content {
    .btn-danger {
      transform: translateX(0);
    }
    .insert-comment__textarea {
      max-height: 100vh;
      textarea {
        height: 10rem;
        transform: translateY(0);
      }
    }
  }
}
</style>
