<template>
  <span 
    v-b-popover.hover="popover"
    :class="badgeClass"
    class="badge">{{ label }}</span>
</template>


<script>
export default {
  name: 'BatchStatus',
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
  computed: {
    success() {
      return this.data[this.column] == 'SUCCESS'
    },
    badgeClass() {
      return this.success ? 'badge-success' : 'badge-danger'
    },
    label() {
      return this.success ? this.$t('batch_success') : this.$t('batch_error')
    },
    popover() {
      return `
        args="${this.data.task_args}",
        kwargs="${this.data.task_kwargs}",
        date_done="${this.data.date_done}",
        meta="${this.data.meta}",
      `
    },
  },
}
</script>
