<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import ProcessStepMixin from './ProcessStepMixin.js'
import AnswerTextEditor from './AnswerTextEditor.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { validators } from 'vue-form-generator'
import { mapGetters } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'
import moment from 'moment'
import _ from 'lodash'
import plainFromHtml from '~/assets/js/utils/string/plainFromHtml.js'

const getAnswerDefinition = vm => {
  return new FormDefinition(
    {
      response: {
        component: AnswerTextEditor,
        min: 5,
        required: true,
        default: '',
        styleClasses: 'col-12',
      },
    },
    {
      groups: [
        {
          fields: ['response'],
        },
      ],
    }
  )
}

export default {
  name: 'AnswerForm',
  extends: SchemaForm,
  mixins: [ProcessStepMixin],
  props: {
    definition: {
      type: Function,
      required: false,
      default: getAnswerDefinition,
    },
    /**
     * Record page in which the process is being worked.
     */
    current: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      default: '',
      required: false,
    },
    answerData: {
      type: Object,
      default: () => {
        return {}
      },
      required: false,
    },
    manyMode: {
      type: Boolean,
      default: false,
      required: false,
    },
    commentTask: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      confirmedTemplate: false,
    }
  },
  watch: {
    adaptSchema(schemaDef) {
      schemaDef.response.manyMode = this.manyMode
    },
    answerData() {
      this.model.response = this.answerData.response
      this.model.worked = this.answerData.worked
    },
    canSetWorked() {
      const fields = this.canSetWorked ? ['response', 'worked'] : ['response']
      definition.layout = {
        groups: [
          {
            fields: fields,
          },
        ],
      }
    },
  },
  methods: {
    afterUpdate() {
      this.confirmedTemplate =
        plainFromHtml(this.model.response) !=
        plainFromHtml(this.model.templated || '')
    },
    /**
     * Check If the resolution not have a comment
     */
    isValid(obj) {
      return obj.response != '' && obj.response != null
    },
    beforeSubmit() {
      if (!this.confirmedTemplate) {
        this.$refs.modalConfirm.open(
          this.$t('record_card_answer_template_not_changed'),
          this.$t('record_card_answer_template_not_changed_confirm'),
          () => {
            this.confirmedTemplate = true
            this.saveDraft()
          }
        )
        return false
      }
      return true
    },
    /**
     * If there is a server error, the confirmation message must be shown again.
     */
    afterServerError() {
      this.confirmed = false
    },
    getInitial() {
      return {
        response: this.answerData.response,
        worked: this.answerData.worked,
        notify_quality: this.answerData.notify_quality,
        record_files: this.answerData.record_files.map(item => ({
          ...item,
          id: item.record_file,
        })),
        record: this.process,
        current: this.current,
        key: this.answerData.key,
      }
    },
    getDefaultButtons() {
      if (this.readOnly) {
        return []
      }

      let buttons = []

      buttons.push({
        name: 'save-draft',
        text: this.$t('record_card_save_draft'),
        click: this.saveDraft,
        icon: 'save',
        classes: 'btn-outline-primary ml-auto',
      })

      return buttons
    },
    getSaveData() {
      return {
        send_date: moment().format('YYYY-MM-DD'),
      }
    },
    saveDraft() {
      if (!this.beforeSubmit() || this.saving) {
        return
      }
      let obj = this.constructSaveData(this.model)
      obj.record_files = obj.record_files.map(item => ({
        record_file: item.id,
      }))
      if (obj.worked == null) {
        obj.worked = ''
      }
      this.saving = true
      this.$axios
        .post(
          _.trimStart(
            this.process.actions['draft-answer'].action_url,
            '/services/iris/'
          ),
          obj
        )
        .then(res => {
          this.initialModel = this.model
          this.afterSave()
          try {
            this.onSuccess(res, obj)
          } catch (e) {
            throw e
          }
          this.showSuccessMessage()
        })
        .catch(e => {
          this.processErrorResponse(e, obj)
        })
        .then(() => {
          this.saving = false
        })
    },
  },
}
</script>

<style>
.answer .answer-text-editor.row {
  margin-bottom: 0px;
}

.answer .vue-form-generator .form-group {
  margin-bottom: 0px;
}
</style>
