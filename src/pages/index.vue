<template>
  <div>
    <div
      class="loading-overlay"
    >
      <div class="loader" />
    </div>
  </div>  
</template>

<script>
export default {
  mounted() {
    this.$router.push(this.localePath({ name: 'backoffice-dashboard' }))
  },
}
</script>
