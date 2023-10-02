<template>
  <div class="d-flex mb-auto ml-auto">
    <!-- Edit button -->
    <b-button
      :title="$t('edit')"
      class="ml-1"
      variant="outline-secondary"
      @click="editModel"
    >
      <font-awesome-icon
        icon="edit"
        size="sm"
      />
      <template
        v-if="buttonsText"
      >
        {{ $t('edit') }}
      </template>
    </b-button>

    <!-- Delete button -->
    <b-button
      :title="$t('delete')"
      class="ml-1"
      variant="outline-danger"
      @click="deleteModel"
    >
      <font-awesome-icon
        icon="trash"
        size="sm"
      />
      <template
        v-if="buttonsText"
      >
        {{ $t('delete') }}
      </template>
    </b-button>
  </div>
</template>

<script>
/**
 * Can work as a regular component or as a column component
 */
export default {
  name: 'EditDeleteButtons',
  props: {
    buttonsText: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object,
      default: undefined,
    },
    data: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    column: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    editModel() {
      this.$emit('edit-model', this.model || this.data)
    },
    deleteModel() {
      this.$emit('delete-model', this.model || this.data)
    },
  },
}
</script>
