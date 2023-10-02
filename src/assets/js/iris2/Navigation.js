import Permissions from './Permissions.js'

/**
 * IRIS2 navigation tree ready for work with the Navigation components of the project.
 **/
let iris2Routes = [
  {
    title: 'navigation_home',
    icon: 'home',
    children: [],
    routerLinkOps: {
      name: 'backoffice-dashboard',
    },
  },
  {
    title: 'navigation_tasks',
    icon: 'tasks',
    children: [],
    routerLinkOps: {
      name: 'backoffice-tasks',
    },
    permission: Permissions.RECORD.TASK_LIST,
  },
  {
    title: 'navigation_records_create',
    icon: 'plus',
    children: [],
    routerLinkOps: {
      name: 'backoffice-create',
    },
    permission: Permissions.RECORD.CREATE,
  },
  {
    title: 'navigation_records_create_twitter',
    icon: ['fab', 'twitter'],
    children: [],
    routerLinkOps: {
      name: 'backoffice-twitter-create',
    },
    permission: Permissions.RECORD.CREATE_TWITTER,
  },
  {
    title: 'navigation_records',
    icon: 'file-invoice',
    children: [],
    routerLinkOps: {
      name: 'backoffice-records',
    },
    permission: Permissions.RECORD.SEARCH,
  },
  {
    title: 'navigation_reports',
    icon: 'chart-bar',
    children: [],
    routerLinkOps: {
      name: 'backoffice-reports',
    },
    permission: Object.values(Permissions.REPORTS),
  },
  {
    title: 'navigation_support',
    icon: 'life-ring',
    children: [],
    routerLinkOps: {
      name: 'backoffice-support',
    },
  },
  {
    title: 'navigation_profile',
    icon: 'user',
    children: [],
    routerLinkOps: {
      name: 'backoffice-profile',
    },
  },
  {
    title: 'navigation_admin',
    icon: 'cogs',
    routerLinkOps: {
      name: 'backoffice-admin',
    },
    checkChildPermission: true,
    children: [
      {
        title: 'navigation_configuration',
        routerLinkOps: {
          name: 'backoffice-admin-configuration',
          query: { category: 7 },
        },
        children: [],
        permission: Permissions.APP.ADMIN,
      },
      {
        title: 'navigation_record_config',
        routerLinkOps: {
          name: 'backoffice-admin-records-theme',
        },
        children: [],
        permission: Permissions.APP.ADMIN,
      },
      {
        title: 'navigation_access',
        routerLinkOps: {
          name: 'backoffice-admin-access-groups',
        },
        children: [],
        permission: Permissions.APP.ADMIN,
      },
      {
        title: 'navigation_access',
        routerLinkOps: {
          name: 'backoffice-admin-access-users',
        },
        children: [],
        permission: Permissions.APP.ADMIN_USER,
        not_permission: Permissions.APP.ADMIN,
      },
      {
        title: 'navigation_masters',
        routerLinkOps: {
          name: 'backoffice-admin-masters-type',
          params: {
            type: 'cancel-reasons',
          },
        },
        children: [],
        permission: Permissions.APP.ADMIN,
      },
      {
        title: 'navigation_applicant',
        routerLinkOps: {
          name: 'backoffice-admin-applicant',
        },
        children: [],
        permission: Permissions.CITIZEN.DELETE,
      },
      {
        title: 'navigation_announcements',
        routerLinkOps: {
          name: 'backoffice-admin-announcements',
        },
        children: [],
        permission: Permissions.APP.ANNOUNCEMENT,
      },
      {
        title: 'batch_admin',
        routerLinkOps: {
          name: 'backoffice-admin-batch-report',
        },
        children: [],
        permission: Permissions.APP.ADMIN,
      },
    ],
  },
]

export default iris2Routes
