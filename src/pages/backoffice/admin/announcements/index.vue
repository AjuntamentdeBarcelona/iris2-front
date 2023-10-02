<script>
import TableList from '~/components/pages/list/table.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import FilteredList from '~/components/pages/list/FilteredList.vue'
import DateColumn from '~/components/pages/list/columns/DateColumn.vue'
import BooleanColumn from '~/components/pages/list/columns/BooleanColumn'
import { validators } from 'vue-form-generator'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'FilteredAnnouncementList',
  extends: FilteredList,
  props: {
    filterFormDefinition: {
      type: [Object, Function],
      default: () => getFilterFormDefinition,
    },
    listComponent: {
      type: Object,
      default: () => AnnouncementList,
    },
    title: {
      type: String,
      default: 'announcements',
    },
  },
}

function getFilterFormDefinition(vm) {
  const dateField = {
    type: 'pikaday',
    format: 'DD/MM/YYYY',
    placeholder: vm.$t('select_a_date'),
    pikadayOptions: {
      format: 'DD/MM/YYYY',
    },
    styleClasses: 'col-lg-3',
    validator: validators.date,
  }

  const filterFormDefinition = new FormDefinition(
    {
      created_at__gte: {
        ...dateField,
        label: vm.$t('created_at') + ' ' + vm.$t('from'),
      },
      created_at__lte: {
        ...dateField,
        label: vm.$t('created_at') + ' ' + vm.$t('to'),
      },
      expiration_date__gte: {
        ...dateField,
        label: vm.$t('announcement_end_date') + ' ' + vm.$t('from'),
      },
      expiration_date__lte: {
        ...dateField,
        label: vm.$t('announcement_end_date') + ' ' + vm.$t('to'),
      },
    },
    {
      groups: [
        {
          fields: [
            'created_at__gte',
            'created_at__lte',
            'expiration_date__gte',
            'expiration_date__lte',
          ],
        },
      ],
    }
  )
  return filterFormDefinition
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
const AnnouncementList = {
  name: 'AnnouncementList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/masters/announcements/',
    },
    title: {
      type: String,
      default: 'announcements',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.announcement',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ANNOUNCEMENT,
    },
  },
  data() {
    return {
      columns: ['title', 'description', 'expiration_date', 'important'],
      addUrl: {
        name: 'backoffice-admin-announcements-add',
      },
      detailUrl: {
        name: 'backoffice-admin-announcements-id',
      },
      options: {
        perPage: 30,
        sortable: ['title', 'description', 'expiration_date', 'important'],
        templates: {
          expiration_date: DateColumn,
          important: BooleanColumn,
        },
        headings: {
          title: this.$t('announcement_title'),
          description: this.$t('announcement_description'),
          expiration_date: this.$t('announcement_expiration'),
          important: this.$t('announcement_important'),
        },
      },
    }
  },
}
</script>
