<template>
  <sweet-modal
    ref="deleteConfirm"
    :alt="$t('delete_confirm_title')"
    aria-describedby="modalDescription"
    icon="warning"
    role="alertdialog"
    @close="resetError"
  >
    <p id="modalDescription">{{ $t(modalTextKey) }}</p>
    <p
      v-if="errorMessage"
      class="alert alert-danger"
    >
      {{ errorMessage }}
    </p>
    <button
      slot="button"
      class="btn btn-light"
      @click="onDelete"
    >
      {{ $t('delete_confirm_ok') }}
    </button>
    <button
      slot="button"
      class="btn btn-primary"
      autofocus
      @click="close"
    >
      <font-awesome-icon icon="sign-out-alt" />
      {{ $t('delete_confirm_cancel') }}
    </button>
  </sweet-modal>
</template>

<script>
import { isResponseClass } from '~/assets/js/helpers'

export default {
  name: 'DeleteConfirm',
  props: {
    url: {
      type: String,
      default: '',
    },
    modalTextKey: {
      type: String,
      default: 'delete_confirm_object',
    },
  },
  data: function() {
    return {
      errorMessage: null,
    }
  },
  methods: {
    onDelete(next) {
      this.performDeleteRequest(this.url)
    },
    open(next) {
      this.$refs.deleteConfirm.open()
    },
    close() {
      this.$refs.deleteConfirm.close()
    },
    resetError() {
      this.errorMessage = null
    },
    onError(res, filterData) {
      this.$emit('on-error', res)
      this.errorMessage = isResponseClass(res.status, 400)
        ? res.data
        : this.$t('delete_error_generic')
    },
    performDeleteRequest(url) {
      return this.$axios
        .delete(this.url)
        .then(res => {
          this.$emit('on-deleted')
          this.errorMessage = null
          return {
            data: res.data,
          }
        })
        .catch(e => {
          this.onError(e.response)
        })
    },
  },
}
</script>

<style>
.sweet-buttons .btn {
  margin-left: 5px;
}
</style>
