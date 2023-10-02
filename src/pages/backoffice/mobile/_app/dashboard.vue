<template>
  <div class="h-100">
    <div class="mobile-side-btn">
      <nuxt-link
        :to="addPath"
        :alt="$t('gub_add_issue')"
        class="btn-mobile btn-danger">
        <font-awesome-icon
          :icon="['fas', 'plus']"/>
      </nuxt-link>
    </div>
    <div class="col-12">
      <group-selector classes="pt-1 pb-1 w-100" />
    </div>
    <!-- Announcements -->
    <announcement :show-opinion="false" />
  </div>
</template>

<script>
import Announcement from '~/components/iris-pages/admin/Announcements.vue'
import GroupSelector from '~/components/iris-pages/groups/GroupSelector.vue'

export default {
  name: 'Dashboard',
  layout: 'mobile',
  components: {
    Announcement,
    GroupSelector,
  },
  computed: {
    addPath() {
      return this.localePath({
        name: 'backoffice-mobile-app-add',
        params: { app: this.$route.params.app },
      })
    },
  },
}
</script>
