<script>
import Vue from 'vue'

import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { schema, validators } from 'vue-form-generator'
import fieldFileUploader from '~/components/form-generator/fieldFileUploader'

import {
  supportInfoType,
  supportInfoCategory,
  supportEndpoint,
} from '~/assets/js/iris2/constants'

export const formDefinition = vm =>
  new FormDefinition(
    {
      type: {
        type: 'select',
        required: true,
        values: Object.values(supportInfoType(vm)),
        selectOptions: {
          noneSelectedText: vm.$t('form_select_none_selected'),
        },
        label: vm.$t('support_type'),
        styleClasses: 'col',
      },
      title: {
        type: 'input',
        inputType: 'text',
        required: true,
        label: vm.$t('title'),
        placeholder: vm.$t('title'),
        min: 3,
        max: 200,
        styleClasses: 'col',
        validator: validators.string,
      },
      description: {
        type: 'textArea',
        required: true,
        label: vm.$t('description'),
        placeholder: vm.$t('description'),
        min: 3,
        rows: 4,
        styleClasses: 'col',
        validator: validators.string,
      },
      category: {
        type: 'select',
        required: false,
        disabled: true,
        values: Object.values(supportInfoCategory(vm)),
        selectOptions: {
          noneSelectedText: vm.$t('form_select_none_selected'),
        },
        label: vm.$t('support_category'),
        styleClasses: 'col',
      },
      file: {
        component: fieldFileUploader,
        idField: 'support_info_id',
        url: '/api/supports-info/support_files/upload/',
        stackedTable: true,
        disabled: true,
        multiple: false,
        label: vm.$t('record_card_file'),
        styleClasses: 'col',
      },
      link: {
        type: 'input',
        inputType: 'url',
        required: false,
        disabled: true,
        label: vm.$t('support_link'),
        placeholder: vm.$t('support_link'),
        min: 3,
        max: 200,
        styleClasses: 'col',
        validator: [validators.string, validators.url],
      },
    },
    {
      groups: [
        {
          fields: ['type'],
        },
        {
          fields: ['title'],
        },
        {
          fields: ['description'],
        },
      ],
    }
  )

export default {
  name: 'SupportItemForm',
  extends: SchemaForm,
  head() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: 'support_create_support_item',
    },
    url: {
      type: String,
      default: supportEndpoint,
    },
    backUrl: {
      type: String,
      default: 'backoffice-support',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
    resetDefaultButton: {
      type: Boolean,
      default: false,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      eventBus: new Vue(),
      uploadData: { success: null, files: [] },
    }
  },
  provide() {
    return {
      eventBus: this.eventBus,
    }
  },
  created() {
    if (this.isNewModel) {
      this.defaultModel()
    } else {
      this.adaptRequirements()
      this.setEditMode()
    }
  },
  mounted() {
    this.eventBus.$on('files-change', this.onFilesChange)
    this.eventBus.$on('upload-done', this.onUploadDone)
    this.eventBus.$on('delete-file', this.onDeleteFile)
  },
  beforeDestroy() {
    this.eventBus.$off('files-change', this.onFilesChange)
    this.eventBus.$off('upload-done', this.onUploadDone)
    this.eventBus.$off('delete-file', this.onDeleteFile)
  },
  methods: {
    /**
     * Overridden to add schemaDef restoration on form reset
     */
    defaultModel() {
      this.model = this.isNewModel
        ? schema.createDefaultObject(this.schemaDef)
        : this.getInitial()

      this.adaptRequirements()
      this.modelDefaultSet = true
      this.$emit('reset')
    },
    afterUpdate(schemaRef) {
      if (schemaRef === 'type') {
        this.adaptRequirements()
      }
    },
    /**
     * Overwritten to reset the model
     */
    onSuccess(response, sentObj) {
      if (
        this.uploadData.files.length &&
        !this.schemaDef.fields.file.disabled
      ) {
        this.uploadFiles(response.data.id)
      } else {
        this.onFormSaved(response, sentObj)
      }
    },
    uploadFiles(id) {
      this.eventBus.$emit('upload-files', id)
      this.openUploadingModal()
    },
    onFilesChange(files) {
      this.uploadData.files = files
    },
    onUploadDone(data) {
      this.uploadData.success = data.success
      this.uploadData.files = data.files
      this.$emit('upload-done', data)
    },
    onDeleteFile() {
      this.model.file = null
    },
    openUploadingModal() {
      this.$emit('open-uploading-modal', this.uploadData)
    },
    onUploadingModalClosed() {
      this.resetUploadData()
      this.onFormSaved()
    },
    resetUploadData() {
      this.uploadData.success = null
      this.uploadData.files = []
    },
    onFormSaved(response, sentObj) {
      this.defaultModel()
      if (this.successUrl) {
        this.$router.replace(this.getSuccessUrl(response.data))
      }
      this.$emit('form-saved', response, sentObj)
    },
    /**
     * Overwritten so the file is never sent, as it's done in another flow
     * except for deletion, which is done here
     */
    getSaveData(model) {
      return {
        file: model.file === null ? null : undefined,
      }
    },
    adaptRequirements() {
      this.setRegularRequirements()

      if (this.model.type >= 0) {
        if (this.model.type === supportInfoType(this).documentation.id) {
          this.setDocsRequirements()
        } else if (this.model.type === supportInfoType(this).video.id) {
          this.setVidRequirements()
        }
      }
    },
    setRegularRequirements() {
      this.resetSchema()
    },
    resetSchema() {
      this.schemaDef = this.getInitialDefinition().clone()
    },
    setEditMode() {
      this.schemaDef.fields.type.disabled = true
      this.schemaDef.fields.type.visible = false
    },
    setDocsRequirements() {
      this.schemaDef.fields.category.required = true

      this.schemaDef.fields.category.disabled = false
      this.schemaDef.fields.file.disabled = false
      this.schemaDef.fields.link.disabled = false

      this.schemaDef.layout.groups = [
        {
          fields: ['type'],
        },
        {
          fields: ['title'],
        },
        {
          fields: ['description'],
        },
        {
          fields: ['category'],
        },
        {
          fields: ['file'],
        },
        {
          fields: ['link'],
        },
      ]
    },
    setVidRequirements() {
      this.schemaDef.fields.link.required = true

      this.schemaDef.fields.link.disabled = false

      this.schemaDef.layout.groups = [
        {
          fields: ['type'],
        },
        {
          fields: ['title'],
        },
        {
          fields: ['description'],
        },
        {
          fields: ['link'],
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.irisbox {
  .footer-buttons {
    border-top-color: $gray-300;
    border-top-style: solid;
    border-top-width: 1px;
    padding-top: 1rem;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .btn {
      margin-left: 0;
      margin-right: 0 !important;
      margin-bottom: 1rem;
    }
  }
}

/* Allows textarea's rows attribute to work */
/deep/ .form-group.field-textArea .form-control {
  height: unset;

  // Unsets non scoped css by https://w33.bcn.cat/geobcn/js/0.5/jsapi.css
  border-color: rgb(212, 212, 212);
  background-color: #fff;
  outline: initial;
  box-shadow: initial;
  -webkit-box-shadow: initial;
  -moz-box-shadow: initial;
  -ms-box-shadow: initial;
}

// Unsets non scoped css by https://w33.bcn.cat/geobcn/js/0.5/jsapi.css
/deep/ input[type='url'] {
  width: 100%;
}
</style>
