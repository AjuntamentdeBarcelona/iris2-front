<template>
  <div>
    <header class="cardi__header px-2">
      <modal-form-button
        v-if="canAddFiles"
        :record-card="recordCard"
        :form-component="formComponent"
        :form-component-is-schema-form="false"
        :form-props="formProps"
        :icon="'paperclip'"
        reset-on-close
        open-button-text-key="record_card_attach_file"
        open-button-variant="primary"
        modal-content-text-key="files_modal_text"
        url="/api/record_cards/record_files/upload/"
        class="w-100"
        width="80%"
        @action-done="fileUploaded"
        @modal-closed="modalClosed"
      >
        <h3 class="mr-auto">{{ $t('record_card_attached_files') }}</h3>
      </modal-form-button>

    </header>
    <div class="cardi cardi--files">
      <div class="row my-2">
        <button
          v-b-toggle.arxiusadjunts
          class="col-12 cardi__main-title">
          <h4>{{ $t('record_card_files') }}</h4>
          <div class="ml-auto">
            <small>
              {{ $t('show_more_content') }}
            </small>
            <i class="fas fa-caret-right card-toggle ml-1" />
          </div>
        </button>

        <b-collapse
          id="arxiusadjunts"
          class="w-100 pt-1"
          visible
        >
          <div
            v-if="missingFiles && false"
            class="alert alert-warning">
            {{ $t('record_card_copiying_files') }}
          </div>
          <files-table
            :prop-data="files"
            :allow-delete="canDeleteFiles"
            @deleted="fileDeleted"
          />
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import ModalFormButton from '~/components/forms/buttons/ModalFormButton'
import FilesTable from '~/components/iris-pages/records/files/FilesTable'
import FileUploader from '~/components/iris-pages/records/files/FileUploader'
import { get } from 'lodash'

export default {
  components: {
    ModalFormButton,
    FilesTable,
  },
  props: {
    recordCard: {
      type: Object,
      required: true,
    },
    canAddFiles: {
      type: Boolean,
      required: true,
    },
    canDeleteFiles: {
      type: Boolean,
      required: true,
    },
    missingFiles: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      files: get(this, 'recordCard.files', []).map(file => ({
        ...file,
        file: this.adaptUrl(file.file),
      })),
      formProps: { automatedUpload: false },
      newFilesUploaded: false,
    }
  },
  created() {
    this.formComponent = FileUploader
  },
  methods: {
    openModal() {
      this.$refs.modal.open()
    },
    closeModal() {
      this.$refs.modal.close()
    },
    fileUploaded() {
      this.newFilesUploaded = true
    },
    modalClosed() {
      if (this.newFilesUploaded) {
        this.newFilesUploaded = false
        this.$emit('file-uploaded')
      }
    },
    fileDeleted(delete_url) {
      this.files = this.files.filter(file => file.delete_url !== delete_url)
    },
    /**
     * Using a relative MEDIA_URL setting on backend's app.ini (for instance to upload files locally instead of an s3)
     * results on relative file urls.
     * This method can be used to adapt the url using the retrieved config.json's MEDIA_URL variable (src/static/config.json),
     * which should only be set on the following scenario:
     * -We're on local env
     * -A relative MEDIA_URL has been set
     */
    adaptUrl(url) {
      return url
    },
  },
}
</script>
