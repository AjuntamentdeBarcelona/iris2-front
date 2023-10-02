<template>
  <div class="process-answers">
    <div
      v-if="cannotAnswerReason"
      class="alert alert-danger col-12">
      {{ cannotAnswerReason }}
    </div>
    <div class="process-channel-answers">
      <div
        v-for="(answer, key) in answers"
        :key="key"
        class="row channel-answer">
        <div class="col-12 col-lg-3 answer-data">
          <record-answer-data
            :records="answer.records"
            :language="answer.lang"
            :disabled="answerReadOnly"
            @avoid-send="avoidSend" />
        </div>
        <answer
          :process="answer.record"
          :current="process"
          :detail="process.element_detail"
          :answer-data="answer.data"
          :step="step"
          :many-mode="answer.records > 1"
          :read-only="answerReadOnly"
          class="col-12 col-lg-9 answer"
          @model-updated="updateAnswer"
          @validated="validated" />
      </div>
      <div
        v-if="canSend && process.group_can_answer.can_answer && !answerReadOnly && requiresAnswer"
        class="row">
        <div class="col-12">
          <span
            v-b-popover.hover.left="validPopover"
            class="float-right">
            <button
              id="answer-confirm"
              :disabled="!isValid"
              class="btn btn-primary"
              @click="save">
              <font-awesome-icon icon="share" />
              {{ sendText }}
            </button>
          </span>
        </div>
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
    <confirm ref="modalConfirm" />
  </div>
</template>

<script>
import ProcessStepMixin from './ProcessStepMixin.js'
import Answer from './Answer.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import RecordAnswerData from '~/components/iris-pages/records/RecordAnswerData.vue'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import moment from 'moment'
import Confirm from '~/components/pages/form/Confirm.vue'
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
    Answer,
    RecordAnswerData,
    Confirm,
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
    save() {
      if (!this.isValid || !this.hasAllResponse()) {
        this.$notify({
          group: 'iris',
          title: this.$t('record_card_answer_require_all'),
          type: 'error',
          text: '',
        })
        return false
      }
      if (!this.confirmedTemplate) {
        this.confirmNonChangedTemplate()
        return false
      }
      if (!this.confirmed) {
        this.confirmSend()
        return false
      }

      this.$nuxt.$loading.start()
      this.$axios
        .post(
          `api/record_cards/workflow/${this.workflowId}/answer/`,
          this.getSaveData()
        )
        .then(resp => {
          this.actionCompleted()
        })
        .catch(error => {
          this.confirmed = false
          const data = error.response.data
          if (!_.isObject(data) || data.detail) {
            this.serverError = data.detail ? data.detail : data
          } else {
            this.serverError = this.$t('record_card_answer_cant_send')
          }
          this.$notify({
            group: 'iris',
            title: this.serverError,
            type: 'error',
            text: '',
          })
        })
        .then(() => {
          this.$nuxt.$loading.finish()
        })
      return true
    },
    confirmSend() {
      this.$refs.modalConfirm.open(
        this.$t('confirm_answer'),
        this.$t('confirm_answer_text'),
        () => {
          this.confirmed = true
          this.save()
          return true
        }
      )
    },
    confirmNonChangedTemplate() {
      this.$refs.modalConfirm.open(
        this.$t('record_card_answer_template_not_changed'),
        this.$t('record_card_answer_template_not_changed_confirm'),
        result => {
          if (result) {
            this.confirmedTemplate = true
            this.confirmed = false
            this.confirmSend()
            return false
          } else {
            this.confirmedTemplate = false
            return false
          }
        }
      )
    },
    getAnswersForSave() {
      return Object.values(this.answers).filter(
        ans =>
          ans.channel != ResponseChannel.NONE &&
          ans.record.actions.answer != null &&
          ans.record.actions.answer.can_perform
      )
    },
    getSaveData() {
      let data = []
      for (const answer of this.getAnswersForSave()) {
        for (const record of answer.records) {
          data.push({
            worked: answer.data.worked,
            notify_quality: answer.data.notify_quality,
            avoid_send: this.avoidRecords[record.id] === true,
            response: answer.data.response,
            record_files: answer.data.record_files.map(item => ({
              record_file: item.id,
            })),
            record_card: record.id,
            send_date: moment().format('YYYY-MM-DD'),
          })
        }
      }
      return data
    },
    hasAllResponse() {
      for (const ans of this.getAnswersForSave()) {
        if (!ans.data || !ans.data.response) {
          return false
        }
      }
      return true
    },
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

<style lang="scss">
.channel-answer {
  border-bottom: 1px solid $gray;
  margin-bottom: 1rem;
  .irisbox {
    margin-bottom: 1rem;
  }
}
.process-channel-answers .channel-answer:last-child {
  border-bottom: none;
}

.process-answers {
  min-height: 400px;
  position: relative;
}

.process-answers .iris-form .form-page-form.irisbox {
  padding: 0px;
}

.process-answers .iris-form .answer-text-editor textarea {
  min-height: 150px;
}

.process-answers .process-channel-answers .channel-answer {
  margin-right: 0px;
  margin-left: 0px;
}

@media (max-width: 1500px) {
  .process-answers .answer-data {
    flex: 0 0 40%;
    max-width: 40%;
  }
  .process-answers .answer {
    flex: 0 0 60%;
    max-width: 60%;
  }
}
@media (max-width: 1200px) {
  .process-answers .answer-data {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .process-answers .answer {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
