<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
import FileTypes from '~/assets/js/iris2/model/FileTypes.js'

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
  computed: {
    label() {
      return this.$t(FileTypes[this.data[this.column]])
    },
  },
}
</script>
