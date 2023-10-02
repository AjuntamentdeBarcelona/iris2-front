<template>
  <FileUploader
    ref="fileUploader"
    v-bind="fileUploaderProps"
    v-on="fileUploaderEventHandlers"
  />
</template>

<script>
import { abstractField } from 'vue-form-generator'
import irisField from '~/components/form-generator/irisField'
import FileUploader from '~/components/iris-pages/records/files/FileUploader'

/**
 * Extra schema options:
 * - multiple: Allows the selection of multiple files
 * - stackedTable: Vertical file table
 * - idField: Name to the field that contains the main object's id
 * - url: Endpoint
 * - allowedExtensions
 * - maxFileSize
 *
 * Requires the form to set the field's model to undefined whenever it's not null
 * and to provide an event bus instance so that the form is able to trigger the upload and delete methods
 * from across any nesting.
 *
 * Emit 'upload-files' to start uploading. May include an 'id' for newly created items.
 * Emit 'delete-all-files' to delete all the files.
 * Listen to 'files-change' to detect if the field has files that will be uploaded.
 * Listen to 'upload-done' to detect completion and trigger the appropriate behaviour.
 * Listen to 'delete-file' to detect initial value deletion
 */
export default {
  name: 'FieldFileUploader',
  components: { FileUploader },
  mixins: [abstractField, irisField],
  inject: ['eventBus'],
  data() {
    return {
      id: undefined,
    }
  },
  computed: {
    fileUploaderProps() {
      return {
        model: { ...{ id: this.id }, ...this.model },
        disabled: this.isDisabled,
        multiple: this.schema.multiple,
        stackedTable: this.schema.stackedTable,
        idField: this.schema.idField,
        url: this.schema.url,
        allowedExtensions: this.schema.allowedExtensions,
        maxFileSize: this.schema.maxFileSize,
        uploadIcon: this.schema.icon,
      }
    },
    hasFiles() {
      return this.$refs.fileUploader ? this.$refs.fileUploader.hasFiles : false
    },
  },
  created() {
    this.fileUploaderEventHandlers = {
      'files-change': this.onFilesChange,
      'files-not-allowed': this.onFilesNotAllowed,
      'upload-done': this.onUploadDone,
      'delete-file': this.onDeleteFile,
    }
  },
  mounted() {
    this.eventBus.$on('upload-files', this.uploadFiles)
    this.eventBus.$on('delete-all-files', this.deleteAllFiles)
  },
  beforeDestroy() {
    this.eventBus.$off('upload-files', this.uploadFiles)
    this.eventBus.$off('delete-all-files', this.deleteAllFiles)
  },
  methods: {
    uploadFiles(id) {
      this.id = id
      this.$refs.fileUploader.startUpload()
    },
    deleteAllFiles() {
      this.$refs.fileUploader.deleteAllFiles()
    },
    onFilesChange(files) {
      this.eventBus.$emit('files-change', files)
      this.$emit('validated', true, [], this)
    },
    onFilesNotAllowed(errors) {
      this.$emit('validated', false, errors, this)
    },
    onUploadDone(data) {
      this.eventBus.$emit('upload-done', data)
    },
    onDeleteFile() {
      this.eventBus.$emit('delete-file')
    },
  },
}
</script>
