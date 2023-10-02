<template>
  <div class="process-answers">
    <div class="process-channel-answers">
      <div
        v-for="(answer, key) in answers"
        :key="key"
        class="row channel-answer">
        <div>
          <record-answer-data-print
            :records="answer.records"
            :language="answer.lang"
            :disabled="answerReadOnly"
            @avoid-send="avoidSend" />
        </div>
        <br>
        <answer-print
          :process="answer.record"
          :current="process"
          :detail="process.element_detail"
          :answer-data="answer.data"
          :step="step"
          :many-mode="answer.records > 1"
          :read-only="answerReadOnly"
          @model-updated="updateAnswer"
          @validated="validated" />
      </div>
    </div>
    <div
      v-if="loading && !error"
      class="loading-overlay">
      <div class="loader" />
    </div>
    <div
      v-if="!requiresAnswer"
      class="alert alert-danger">
      {{ $t('record_card_answer_no_need') }}
    </div>
    <div
      v-if="serverError"
      class="alert alert-danger">
      {{ serverError }}
    </div>
    <div
      v-if="error"
      class="alert alert-danger">
      {{
        toBeAnswered ? $t('record_card_cannot_load_draft') : $t('record_card_cannot_load_answer')
      }}
    </div>
  </div>
</template>

<script>
import ProcessStepMixin from './ProcessStepMixin.js'
import AnswerPrint from './AnswerPrint.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import RecordAnswerDataPrint from '~/components/iris-pages/records/RecordAnswerDataPrint.vue'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import moment from 'moment'
import _ from 'lodash'
import { mapActions } from 'vuex'
import plainFromHtml from '~/assets/js/utils/string/plainFromHtml.js'

/**
 * Since every process can have one or more RecordCards, this component
 *  manages the process of answering all of them.
 */
export default {
  name: 'ProcessAnswers',
  components: {
    AnswerPrint,
    RecordAnswerDataPrint,
  },
  mixins: [ProcessStepMixin],
  props: {
    commentTask: {
      type: String,
      default: '',
      required: false,
    },
  },
  /**
   * @todo addapt to Workflow from record card
   */
  data() {
    return {
      currentRecordCard: this.process,
      answers: [],
      recordCards: [this.process],
      loading: false,
      error: false,
      confirmed: false,
      confirmedTemplate: true, // If the user uses a template, and don't change it, require confirmation
      serverError: '',
      valid: {},
      avoidRecords: {},
    }
  },
  computed: {
    workflowId() {
      if (this.process.workflow) {
        return this.process.workflow.id
      }
      return this.process.id
    },
    records() {
      if (this.process.workflow) {
        return this.process.workflow.records
      }
      return this.process.records
    },
    sendText() {
      return this.records.length > 1
        ? this.$t('record_card_answers_send')
        : this.$t('record_card_answer_send')
    },
    answerReadOnly() {
      return (
        this.readOnly ||
        this.currentRecordCard.record_state_id == RecordState.CLOSED.id
      )
    },
    toBeAnswered() {
      return (
        this.currentRecordCard.record_state_id == RecordState.PENDING_ANSWER.id
      )
    },
    loadDataUrl() {
      return `/api/record_cards/record_cards/${
        this.currentRecordCard.id
      }/answer/response/`
    },
    canSend() {
      return _.get(this.process, 'actions.answer.has_permission', false)
    },
    cannotAnswerReason() {
      if (_.get(this.process, 'actions.answer.has_permission', false)) {
        return _.get(this.process, 'group_can_answer.reason', '')
      }
      return ''
    },
    isValid() {
      return Object.values(this.valid).filter(val => !val).length == 0
    },
    validPopover() {
      return this.isValid ? '' : this.$t('record_card_answer_require_all')
    },
    requiresAnswer() {
      return !_.isEmpty(this.answers)
    },
  },
  mounted() {
    this.resetFiles()
    this.nextAnswer()
  },
  methods: {
    ...mapActions('workflowFiles', { resetFiles: 'reset' }),
    updateAnswer(model) {
      this.confirmed = false
      this.answers[model.key].data.response = model.response
      this.confirmedTemplate =
        plainFromHtml(model.response) != plainFromHtml(model.templated || '')
      this.answers[model.key].data.worked = model.worked || ''
      this.answers[model.key].data.notify_quality =
        model.notify_quality || false
      this.answers[model.key].data.avoid_send = model.avoid_send || false
      this.answers[model.key].data.record_files = model.record_files || []
    },
    validated(valid, model, field) {
      this.valid = { ...this.valid, [model.key]: valid }
    },
    nextAnswer() {
      this.answers = this.getAnswers()
    },
    actionCompleted() {
      this.$emit('form-saved', this.process)
    },
    avoidSend([record, value]) {
      this.avoidRecords[record.id] = value
    },
    /**
     * Given a record with a workflow or a workflow, returns
     * the list of channels and languages that must be answered.
     * Each pair of response channel and language, require an answer.
     * All the answers must be saved together and sent together.
     * @return {Object} Object with three attributes: records, channel and language.
     */
    getAnswers() {
      return this.records
        .filter(record => {
          return (
            record.recordcardresponse != null &&
            record.recordcardresponse.response_channel != ResponseChannel.CAP
          )
        })
        .map(record => {
          return {
            channel: record.recordcardresponse.response_channel,
            lang: record.recordcardresponse.language,
            record: record,
            data: record.response,
          }
        })
        .reduce((obj, answer) => {
          const key = `${answer.channel}-${answer.lang}`
          if (obj[key]) {
            // Append the record
            obj[key].records.push(answer.record)
            if (!obj[key].data.response) {
              obj[key].data = {
                ...answer.data,
                key: key,
              }
            }
          } else {
            // Create the entry
            obj[key] = {
              ...answer,
              data: {
                ...answer.data,
                key: key,
              },
              records: [answer.record],
              process: { ...this.process },
            }
          }
          return obj
        }, {})
    },
  },
}
</script>
