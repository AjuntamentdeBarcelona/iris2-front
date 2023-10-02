import _ from 'lodash'

export default {
  ROUTE_TITLES: {
    'backoffice-tasks': 'record_card_pending_validation',
    'backoffice-tasks-progress': 'record_card_my_tasks',
    'backoffice-records': 'record_cards',
  },
  getBreadCrumb(vm, isEdit = false) {
    const { $router, $route } = vm
    let text = vm.$t('record_cards'),
      urlName = 'backoffice-tasks'
    if ($route.query.fromList) {
      const resolve = $router.resolve($route.query.fromList)
      if (_.get(resolve, 'route.name', null)) {
        // Remove the language part
        urlName = resolve.route.name.split('__')[0]
        text = vm.$t(_.get(this.ROUTE_TITLES, urlName, 'record_cards'))
      }
    }

    let breadcrumb = [
      {
        text: text,
        to: vm.localePath({ name: urlName }),
      },
      {
        text: `${vm.$t('record_card')} ${vm.recordId || $route.params.id} `,
        to: isEdit
          ? vm.localePath({ ...$route, name: 'backoffice-records-id' })
          : '#',
      },
    ]
    if (isEdit) {
      return [
        ...breadcrumb,
        {
          text: `${vm.$t('edit')} ${vm.$t('record_card')} ${vm.recordId ||
            $route.params.id} `,
          href: '#',
        },
      ]
    }
    return breadcrumb
  },
}
