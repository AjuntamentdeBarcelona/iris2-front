<script>
import TableList from '~/components/pages/list/table.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import FilteredList from '~/components/pages/list/FilteredList.vue'
import ValidateColumn from '~/components/iris-pages/batch/ValidateColumn.vue'
import DateTimeColumn from '~/components/pages/list/columns/DateTimeColumn.vue'
import DateColumn from '~/components/pages/list/columns/DateColumn.vue'
import FileLink from '~/components/tables/columns/DownloadButton'
import BooleanColumn from '~/components/pages/list/columns/BooleanColumn'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import { validators } from 'vue-form-generator'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

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

  const currentYear = new Date().getFullYear()
  let years = Array(6)
    .fill()
    .map((_, i) => {
      return { id: currentYear - i, name: currentYear - i }
    })

  const filterFormDefinition = new FormDefinition(
    {
      year: {
        type: 'select',
        values: years,
        label: vm.$t('batch_year'),
        selectOptions: {
          noneSelectedText: vm.$t('select'),
        },
        styleClasses: 'col-lg-2',
      },
      trimestre: {
        type: 'select',
        styleClasses: 'col-lg-2',
        values: [
          {
            id: '1',
            name: vm.$t('batch_first'),
          },
          {
            id: '2',
            name: vm.$t('batch_second'),
          },
          {
            id: '3',
            name: vm.$t('batch_third'),
          },
          {
            id: '4',
            name: vm.$t('batch_fourth'),
          },
        ],
        label: vm.$t('batch_trimester'),
        selectOptions: {
          noneSelectedText: vm.$t('select'),
        },
      },
      created_at__gte: {
        ...dateField,
        label: vm.$t('batch_date') + ' ' + vm.$t('from'),
      },
      created_at__lte: {
        ...dateField,
        label: vm.$t('batch_date') + ' ' + vm.$t('to'),
      },
      pending_validate: {
        type: 'checkbox',
        label: vm.$t('batch_non_validated'),
        styleClasses: 'col-lg-2',
      },
    },
    {
      groups: [
        {
          fields: [
            'year',
            'trimestre',
            'created_at__gte',
            'created_at__lte',
            'pending_validate',
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
const BatchLogList = {
  name: 'BatchLogList',
  extends: TableList,
  props: {
    url: {
      type: String,
      default: '/api/integrations/batch-files/',
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
      columns: [
        'process',
        'year',
        'trimestre',
        'created_at',
        'validated_by',
        'validated_at',
        'file',
      ],
      options: {
        perPage: 30,
        sortable: [],
        templates: {
          created_at: DateTimeColumn,
          oldest_date_limit: DateColumn,
          validated_at: DateTimeColumn,
          validated_by: ValidateColumn,
          important: BooleanColumn,
          file: FileLink,
        },
        headings: {
          process: this.$t('batch_description'),
          status: this.$t('batch_result'),
          year: this.$t('batch_date_year'),
          trimestre: this.$t('batch_date_trimester'),
          created_at: this.$t('batch_date'),
          validated_by: this.$t('batch_validate_by'),
          validated_at: this.$t('batch_validate_at'),
          created_at: this.$t('batch_date'),
          traceback: this.$t('batch_traceback'),
          file: this.$t('batch_download'),
        },
      },
    }
  },
}
</script>
