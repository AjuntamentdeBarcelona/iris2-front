<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import SelectedFilesSchemaField from '~/components/iris-pages/records/files/SelectedFilesSchemaField'
import FilesType from '~/assets/js/iris2/model/FileTypes.js'
import { validators } from 'vue-form-generator'
import _ from 'lodash'
import { trimHtmlText } from '~/assets/js/helpers'

const formDefinition = vm =>
  new FormDefinition(
    {
      external_email: {
        type: 'autocomplete',
        inputType: 'email',
        label: vm.$t('email'),
        placeholder: vm.$t('comms_email_allow_user_input_placeholder'),
        noOptionsText: vm.$t('comms_no_previous_email'),
        styleClasses: 'col',
        validator: validators.email,
        allowUserInput: true,
        formatUserInputToModel: function(newOption) {
          this.$emit('option:created', newOption)
          return newOption
        },
      },
      text: {
        type: 'wysiwyg',
        min: 5,
        required: true,
        default: '',
        label: vm.$t('comms_message'),
        styleClasses: 'col-12 py-0',
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
        styleClasses: 'col-6',
      },
      record_file_ids: {
        component: SelectedFilesSchemaField,
        styleClasses: 'ml-auto pr-2',
        file_input_name: 'external_comm_files',
        origin: FilesType.COMMS,
      },
    },
    {
      groups: [
        {
          fields: ['external_email'],
        },
        {
          fields: ['text', 'require_answer', 'record_file_ids'],
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
  methods: {
    applyInitialTransformation(initial) {
      initial.require_answer = true
      initial.record = this.recordCard
      return initial
    },
    onSuccess(response, sentObj) {
      this.model = {}
      this.$emit('form-saved', response, sentObj)
    },
    adaptSchema(schemaDef) {
      schemaDef.fields.external_email.options = this.formComponentData.previouslyUsedExternalEmails.map(
        email => ({
          id: email,
          label: email,
        })
      )
    },
    getSaveData(model) {
      return {
        type: this.formComponentData.type,
        record_card_id: this.recordCard.id,
        text: model.text ? trimHtmlText(model.text) : model.text,
        record_file_ids: model.record_file_ids
          ? model.record_file_ids.map(rf => rf.id)
          : [],
      }
    },
  },
}
</script>
