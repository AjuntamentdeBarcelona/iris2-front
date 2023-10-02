<template>
  <span
    v-b-popover.hover="disabledDeleteMessage"
    :disabled="canDelete"
    variant="outline-success"
  >
    <b-button
      :disabled="!canDelete"
      variant="outline-danger"
      @click="onDelete()"
    >
      <font-awesome-icon icon="trash" />
    </b-button>
    <delete-confirm
      ref="deleteConfirm"
      :url="deleteUrl"
      @on-deleted="onDeleted"
    />
  </span>
</template>

<script>
import DeleteConfirm from '~/components/pages/list/DeleteConfirm.vue'

export default {
  name: 'DeleteButton',
  components: {
    DeleteConfirm,
  },
  props: {
    object: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    idAttribute: {
      type: String,
      default: 'id',
    },
    disabledDeleteKey: {
      type: String,
      default: 'delete_related_message',
    },
  },
  data() {
    return {
      delSuccessMessageTitle: this.$t('delete_success_title'),
      delSuccessMessage: this.$t('delete_success_message'),
      disabledDeleteMessage: this.$t(this.disabledDeleteKey),
    }
  },
  computed: {
    id() {
      return this.object[this.idAttribute]
    },
    deleteUrl() {
      return `${this.url}/${this.id}/`.replace('//', '/')
    },
    canDelete() {
      return this.object.can_delete
    },
  },
  methods: {
    onDelete() {
      this.$refs.deleteConfirm.open()
    },
    onDeleted() {
      this.$refs.deleteConfirm.close()
      this.showDeletedMessage()
      this.$emit('deleted', this.object)
    },
    showDeletedMessage() {
      this.$notify({
        group: 'iris',
        title: this.delSuccessMessageTitle,
        type: 'error',
        text: this.delSuccessMessage,
      })
    },
  },
}
</script>
