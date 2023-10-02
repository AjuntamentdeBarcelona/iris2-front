<template>
  <span>{{ dateStr }}</span>
</template>


<script>
import { date } from '~/assets/js/helpers'

export default {
  name: 'DateColumn',
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
      return this.data[this.column] ? date(this.data[this.column]) : '-'
    },
  },
}
</script>
