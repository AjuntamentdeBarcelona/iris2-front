<template>
  <b-link
    :href="data[column]"
    target="_blank"
  >{{ filename }}</b-link>
</template>

<script>
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
    filename() {
      return this.data.filename ? this.data.filename : this.$t('download')
    },
  },
}
</script>
