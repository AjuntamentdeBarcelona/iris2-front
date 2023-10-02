<template>
  <span>{{ dateStr }}</span>
</template>


<script>
import { dateTime } from '~/assets/js/helpers.js'

export default {
  name: 'DateTimeColumn',
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
    dateStr() {
      if (!this.data[this.column]) {
        return '-'
      }
      try {
        return dateTime(this.data[this.column])
      } catch (e) {
        return '-'
      }
    },
  },
}
</script>
