<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import { validators } from 'vue-form-generator'
import _ from 'lodash'
import { compareFnByDescriptionAsc, trimHtmlText } from '~/assets/js/helpers'

const formDefinition = vm =>
  new FormDefinition(
    {
      groups_involved: {
        type: 'autocomplete-multiple',
        inputType: 'number',
        required: true,
        label: vm.$t('groups_groups'),
        placeholder: vm.$t('groups_groups'),
        optionLabelAttribute: 'description',
        url: '/api/profiles/groups/',
        processAjaxResult: function(res) {
          return res.data.results.filter(
            group => group.id !== this.currentGroupId
          )
        },
        offlineSearch: false,
        objectValue: true,
        valueAttribute: 'id',
        values: [],
        isRestful: true,
        infiniteScroll: true,
        styleClasses: 'col',
        excludeSelectedValuesByField: 'id',
      },
      text: {
        type: 'wysiwyg',
        min: 5,
        required: true,
        default: '',
        label: vm.$t('comms_message'),
        styleClasses: 'col',
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
    },
    {
      groups: [
        {
          fields: ['groups_involved'],
        },
        {
          fields: ['text'],
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
    onSuccess(response, sentObj) {
      this.model = {}
      this.$emit('form-saved', response, sentObj)
    },
    adaptSchema(schemaDef) {
      schemaDef.fields.groups_involved.currentGroupId = this.formComponentData.currentCredentials.currentGroup.id
    },
    getSaveData(model) {
      return {
        type: this.formComponentData.type,
        record_card_id: this.recordCard.id,
        groups_involved: model.groups_involved
          ? model.groups_involved.map(group => ({
              group: group.id,
            }))
          : model.groups_involved,
        text: model.text ? trimHtmlText(model.text) : model.text,
      }
    },
  },
}
</script>
