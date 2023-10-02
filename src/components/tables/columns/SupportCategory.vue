<template>
  <div v-text="category"/>
</template>

<script>
import { supportInfoCategory } from '~/assets/js/iris2/constants'

export default {
  name: 'SupportCategoryColumn',
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
    category() {
      return Object.values(supportInfoCategory(this)).find(
        item => item.id === this.data.category
      ).name
    },
  },
}
</script>
