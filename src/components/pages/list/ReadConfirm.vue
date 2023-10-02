<template>
  <sweet-modal
    ref="readConfirm"
    :alt="$t('dashboard_confirm_read_title')"
    :title="$t('dashboard_confirm_read_title')"
    icon="info"
    aria-describedby="modalDescription"
    role="alertdialog"
    blocking
  >
    <h3 id="modalDescription">{{ item.title }}</h3>
    <p>{{ item.description }}</p>

    <button
      slot="button"
      class="btn btn-primary"
      autofocus
      @click="markRead()"
    >
      <font-awesome-icon icon="eye" />
      {{ $t('dashboard_confirm_read') }}
    </button>
  </sweet-modal>
</template>

<script>
export default {
  name: 'ReadConfirm',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      url: '/api/masters/announcements/{id}/mark-as-seen/',
      validationErrorTitle: this.$t('dashboard_save_error_title'),
      validationErrorMessage: this.$t('dashboard_save_error_message'),
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    getUrl() {
      return this.url
    },
    getItemId() {
      return this.item.id
    },
    getRequestParams(data) {},
    open() {
      this.$refs.readConfirm.open()
    },
    performRequest(url) {
      this.$axios
        .put(this.url.replace('{id}', this.getItemId()))
        .then(res => {
          this.$refs.readConfirm.close()
        })
        .catch(e => {
          this.$notify({
            group: 'iris',
            title: this.validationErrorTitle,
            type: 'error',
            position: 'top center',
            text: this.validationErrorMessage,
          })
        })
    },
    markRead() {
      this.performRequest(this.getUrl())
    },
  },
}
</script>

<style lang="scss">
.sweet-modal .sweet-title {
  padding-top: 15px;
}

.list-content
  > .sweet-modal-overlay.is-visible
  ~ .sweet-modal-overlay.is-visible {
  background: none;
}
</style>
