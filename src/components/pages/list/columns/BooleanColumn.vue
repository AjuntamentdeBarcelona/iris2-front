<template>
  <font-awesome-icon
    v-if="value"
    icon="check"
  />
  <span v-else>-</span>
</template>

<script>
export default {
  name: 'BooleanColumn',
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
  computed: {
    value() {
      return this.data[this.column]
    },
  },
}
</script>
