<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators, schema } from 'vue-form-generator'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import moment from 'moment'

const DATE_FORMAT = 'DD/MM/YYYY'

const formDefinition = vm =>
  new FormDefinition(
    {
      task: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveBatchTypes',
        storeAttribute: 'batchTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'task_name',
        id: 'task_name',
        label: vm.$t('batch_task_name'),
        filterFn: options => options.filter(v => v.user_retry),
        required: true,
        styleClasses: 'col-12 col-lg-6',
      },
      schedule_date: {
        type: 'pikaday',
        label: vm.$t('date'),
        placeholder: 'Seleccioneu una data',
        pikadayOptions: {
          format: DATE_FORMAT,
        },
        styleClasses: 'col-lg-2 col-xl-2',
      },
      schedule_time: {
        type: 'time-picker',
        label: vm.$t('hour'),
        styleClasses: 'col-lg-3 col-xl-3',
        required: false,
      },
    },
    {
      groups: [
        {
          fields: ['task'],
        },
        {
          fields: ['schedule_date', 'schedule_time'],
        },
      ],
    }
  )

export default {
  name: 'ScheduleBatchForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/integrations/tasks/scheduled/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-batch-schedule',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
  },
  methods: {
    getInitial() {
      const initial = moment()
        .add(1, 'days')
        .hour(1)
        .minute(0)
      console.log(initial)
      return {
        schedule_date: initial,
        schedule_time: initial,
      }
    },
    getSaveData(model) {
      const app_date = model.schedule_date ? moment(model.schedule_date) : null
      if (app_date && model.schedule_time) {
        app_date.set('minutes', model.schedule_time.minutes())
        app_date.set('hour', model.schedule_time.hours())
      }
      return {
        scheduled_date: app_date ? app_date.format('YYYY-MM-DD HH:mm') : null,
      }
    },
  },
}
</script>
