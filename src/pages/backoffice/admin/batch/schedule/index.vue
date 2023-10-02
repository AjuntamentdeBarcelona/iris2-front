<script>
import TableList from '~/components/pages/list/table.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import FilteredList from '~/components/pages/list/FilteredList.vue'
import ScheduledStatus from '~/components/iris-pages/batch/ScheduledStatus.vue'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  name: 'ScheduledTaskList',
  extends: FilteredList,
  mixins: [AdminMixin],
  props: {
    filterFormDefinition: {
      type: [Object, Function],
      default: () => getFilterFormDefinition,
    },
    listComponent: {
      type: Object,
      default: () => ScheduledTaskList,
    },
    title: {
      type: String,
      default: 'batch_manual_log',
    },
  },
}

function getFilterFormDefinition(vm) {
  const filterFormDefinition = new FormDefinition(
    {
      task_name: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveBatchTypes',
        storeAttribute: 'batchTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'task_name',
        id: 'task_name',
        label: this.$t('batch_task_name'),
        filterFn: options => options.filter(v => v.user_retry),
        required: true,
        styleClasses: 'col-12 col-lg-6',
      },
    },
    {
      groups: [
        {
          fields: ['task_name'],
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
const ScheduledTaskList = {
  name: 'BatchLogList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/integrations/tasks/scheduled/',
    },

    title: {
      type: String,
      default: 'batch_log',
    },
    enableDowloadExcel: {
      type: Boolean,
      default: false,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.log',
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addUrl: {
        name: 'backoffice-admin-batch-schedule-add',
      },
      columns: [
        'task',
        'created_by',
        'scheduled_date',
        'status_display',
        'cancelled_by',
        'actions',
      ],
      options: {
        perPage: 30,
        sortable: [],
        templates: {
          scheduled_date: DateTimeColumn,
          status_display: ScheduledStatus,
        },
        headings: {
          status_display: this.$t('batch_result'),
          task: this.$t('batch_task_name'),
          cancelled_by: this.$t('batch_task_cancelled_by'),
          created_by: this.$t('created_by'),
          scheduled_date: this.$t('batch_manual_scheduled'),
        },
      },
    }
  },
}
</script>
