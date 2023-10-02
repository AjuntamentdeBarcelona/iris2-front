<template>
  <div v-text="resultType"/>
</template>

<script>
import { supportInfoType } from '~/assets/js/iris2/constants'

export default {
  name: 'SupportResultTypeColumn',
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
    resultType() {
      return Object.values(supportInfoType(this)).find(
        element => element.id === this.data.type
      ).name
    },
  },
}
</script>
