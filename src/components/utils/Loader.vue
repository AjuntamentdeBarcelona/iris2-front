<template>
  <div 
    :class="[minimal ? 'box': 'irisbox']" 
    class="loader">
    <div :class="['loading-overlay', minimal ? 'loading-overlay loading-overlay--minimal': '']">
      <div class="loader" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    minimal: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
div {
  .loader.irisbox {
    width: 100%;
    min-height: 210px;
  }
  .loader.box {
    padding: 0;
    margin: 0;
    border: 1px solid $gray-400;
    background-color: $white;
  }
}

.loading-overlay {
  border-radius: 0;
  &--minimal {
    min-height: initial;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .loader {
      margin: 0;
      font-size: 5px;
    }
    .loader,
    .loader:after {
      width: 6em;
      height: 6em;
    }
  }
}
</style>
