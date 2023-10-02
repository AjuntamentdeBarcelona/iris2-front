<template>
  <span 
    :class="badgeClass"
    class="badge">{{ data[column] }}</span>
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
    badgeClass() {
      return {
        c: 'badge-primary',
        s: 'badge-warning',
        e: 'badge-danger',
        r: 'badge-success',
      }[this.data['status']]
    },
  },
}
</script>
