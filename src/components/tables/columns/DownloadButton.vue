<template>
  <a
    :href="data[column]"
    target="_blank"
    class="btn btn-primary"
  >
    <font-awesome-icon
      :icon="['fas', 'download']"/>
  </a>
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
