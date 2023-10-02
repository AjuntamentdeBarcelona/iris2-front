<template>
  <div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_tipus_resolution') }}
      </div>
      <div class="printrecord__description">
        {{ (resolutionType ? resolutionType : '-') }}
      </div>
    </div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_service') }}
      </div>
      <div class="printrecord__description">
        {{ (resolutionData.service_person_incharge ? resolutionData.service_person_incharge : '-') }}
      </div>
    </div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('print_process_date') }}
      </div>
      <div class="printrecord__description">
        {{ (resolutionData.resolution_date ? formatDate(resolutionData.resolution_date) : '-') }}
      </div>
    </div>
    <div class="printrecord__card">
      <div class="printrecord__title">
        {{ $t('Comentaris') }}
      </div>
      <div class="printrecord__description">
        {{ (resolutionData.resolution_comment ? resolutionData.resolution_comment : '-') }}
      </div>
    </div>
  </div>
</template>


<script>
import ProcessStepMixin from './ProcessStepMixin.js'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { dateHourMinute } from '~/assets/js/helpers.js'

export default {
  name: 'ResolutionPrint',
  mixins: [ProcessStepMixin],
  props: {
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
      resolutionType: '',
    }
  },
  computed: {
    currentGroup() {
      return this.process.responsible_profile
    },
    resolutionData() {
      return this.getInitial()
    },
    ...mapState('masters', {
      resolutionTypes: 'resolutionTypes',
    }),
  },
  created() {
    // this.load()
    this.load().then(() => {
      this.resolutionTypes.forEach(resolution => {
        if (this.getInitial().resolution_type === resolution.id) {
          this.resolutionType = resolution.description
        }
      })
    })
  },
  methods: {
    confirmExternal() {
      this.transitionMsgShown = true
      this.submit()
    },
    ...mapActions('masters', { load: 'retrieveResolutionTypes' }),
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
    formatDate(dateStr) {
      if (dateStr) {
        return dateHourMinute(dateStr)
      }
      return '-'
    },
  },
}
</script>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>
