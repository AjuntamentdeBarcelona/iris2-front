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
          title: 'batch_admin',
          routerLinkOps: {
            name: 'backoffice-admin-batch-report',
          },
          children: [],
        },
        {
          title: 'batch_validate_title',
          routerLinkOps: {
            name: 'backoffice-admin-batch-validate',
          },
          children: [],
        },
        {
          title: 'batch_manual_next_scheduled',
          routerLinkOps: {
            name: 'backoffice-admin-batch-schedule',
          },
          children: [],
        },
        {
          title: 'batch_manual_next_scheduled_create',
          routerLinkOps: {
            name: 'backoffice-admin-batch-schedule-add',
          },
          children: [],
        },
      ]
    },
  },
}
</script>
