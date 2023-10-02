<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import ProcessStepMixin from './ProcessStepMixin.js'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { validators } from 'vue-form-generator'
import Ca from '~/lang/ca'
import moment from 'moment'
import checkConfirmFormMixin from '~/components/pages/checkConfirmFormMixin'

const planFormDefinition = vm =>
  new FormDefinition(
    {
      comment: {
        type: 'textArea',
        label: vm.$t('process_comments'),
        styleClasses: 'col-12',
        placeholder: vm.$t('process_comments'),
        min: 9,
        pattern: /\S{4,}\s+[\s\S]*\S{4,}/,
        required: true,
        validator: [validators.string.locale(), validators.regexp.locale()],
      },
      start_date_process: {
        type: 'pikaday',
        label: vm.$t('process_start_date'),
        placeholder: vm.$t('process_start_date'),
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        styleClasses: 'col-lg-6',
        required: false,
        min: 10,
        max: 10,
        validator: validators.date.locale(),
      },
      responsible_profile: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('process_responsible'),
        placeholder: vm.$t('process_responsible'),
        styleClasses: 'col-lg-6',
        min: 3,
        validator: validators.string.locale(),
      },
      no_action_required: {
        type: 'checkbox',
        default: false,
        label: vm.$t('process_non_action'),
        styleClasses: 'col-12',
      },
    },
    {
      groups: [
        {
          fields: ['responsible_profile', 'start_date_process'],
        },
        {
          fields: ['comment'],
        },
        { fields: ['no_action_required'] },
      ],
    }
  )

export default {
  name: 'Plan',
  extends: SchemaForm,
  mixins: [ProcessStepMixin, checkConfirmFormMixin],
  props: {
    definition: {
      type: Function,
      required: false,
      default: planFormDefinition,
    },
    commentTask: {
      type: String,
      default: 'p',
      required: false,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      alwaysShowConfirmModal: false,
    }
  },
  computed: {
    currentGroup() {
      return this.process.responsible_profile
    },
  },
  methods: {
    /**
     * Maps the workflow attrs
     */
    getInitial() {
      const stepComments = this.getStepComments()
      if (stepComments.length > 0) {
        return {
          comment: stepComments.length > 0 ? stepComments[0].comment : '',
          no_action_required: !this.process.recordplan.action_required,
          responsible_profile: this.process.recordplan.responsible_profile,
          start_date_process: this.process.recordplan.start_date_process
            ? moment(this.process.recordplan.start_date_process, 'YYYY-MM-DD')
            : null,
        }
      }
      return {}
    },
    adaptSchema(definition) {
      for (let field of Object.values(definition.fields)) {
        field.disabled = this.readOnly
      }
      if (this.readOnly) {
        definition.layout.groups[1].fields = ['comment']
      }
    },
    getDefaultButtons() {
      if (this.readOnly) {
        return []
      }
      return [
        {
          name: 'save',
          text: this.$t('record_card_move_task'),
          click: this.submit,
          icon: 'fast-forward',
          classes: 'btn-primary ml-auto',
        },
      ]
    },
    getSaveData(model) {
      return {
        responsible_profile: model.responsible_profile || '',
        start_date_process: model.start_date_process
          ? moment(model.start_date_process).format('YYYY-MM-DD')
          : null,
        action_required: !model.no_action_required,
        comment: model.comment || '',
      }
    },
    getCheckUrl() {
      return `/api/record_cards/workflows/${
        this.process.workflow.id
      }/plan/check/`
    },
  },
}
</script>
