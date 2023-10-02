<template>
  <gub-add :app="app" />
</template>


<script>
import GubAdd from '~/components/iris-pages/create/GubAdd.vue'

export default {
  layout: 'mobile',
  components: {
    GubAdd,
  },
  computed: {
    app() {
      return this.$route.params.app
    },
  },
}
</script>
