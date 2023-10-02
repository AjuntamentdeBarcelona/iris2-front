<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import ProcessStepMixin from './ProcessStepMixin.js'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { validators } from 'vue-form-generator'
import Ca from '~/lang/ca'
import moment from 'moment'
import _ from 'lodash'
import checkConfirmFormMixin from '~/components/pages/checkConfirmFormMixin'

const resolutionDefinition = vm =>
  new FormDefinition(
    {
      resolution_type: {
        type: 'vuex-select',
        label: 'Tipus resolució',
        styleClasses: 'col-lg-6 col-xl-4',
        storeModule: 'masters',
        storeAttribute: 'resolutionTypes',
        storeAction: 'retrieveResolutionTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'id',
        required: true,
      },
      service_person_incharge: {
        type: 'input',
        inputType: 'text',
        label: vm.$t('process_responsible'),
        placeholder: vm.$t('process_responsible'),
        styleClasses: 'col-lg-6 col-xl-8',
        min: 3,
        max: 100,
        validator: validators.string,
      },
      resolution_date: {
        type: 'pikaday',
        label: 'Data',
        placeholder: vm.$t('process_end_date'),
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        styleClasses: 'col-lg-6 col-xl-4',
      },
      resolution_time: {
        type: 'time-picker',
        label: vm.$t('process_hour'),
        styleClasses: 'col-lg-3 col-xl-3',
        required: false,
      },
      resolution_comment: {
        type: 'textArea',
        label: vm.$t('process_comments'),
        placeholder: vm.$t('process_comments'),
        styleClasses: 'col-12',
        required: true,
        hint: `${vm
          .$t('error_at_least_words')
          .replace('{words}', 2)
          .replace('{chars}', 4)}.`,
        min: 9,
        pattern: /\S{4,}\s+[\s\S]*\S{4,}/,
        validator: [validators.string.locale(), validators.regexp.locale()],
      },
    },
    {
      groups: [
        {
          fields: ['resolution_type', 'service_person_incharge'],
        },
        {
          fields: ['resolution_date', 'resolution_time'],
        },
        {
          fields: ['resolution_comment'],
        },
      ],
    }
  )

export default {
  name: 'Resolution',
  extends: SchemaForm,
  mixins: [ProcessStepMixin, checkConfirmFormMixin],
  props: {
    definition: {
      type: Function,
      required: false,
      default: resolutionDefinition,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
    commentTask: {
      type: String,
      default: 'r',
      required: false,
    },
  },
  data() {
    return {
      transitionMsgShown: false,
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
        const data = {
          resolution_comment:
            stepComments.length > 0 ? stepComments[0].comment : '',
          ...this.process.recordcardresolution,
        }
        if (data.resolution_date) {
          const appointment = moment(data.resolution_date)
          data.resolution_date = appointment
          data.resolution_time = appointment
        }
        return data
      }
      return {}
    },
    isValid(obj) {
      if (obj.resolution_time && !obj.resolution_date) {
        this.errors = [
          {
            field: this.schemaDef.fields.resolution_date,
            error: this.$t('resolution_time_needs_date'),
          },
        ]
        this.$notify({
          group: 'iris',
          text: '',
          type: 'error',
          title: this.$t('resolution_time_needs_date'),
        })
        return false
      }
      if (!obj.resolution_comment) {
        this.errors = [
          {
            field: this.schemaDef.fields.resolution_comment,
            error: this.$t('resolution_time_needs_comments'),
          },
        ]
        this.$notify({
          group: 'iris',
          title: this.$t('resolution_time_needs_comments'),
          type: 'error',
          text: '',
        })
        return false
      }
      return true
    },
    /**
     * When the next state is EXTERNAL_PROCESSING, a confirmation message must be shown
     * before performing the submit.
     */
    beforeSubmit(model) {
      if (!this.modelHasChanges) {
        this.showNotReadyMessage()
        return false
      }
      if (
        this.process.next_step_code == RecordState.EXTERNAL_PROCESSING.id &&
        !this.transitionMsgShown
      ) {
        this.showConfirmExternal()
        return false
      }
      return true
    },
    /**
     * If there is a server error, the confirmation message must be shown again.
     */
    afterServerError() {
      this.transitionMsgShown = false
    },
    showConfirmExternal() {
      this.$refs.modalConfirm.open(
        this.$t('to_external_derivation_title'),
        this.$t('to_external_derivation_message'),
        () => {
          this.confirmExternal()
        }
      )
    },
    confirmExternal() {
      this.transitionMsgShown = true
      this.submit()
    },
    /**
     * Show appointment fields when is required by the detail.
     */
    adaptSchema(schemaDef) {
      if (this.isAppointment()) {
        const appointment_fields = [
          'service_person_incharge',
          'resolution_date',
          'resolution_time',
        ]
        for (let field of appointment_fields) {
          schemaDef.fields[field].required = true
        }
        schemaDef.fields.resolution_date.validator = (value, field, model) => {
          if (moment(model[field.model]) < moment().startOf('day')) {
            return this.$t('dateMinIsToday')
          }
        }
      }
      for (let field of Object.values(schemaDef.fields)) {
        field.disabled = this.readOnly
      }
    },
    isAppointment() {
      if (this.process.recordcardresolution) {
        return this.process.recordcardresolution.is_appointment
      }
      return this.detail.requires_appointment
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
    /**
     * Adjusts the fields before sending them to the server.
     */
    getSaveData(model) {
      const app_date = model.resolution_date
        ? moment(model.resolution_date)
        : null
      if (app_date && model.resolution_time) {
        app_date.set('minutes', model.resolution_time.minutes())
        app_date.set('hour', model.resolution_time.hours())
      }
      return {
        resolution_date: app_date ? app_date.format('YYYY-MM-DD HH:mm') : null,
      }
    },
    getCheckUrl() {
      return `/api/record_cards/workflows/${
        this.process.workflow.id
      }/resolute/check/`
    },
  },
}
</script>
