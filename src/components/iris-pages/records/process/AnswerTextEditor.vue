<template>
  <div 
    v-if="isNone"
    class="answer-text-editor row alert alert-info">
    {{ $t('response_not_required') }}
  </div>
  <div
    v-else
    class="answer-text-editor row">
    <div
      v-if="letterMessage" 
      class="alert alert-info col-12">
      {{ letterMessage }}
    </div>
    <div
      v-if="!disabled"
      class="col-12 col-md-6 col-lg-12 toolbar">
      <dynamic-tag-modal
        v-b-tooltip="$t('answer_master_start_template_select')"
        ref="masterModal"
        :component-props="{variant:'outline-primary'}"
        :show-scroll="true"
        :preload="loadTemplates"
        :disabled="loadingTemplates"
        width="80%"
      >
        <font-awesome-icon icon="list"/>
        <template slot="modal">
          <answer-master
            :record="record"
            @selected-template-text="newText"
            @default-found="setDefault"
            @loading="templateLoading" />
        </template>
      </dynamic-tag-modal>
      <dynamic-tag-modal
        v-b-tooltip="$t('answer_preview_click')"
        ref="previewModal"
        :component-props="{variant:'outline-primary'}"
        :show-scroll="true"
        :disabled="!value"
        :reset-on-close="true"
        width="80%"
      >
        <font-awesome-icon icon="eye"/>
        <template slot="modal">
          <answer-preview
            :record-id="record.id"
            :text="value"
            @ready="previewReady" />
        </template>
      </dynamic-tag-modal>
      <dynamic-tag-modal
        v-if="canAdminTemplates"
        ref="saveModal"
        :component-props="{variant:'btn-outline-secondary'}"
        :show-scroll="true"
        class="btn btn-outline-secondary"
        width="80%"
      >
        {{ $t('record_card_answer_save_as_group') }}
        <font-awesome-icon icon="save"/>
        <template slot="modal">
          <group-template-form
            :record="record"
            :initial="{text: value}"
            :text-attribute="textAttribute"
            @form-saved="onSaveAsTemplate" />
        </template>
      </dynamic-tag-modal>
      <div
        v-if="loadingTemplates"
        class="badge badge-info">
        {{ $t('record_template_loading') }}...
      </div>
    </div>
    <div
      class="d-flex col-12 col-md-6 col-lg-12 ">
      <div class="form-group mt-auto mb-auto mr-2 field-checkbox">
        <div class="field-wrap ml-auto field-select-record-type">
          <label>
            <input
              v-model="notify_quality"
              type="checkbox">
            {{ $t('record_card_answer_improvement') }}
          </label>
        </div>
      </div>
      <div
        v-if="canSetWorked"
        class="form-group field-select mt-auto">
        <div class="field-wrap ml-auto">
          <select
            id="worked"
            v-model="worked"
            class="mt-0 form-control"
            active="true"
            extra-errors="">
            <option
              v-for="wo in workedOptions"
              :key="wo.value"
              :value="wo.value">
              {{ wo.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="col-12">
      <vue-editor
        v-if="!smsMode"
        v-model="value"
        :editor-toolbar="editorToolbar"
        :editor-options="editorOptions"
        :disabled="disabled || loadingTemplates"
        class="w-100"
      />
      <sms-editor
        v-if="smsMode"
        v-model="value"
        :disabled="disabled || loadingTemplates"
        class="w-100"
        @validated="smsValidated"/>

    </div>
    <div class="col-12">
      <div
        class="form-group mt-1 col field-checkbox d-flex no-answer-check">
        <selected-answer-files
          v-if="!disabled && recordForFiles"
          v-model="selectedFiles"
          :record="recordForFiles"
          :name="filesName"
          :only-pdf="onlyPdf"
          :files-origin="filesOrigin" />
        <div v-if="disabled && selectedFiles.length">
          <a
            v-for="file in selectedFiles"
            :key="file.id"
            :href="file.file"
            target="_blank"
            class="btn btn-outline-secondary mr-1 mt-1">
            <font-awesome-icon icon="paperclip"/>
            {{ file.filename }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { abstractField } from 'vue-form-generator'
import irisField from '~/components/form-generator/irisField.js'
import AnswerMaster from '~/components/iris-pages/templates/AnswerMaster.vue'
import AnswerPreview from '~/components/iris-pages/records/AnswerPreview.vue'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'
import SmsEditor from './SmsEditor'
import { VueEditor } from 'vue2-editor'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import { error } from 'util'
import { mapGetters, mapState } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'
import AnswerTags from '~/assets/js/iris2/model/AnswerTags.js'
import GroupTemplateForm from '~/components/iris-pages/templates/GroupTemplateForm.vue'
import SelectedAnswerFiles from './SelectedAnswerFiles'
import FilesType from '~/assets/js/iris2/model/FileTypes.js'
import _ from 'lodash'

export default {
  name: 'AnswerTextEditor',
  components: {
    AnswerMaster,
    DynamicTagModal,
    VueEditor,
    SmsEditor,
    AnswerPreview,
    GroupTemplateForm,
    SelectedAnswerFiles,
  },
  mixins: [irisField, abstractField],
  data() {
    return {
      errors: [],
      worked: this.model.worked || '',
      notify_quality: this.model.notify_quality,
      avoid_send: this.model.avoid_send,
      edit: null,
      loadTemplates: false,
      loadingTemplates: false,
      defaultSet: false,
      selectedFiles: this.model.record_files,
    }
  },
  computed: {
    ...mapGetters('groups', ['hasPermission']),
    ...mapState(['parameters']),
    workflow() {
      return _.get(this.model, 'current.workflow', { records: [this.record] })
    },
    isUnirecord() {
      return _.get(this.workflow, 'records', []).length > 1
    },
    record() {
      return this.model.record
    },
    responseChannel() {
      return _.get(
        this.record,
        'recordcardresponse.response_channel',
        ResponseChannel.NONE
      )
    },
    isNone() {
      return this.responseChannel === ResponseChannel.NONE
    },
    onlyPdf() {
      return this.responseChannel == ResponseChannel.LETTER
    },
    /**
     * According to the answer type, the record is saved.
     */
    smsMode() {
      return !ResponseChannel.isLongAnswer(this.responseChannel)
    },
    filesName() {
      return `${this.record.id}_response_files`
    },
    textAttribute() {
      return this.smsMode ? 'sms_medium_catalan' : 'write_medium_catalan'
    },
    hasMany() {
      return this.schema.manyMode
    },
    workedOptions() {
      return AnswerTags.list(this)
    },
    canSetWorked() {
      return this.hasPermission(Permissions.RECORD.ANSWER_SET_WORKED)
    },
    canAdminTemplates() {
      return this.hasPermission(Permissions.TEMPLATE.GROUP_ADMIN)
    },
    editorOptions() {
      return {
        placeholder:
          this.value || this.disabled ? '' : this.$t('wysiwyg_placeholder'),
        formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list'],
      }
    },
    letterMessage() {
      if (this.responseChannel == ResponseChannel.LETTER) {
        return this.parameters.get('RESPOSTA_CARTA_FIXA', '')
      }
      return ''
    },
    editorToolbar() {
      return [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ]
    },
    /**
     * On unirecords the files are uploaded and selected from the main record.
     * This way, if we are in other record but the main, we must load and use the main
     * record of the workflow.
     */
    recordForFiles() {
      if (this.isUnirecord) {
        return this.workflow.main_record_card_id
      }
      return this.model.current
    },
    filesOrigin() {
      return FilesType.ANSWER
    },
  },
  watch: {
    worked() {
      Object.assign(this.model, {
        worked: this.worked,
      })
      this.$emit('model-updated')
    },
    notify_quality() {
      Object.assign(this.model, {
        notify_quality: this.notify_quality,
      })
      this.$emit('model-updated')
    },
    avoid_send() {
      Object.assign(this.model, {
        avoid_send: this.avoid_send,
      })
      this.$emit('model-updated')
    },
    selectedFiles() {
      Object.assign(this.model, {
        record_files: this.selectedFiles,
      })
      this.$emit('model-updated')
    },
  },
  mounted() {
    if (!this.value && !this.disabled) {
      this.loadTemplates = true
      this.loadingTemplates = true
    }
  },
  methods: {
    setDefault(answer) {
      if (!this.value && !this.defaultSet) {
        this.newText(answer)
        this.defaultSet = true
      }
    },
    templateLoading(loading) {
      this.loadingTemplates = loading
    },
    newText(answerData) {
      let text = this.hasMany ? answerData.original_text : answerData.text
      text = text
        .split('\n')
        .map(str => (this.smsMode ? str : `<p>${str}</p>`))
        .join('')
      Object.assign(this.model, { templated: text })
      this.value = text
      this.$refs.masterModal.close()
    },
    smsValidated(valid, errors) {
      this.errors = errors
      this.$emit('validated', valid, errors, this)
    },
    previewReady() {
      this.$refs.previewModal.close()
    },
    onSaveAsTemplate() {
      this.$refs.saveModal.close()
    },
    validate() {
      this.$emit('validated', this.errors.length == 0, this.errors, this)
      return this.errors.length == 0
    },
  },
}
</script>

<style lang="scss">
.answer-text-editor .toolbar {
  margin-bottom: 10px;
}

.field-answer-text-editor {
  padding-bottom: 0px;
}
</style>
