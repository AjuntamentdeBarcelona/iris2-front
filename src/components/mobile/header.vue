<template>
  <div
    class="bg-primary text-white px-2 py-1 d-flex align-items-center"
  >
    <font-awesome-icon
      :icon="['fas', 'bars']"
      class="mr-2"/>
    <div class="font-weight-bolder">
      Alta
    </div>
    <font-awesome-icon
      :icon="['fas', 'ellipsis-v']"
      class="ml-auto"/>
  </div>
</template>

<script>
export default {
  name: 'MobileHeader',
}
</script>

<style lang="scss">
</style>
