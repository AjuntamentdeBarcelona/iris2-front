<template>
  <div>
    <horizontal-nav
      :routes="navigation"
      :active-sub-menus="true"
      active-class="active"
    />

    <div class="right">
      <nuxt-child :key="localePath(navigation[0])" />
    </div>
  </div>
</template>

<script>
import HorizontalNav from '~/components/layout/navigation/HorizontalNav.vue'

export default {
  name: 'Test',
  layout: 'backoffice',
  components: {
    HorizontalNav,
  },
  data() {
    return {
      navigation: this.getNavigation(),
    }
  },
  methods: {
    getNavigation() {
      return []
    },
  },
}
</script>
