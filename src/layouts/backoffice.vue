<template>
  <div 
    v-if="maintenance" 
    class="wrapper">
    <div class="alert alert-danger">
      <h1>{{ $t('maintenance') }}</h1>
      <h2>{{ maintenance }}</h2>
    </div>
  </div>
  <div
    v-else
    :class="env"
    class="wrapper">
    <iris-header :collapsed="collapsed" />
    <div
      v-if="groupsLoading"
      class="loading-overlay full-page">
      <div class="loader" />
    </div>
    <main
      id="content"
      role="main"
      class="d-flex flex-nowrap"
    >
      {{ $router.base }}
      <side-navigation
        v-if="isReady"
        :routes="routes"
        @collapsed="collapse" />
      <div
        :class="{ sideMenuCollapsed: collapsed}"
        class="main-content">
        <div
          :class="{ contentwrapperCollapsed: collapsed }"
          class="p-3 contentwrapper w-100">
          <slot name="before-content"/>
          <nuxt v-if="isReady" />
          <slot name="after-content"/>
        </div>
        <footer class="main-footer">
          <p>
            Versió {{ VERSION }}.
          </p>
        </footer>
      </div>
    </main>
    <notifications group="iris" />
    <group-error />
    <script
      v-if="issueCollectorEnabled"
      :src="issueCollectorUrl"
      type="text/javascript"
    />
  </div>
</template>

<script>
import IrisHeader from '~/components/layout/IrisHeader.vue'
import SideNavigation from '~/components/layout/navigation/SideNavigation.vue'
import GroupError from '~/components/iris-pages/groups/GroupError.vue'
import iris2Routes from '~/assets/js/iris2/Navigation.js'
import { mapState, mapGetters } from 'vuex'

export default {
  layout: 'backoffice',
  components: {
    IrisHeader,
    SideNavigation,
    GroupError,
  },
  computed: {
    ...mapState({
      issueCollectorEnabled: state => state.config.issueCollectorEnabled,
      issueCollectorUrl: state => state.config.issueCollectorUrl,
      version: state => state.version,
      lastUpdated: state => state.lastUpdated,
      VERSION: state => state.config.VERSION,
      env: state => state.config.env,
      maintenance: state => state.config.maintenance,
    }),
    ...mapState('navigation', {
      collapsed: 'collapse',
    }),
    ...mapState('groups', {
      groupsLoading: state => state.loading,
      groupsReady: state => state.ready,
    }),
    ...mapGetters(['loggedInUser']),
    routes: function() {
      return iris2Routes
    },
    isReady() {
      return this.loggedInUser && !this.groupsLoading && this.groupsReady
    },
  },
  async mounted() {
    const setDefaultLang = localStorage.setDefaultLang === 'true'

    if (!setDefaultLang) {
      // Espera a que se cargue el idioma predeterminado antes de continuar
      await this.$axios
        .$get('/services/iris/api/profiles/profile-preferences/')
        .then(resp => {
          const defaultLocale =
            resp.prefered_language.toLowerCase() ||
            this.$nuxt.$i18n.defaultLocale
          localStorage.setDefaultLang = true
          this.$router.push(this.switchLocalePath(defaultLocale))
        })
        .catch(error => {
          console.error('Error loading default lang: ', error)
        })
    }
  },
  methods: {
    collapse(collapsed) {
      this.collapsed = collapsed
    },
  },
}
</script>
<style lang="scss">
.wrapper {
  overflow-x: hidden;
}
.main-content {
  width: 100%;
  transition: max-width 0.3s linear;
}

.main-content {
  .file-detail {
    .cardi__footer {
      background-color: rgba($gray-100, 1);
      position: fixed;
      max-width: calc(100% - 244px - 4rem);
      width: 100%;
      bottom: 0;
      right: 2rem;
      padding: 0.5rem;
      z-index: 20;
    }
  }
  &.sideMenuCollapsed {
    .file-detail {
      .cardi__footer {
        max-width: calc(100% - 45px - 4rem);
      }
    }
  }
}

// keep .contentwrapper fit within the
// main container (100% - sidebar) collapsed or no
.contentwrapper {
  width: 100%;
  max-width: calc(100vw - 274px);
}
.contentwrapperCollapsed {
  max-width: calc(100vw - 45px);
}
</style>
