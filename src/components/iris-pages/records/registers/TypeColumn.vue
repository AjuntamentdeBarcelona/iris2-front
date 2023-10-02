<template>
  <span 
    :class="badge" 
    class="badge badge-md">
    {{ label }}
  </span>
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
    column: {
      type: String,
      default: '',
    },
  },
  computed: {
    value() {
      return this.data[this.column]
    },
    label() {
      return this.data.applicant_type == 'P'
        ? this.$t('citizen')
        : this.$t('social_entity')
    },
    badge() {
      return this.data.applicant_type == 'P' ? 'badge-primary' : 'badge-success'
    },
  },
}
</script>

<style scoped>
span {
  font-size: 12px;
  min-width: 90%;
}
</style>
