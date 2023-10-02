<template>
  <b-button
    :disabled="loading"
    variant="outline-success"
    @click="onDelete"
  >
    <font-awesome-icon
      :icon="loading ? 'spinner' : 'check' "
      :class="loading ? 'fa-pulse' : ''"
    />
  </b-button>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: null,
    }
  },
  methods: {
    async onDelete() {
      this.loading = true
      let response = null

      try {
        response = await this.markAsRead()
        this.refreshTable()
      } catch (error) {
        this.notifyError(error)
      } finally {
        this.loading = false
      }
    },
    markAsRead() {
      return this.$axios.post(this.data.mark_as_read)
    },
    refreshTable() {
      this.$parent.refresh()
    },
    notifyError(error) {
      this.$notify({
        group: 'iris',
        title: this.$t('delete_error_generic'),
        type: 'error',
        text: '',
      })
    },
  },
}
</script>
