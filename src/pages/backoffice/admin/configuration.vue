<template>
  <div class="config-container">
    <horizontal-nav
      v-if="showNav"
      :routes="navigation" />
    <ConfigurationEdit
      :request-config="requestConfig"
      :success-url="successUrl"
      :empty-loading-def="true" />
  </div>
</template>

<script>
import ConfigurationEdit from '~/components/iris-pages/admin/ConfigurationEdit.vue'
import HorizontalNav from '~/components/layout/navigation/HorizontalNav.vue'
import Parameters from '~/assets/js/iris2/model/Parameters.js'

export default {
  name: 'ConfigurationPage',
  layout: 'backoffice',
  components: {
    ConfigurationEdit,
    HorizontalNav,
    Parameters,
  },
  props: {
    category: {
      type: Number,
      required: false,
      default: null,
    },
    showNav: {
      type: Boolean,
      required: false,
      default: true,
    },
    successUrlRoute: {
      type: Object,
      required: false,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      navigation: this.getNavigation(),
    }
  },
  computed: {
    appliedCategory() {
      return this.category ? this.category : this.$route.query.category
    },
    requestConfig() {
      return this.appliedCategory
        ? { params: { category: this.appliedCategory, page_size: 200 } }
        : { params: { page_size: 200 } }
    },
    successUrl() {
      if (this.successUrlRoute) {
        return this.successUrlRoute
      }
      return {
        name: 'backoffice-admin-configuration',
        query: {
          category: this.appliedCategory,
        },
      }
    },
  },
  methods: {
    getNavigation() {
      return [
        {
          title: Parameters.CATEGORY_CREATE.title,
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_CREATE.id,
            },
          },
        },
        {
          title: 'config_admin_management',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_MANAGEMENT.id,
            },
          },
        },
        {
          title: 'config_admin_records',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_RECORDS.id,
            },
          },
        },
        {
          title: 'config_admin_web',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_WEB.id,
            },
          },
        },
        {
          title: 'config_admin_reports',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_REPORT.id,
            },
          },
        },
        {
          title: 'config_admin_integration',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_INTEGRATION.id,
            },
          },
        },
        {
          title: 'config_admin_communications',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_TEMPLATES.id,
            },
          },
        },
        {
          title: 'config_admin_dev',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
            query: {
              category: Parameters.CATEGORY_DEV.id,
            },
          },
        },
        {
          title: 'config_admin_others',
          icon: 'plus',
          children: [],
          routerLinkOps: {
            name: 'backoffice-admin-configuration',
          },
        },
      ]
    },
  },
}
</script>
