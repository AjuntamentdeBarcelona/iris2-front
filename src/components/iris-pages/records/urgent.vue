<template>
  <font-awesome-icon
    v-if="data.urgent"
    icon="exclamation"
    class="text-danger mx-1"
  />
  <span
    v-else
    class="mx-1">-</span>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    column: {
      type: String,
      default: '',
    },
  },
}
</script>
