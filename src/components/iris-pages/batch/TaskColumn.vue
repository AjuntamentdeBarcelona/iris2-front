<template>
  <span v-b-popover.hover="popover">{{ label }}</span>
</template>


<script>
export default {
  name: 'TaskColumn',
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
    label() {
      return this.data.description
    },
    popover() {
      return `
      ${this.data.task_name},
      code=${this.data.task_id},
      id=${this.data.id}`
    },
  },
}
</script>
