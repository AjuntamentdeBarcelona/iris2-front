<script>
import NestedNav from '~/components/pages/NestedNav.vue'

export default {
  name: 'Records',
  layout: 'backoffice',
  extends: NestedNav,
  methods: {
    getNavigation() {
      return [
        {
          title: 'navigation_area',
          routerLinkOps: {
            name: 'backoffice-admin-records-theme',
          },
          children: [],
        },
        {
          title: 'navigation_protocol',
          routerLinkOps: {
            name: 'backoffice-admin-records-protocols',
          },
          children: [],
        },
        {
          title: 'navigation_input_channels',
          routerLinkOps: {
            name: 'backoffice-admin-records-input-channels',
          },
          children: [],
        },
        {
          title: 'navigation_supports',
          routerLinkOps: {
            name: 'backoffice-admin-records-supports',
          },
          children: [],
        },

        {
          title: 'navigation_values_list',
          routerLinkOps: {
            name: 'backoffice-admin-records-values-lists',
          },
          children: [],
        },
        {
          title: 'navigation_attributes',
          routerLinkOps: {
            name: 'backoffice-admin-records-attributes',
          },
          children: [],
        },
        {
          title: 'navigation_templates',
          routerLinkOps: {
            name: 'backoffice-admin-records-templates',
          },
          children: [],
        },
        {
          title: 'navigation_applicant_type',
          routerLinkOps: {
            name: 'backoffice-admin-records-applicant-types',
          },
          children: [],
        },
        {
          title: 'navigation_theme_groups',
          routerLinkOps: {
            name: 'backoffice-admin-records-masters-type',
            params: {
              type: 'theme_groups',
            },
          },
          children: [],
        },
        {
          title: 'navigation_communication_medias',
          routerLinkOps: {
            name: 'backoffice-admin-records-communication_medias',
            params: {
              type: 'communication_medias',
            },
          },
          children: [],
        },
        {
          title: 'navigation_report_invalid_mail',
          routerLinkOps: {
            name: 'backoffice-admin-records-report_invalid_email',
          },
          children: [],
        },
      ]
    },
  },
}
</script>
