<template>
  <div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_comments') }}
      </div>
      <div class="printrecord__description">
        {{ (initialData.comment ? initialData.comment : '-') }}
      </div>
    </div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_planned_date') }}
      </div>
      <div class="printrecord__description">
        {{ (initialData.start_date_process ? formatDate(initialData.start_date_process) : '-') }}
      </div>
    </div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_service') }}
      </div>
      <div class="printrecord__description">
        {{ (initialData.responsible_profile ? initialData.responsible_profile : '-') }}
      </div>
    </div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_no_action') }}
      </div>
      <div class="printrecord__description">
        <span v-if="!initialData.no_action_required"> {{ 'Requereix' }}</span>
        <span v-if="initialData.no_action_required"> {{ 'No requereix' }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import ProcessStepMixin from './ProcessStepMixin.js'
import moment from 'moment'
import { dateHourMinute } from '~/assets/js/helpers.js'

export default {
  name: 'PlanPrint',
  mixins: [ProcessStepMixin],
  props: {
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
      initialData: {},
    }
  },
  computed: {
    currentGroup() {
      return this.process.responsible_profile
    },
  },
  created() {
    this.initialData = this.getInitial()
  },
  methods: {
    getCheckUrl() {
      return `/api/record_cards/workflows/${
        this.process.workflow.id
      }/plan/check/`
    },
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
    formatDate(dateStr) {
      if (dateStr) {
        return dateHourMinute(dateStr)
      }
      return '-'
    },
  },
}
</script>
