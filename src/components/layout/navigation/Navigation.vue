<template>
  <div>
    <router-link
      v-for="(route, index) in routes"
      :to="route.routerLinkOps"
      :key="index"
      class="nav-link">
      <i
        :class="[route.icon]"
        class="fa" />
      <span>{{ route.title }}</span>
      <div
        v-for="(subRoute, index) in route.children"
        :key="index"
        class="children">
        <nuxt-link :to="localePath(subRoute.routerLinkOps)" />
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style>
</style>
