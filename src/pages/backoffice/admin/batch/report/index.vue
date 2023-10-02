<script>
import TableList from '~/components/pages/list/table.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import FilteredList from '~/components/pages/list/FilteredList.vue'
import TaskColumn from '~/components/iris-pages/batch/TaskColumn.vue'
import BatchStatus from '~/components/iris-pages/batch/BatchStatus.vue'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'
import BooleanColumn from '~/components/pages/list/columns/BooleanColumn'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import { validators } from 'vue-form-generator'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'
import NextManualPlanned from '~/components/iris-pages/batch/NextManualPlanned.vue'
import DefaultSchedule from '~/components/iris-pages/batch/DefaultSchedule.vue'

export default {
  name: 'FilteredBatchLogList',
  extends: FilteredList,
  mixins: [AdminMixin],
  props: {
    filterFormDefinition: {
      type: [Object, Function],
      default: () => getFilterFormDefinition,
    },
    listComponent: {
      type: Object,
      default: () => BatchLogList,
    },
    title: {
      type: String,
      default: 'batch_log',
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
      manual_planned: {
        component: NextManualPlanned,
        styleClasses: 'col-12',
      },
      default_scheduled: {
        component: DefaultSchedule,
        styleClasses: 'col-12',
      },
      date_done__gte: {
        ...dateField,
        label: vm.$t('batch_date') + ' ' + vm.$t('from'),
      },
      date_done__lte: {
        ...dateField,
        label: vm.$t('batch_date') + ' ' + vm.$t('to'),
      },
      task_name: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveBatchTypes',
        storeAttribute: 'batchTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'task_name',
        id: 'task_name',
        label: this.$t('batch_task_name'),
        required: true,
        styleClasses: 'col-12 col-lg-6',
      },
    },
    {
      groups: [
        {
          fields: ['manual_planned', 'default_scheduled'],
        },
        {
          fields: ['task_name', 'date_done__gte', 'date_done__lte'],
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
const BatchLogList = {
  name: 'BatchLogList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/integrations/tasks/',
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
  },
  data() {
    return {
      columns: ['description', 'task_name', 'date_done', 'status', 'traceback'],
      options: {
        perPage: 30,
        sortable: [],
        templates: {
          date_done: DateTimeColumn,
          important: BooleanColumn,
          description: TaskColumn,
          status: BatchStatus,
        },
        headings: {
          status: this.$t('batch_result'),
          description: this.$t('batch_description'),
          task_name: this.$t('batch_task_name'),
          date_done: this.$t('batch_date'),
          traceback: this.$t('batch_traceback'),
        },
      },
    }
  },
}
</script>
