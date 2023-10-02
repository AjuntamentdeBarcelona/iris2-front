<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import SelectedFilesSchemaField from '~/components/iris-pages/records/files/SelectedFilesSchemaField'
import { validators } from 'vue-form-generator'
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import { trimHtmlText } from '~/assets/js/helpers'
import ComsMasterTemplate from '~/components/iris-pages/records/communications/ComsMasterTemplate.vue'
import FilesType from '~/assets/js/iris2/model/FileTypes.js'

const formDefinition = vm =>
  new FormDefinition(
    {
      applicant_email: {
        type: 'autocomplete',
        inputType: 'email',
        label: vm.$t('email'),
        placeholder: vm.$t('comms_email_allow_user_input_placeholder'),
        styleClasses: 'col',
        validator: validators.email,
        clearable: false,
        searchable: false,
        noDrop: true,
      },
      text: {
        type: 'wysiwyg',
        min: 5,
        required: true,
        default: '',
        label: vm.$t('comms_message'),
        styleClasses: 'col-12 comm-editor',
        editorOptions: {
          placeholder: vm.$t('wysiwyg_placeholder'),
          formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list'],
        },
        editorToolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
      require_answer: {
        type: 'checkbox',
        default: true,
        label: vm.$t('comms_create_require_answer'),
        styleClasses: 'col-12 col-lg-4',
      },
      record_file_ids: {
        component: SelectedFilesSchemaField,
        styleClasses: 'col-6 col-lg-4 text-right',
        file_input_name: 'applicant_comm_files',
        origin: FilesType.COMMS,
      },
      select_template: {
        component: ComsMasterTemplate,
        styleClasses: 'col-6 col-lg-4 text-right',
      },
    },
    {
      groups: [
        {
          fields: ['applicant_email'],
        },
        {
          fields: [
            'text',
            'require_answer',
            'select_template',
            'record_file_ids',
          ],
        },
      ],
    }
  )
export default {
  extends: SchemaForm,
  props: {
    title: {
      type: String,
      default: '',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    saveButtonText: {
      type: String,
      default: 'comms_initiate_comm',
    },
    saveButtonIcon: {
      type: String,
      default: 'paper-plane',
    },
    backButton: {
      type: Boolean,
      default: false,
    },
    recordCard: {
      type: Object,
      required: true,
    },
    formComponentData: {
      type: Object,
      required: true,
    },
    submitOnEnter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requireAnswer: null,
    }
  },
  computed: {
    ...mapState('communication', {
      templateHeader: 'header',
      answerTag: 'answerTag',
    }),
    ...mapGetters('communication', ['getRequireAnswer', 'getSimple']),
  },
  watch: {
    templateHeader() {
      this.setTextTemplate()
    },
  },
  methods: {
    beforeSubmit() {
      if (
        this.requireAnswer &&
        this.answerTag &&
        this.model.text &&
        this.model.text.indexOf(this.answerTag) < 0
      ) {
        this.globalErrors = [
          this.$t('comms_missing_answer_tag').replace('{tag}', this.answerTag),
        ]
        return false
      }
      return true
    },
    applyInitialTransformation(initial) {
      initial.require_answer = true
      initial.record = this.recordCard
      return initial
    },
    modelUpdated() {
      if (this.model.require_answer != this.requireAnswer) {
        this.requireAnswer = this.model.require_answer
        this.setTextTemplate()
      }
    },
    onSuccess(response, sentObj) {
      this.model = {}
      this.$emit('form-saved', response, sentObj)
    },
    adaptSchema(schemaDef) {
      schemaDef.fields.applicant_email.getInitialOption = model => {
        const email = _.get.apply(this, [
          this,
          'recordCard.recordcardresponse.address_mobile_email',
        ])
        return { id: email, label: email }
      }
    },
    setTextTemplate() {
      this.model = {
        ...this.model,
        text: this.requireAnswer ? this.getRequireAnswer : this.getSimple,
      }
    },
    getSaveData(model) {
      return {
        type: this.formComponentData.type,
        record_card_id: this.recordCard.id,
        text: model.text ? trimHtmlText(model.text) : model.text,
        applicant_email: null,
        record_file_ids: model.record_file_ids
          ? model.record_file_ids.map(rf => rf.id)
          : [],
      }
    },
  },
}
</script>

<style lang="scss">
.comm-editor .ql-editor {
  max-height: 300px;
}
</style>
