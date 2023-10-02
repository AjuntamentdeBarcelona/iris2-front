<template>
  <div
    v-if="loading"
    class="loading loading-wrapper">
    <div class="loading-content">
      <figure class="badge-wrapper">
        <badged class="badgeColor"/>
      </figure>
      <div class="loading-ring">
        <span/>
        <span/>
        <span/>
        <span/>
      </div>
    </div>


  </div>
</template>

<script>
import Badged from '~/components/icons/Badged.vue'

export default {
  components: {
    Badged,
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>

<style lang="scss">
$iconSize: 100px;
$spinner: 70px;
.loading-wrapper {
  position: fixed;
  background-color: rgba($gray-900, 0.8);
  height: 100vh;
  width: 100vw;
  // Bring it to the front
  z-index: 99999999;
}
.loading-content {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.badge-wrapper {
  position: relative;
  background-color: $primary;
  width: $iconSize;
  height: $iconSize;
  margin: 0 auto;
  padding: $iconSize/4.5;
  border-radius: $iconSize;
  box-shadow: 0px 5px 20px 0px rgba($black, 0.75);
  .logo-escut {
    height: 50px;
    width: 50px;
    margin-top: 5px;
  }
}
.badgeColor {
  fill: white;
  transform: translateY(-12%);
}

.loading-ring {
  display: block;
  position: relative;
  margin: 3rem auto;
  width: $spinner;
  height: $spinner;
  span {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: $spinner;
    height: $spinner;
    margin: 6px;
    border: 6px solid $white;
    border-radius: 50%;
    animation: loadring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: $white transparent transparent transparent;
    &:nth-child(1) {
      animation-delay: -0.45s;
    }
    &:nth-child(2) {
      animation-delay: -0.3s;
    }
    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
}

@keyframes loadring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
