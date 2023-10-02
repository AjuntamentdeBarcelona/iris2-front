<template>
  <div class="base-64-file">
    <component
      v-if="previewTag"
      v-show="previewUrl"
      :is="previewTag"
      :src="previewUrl"
      class="preview"
    />
    <!-- Input -->
    <input
      ref="input"
      :class="{'hidden-input': minimalMode}"
      :multiple="false"
      v-bind="fieldOptions"
      type="file"
      @change="onChange"
    >
    <!-- Button (input replacement) -->
    <div>
      <b-button
        v-if="minimalMode"
        size="sm"
        @click="clickInput"
      >
        <font-awesome-icon
          icon="upload"
          size="sm"
        />
        {{ $t('file_upload_select_file') }}
      </b-button>

      <b-button
        v-if="previewUrl"
        size="sm"
        variant="danger"
        class="mt-1"
        @click="onDeleteFiles"
      >
        <font-awesome-icon
          icon="trash"
          size="sm"
        />
        {{ $t('file_delete') }}
      </b-button>
    </div>
    <!-- Hint -->
    <div
      v-if="showAllowedExtensions || showMaxSize"
      class="hint"
      v-text="hintMessage"
    />

    <!-- File list -->
    <div
      v-if="showFiles && fileNames.length"
      class="mt-1"
    >
      <!-- <h5
        class="mb-0"
        v-text="`${fileNames.length === 1 ? $t('file_upload_file') : $t('file_upload_files')}:`"
      /> -->
      <div
        v-for="(fileName, index) of fileNames"
        :key="index"
        v-text="`· ${fileName}`"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Initial preview value, meant for update forms, where the field
     * can have a selected file that can be changed.
     */
    value: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * HTML attributes for the undeliying file input.
     */
    fieldOptions: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
    /**
     * Accepted mime types. Null for allowing all.
     */
    accept: {
      type: Array,
      required: false,
      default: undefined,
    },
    /**
     * Max file size in kbs. Default 2048.
     */
    maxSize: {
      type: Number,
      required: false,
      default: 2048,
    },
    /**
     * Type of HTML tag for the file preview. Empty for no preview.
     */
    previewTag: {
      type: String,
      required: false,
      default: 'img',
    },
    showAllowedExtensions: {
      type: Boolean,
      default: false,
    },
    showMaxSize: {
      type: Boolean,
      default: false,
    },
    showFiles: {
      type: Boolean,
      default: false,
    },
    minimalMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      fileInfo: null,
      previewUrl: this.value,
    }
  },
  computed: {
    acceptedExtensions() {
      if (this.accept) {
        return this.accept.map(mime => mime.split('/')[1])
      }
      return []
    },
    hintMessage() {
      const allowedExtensions = this.showAllowedExtensions
        ? this.acceptedExtensions.join(', ')
        : ''
      const maxSize = this.showMaxSize
        ? this.$options.filters.formatSize(this.maxSize * 1024)
        : ''

      return `${this.$t(
        'file_upload_allowed'
      )}: ${allowedExtensions} ${maxSize}`
    },
    fileNames() {
      return Object.values(this.files).map(file => file.name)
    },
  },
  created() {
    this.assignInitialFiles()
  },
  methods: {
    assignInitialFiles() {
      if (this.previewUrl) {
        this.files = Array.isArray(this.previewUrl)
          ? this.previewUrl.map(link => ({ name: this.getNameFromLink(link) }))
          : [{ name: this.getNameFromLink(this.previewUrl) }]
      }
    },
    onChange(e) {
      const file = e.target.files[0]

      // Opening the dialog usually deletes the file and triggers a 'change' event
      if (file) {
        this.loadFile(file)
        this.updateFiles()
      }
    },
    /**
     * Read the file received from the input, following the browser indications.
     *
     * @ref https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
     */
    loadFile(file) {
      const reader = new FileReader()
      reader.onload = () => {
        let fileInfo = this.createFileObject(file, reader)
        this.checkNewFile(fileInfo)
      }
      reader.readAsDataURL(file)
    },
    /**
     * Each readen file is converted to an object format more suitable for working
     * and validating them.
     */
    createFileObject(file, reader) {
      return {
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1000),
        base64: reader.result,
        file: file,
      }
    },
    /**
     * Reviews the loaded file and sets the value if valid.
     */
    checkNewFile(fileInfo) {
      const errors = this.validate(fileInfo)
      if (errors.length > 0) {
        this.emitInvalidFile(fileInfo, errors)
      } else {
        this.fileInfo = fileInfo
        this.setPreview(fileInfo)
        this.emitNewFile()
      }
    },
    validate(fileInfo) {
      let errors = []
      if (fileInfo.size > this.maxSize) {
        errors.push(
          this.$t('form_file_size_exceeded').replace('{}', this.maxSize + 'kb')
        )
      }

      if (
        this.accept &&
        !this.acceptedExtensions.includes(
          this.getFileExtensionFromFile(fileInfo)
        )
      ) {
        // Previous comparison based on MIME types
        // if (this.accept && this.accept.indexOf(fileInfo.type) < 0) {
        errors.push(
          this.$t('form_file_invalid_type').replace(
            '{}',
            this.acceptedExtensions.join(', ')
          )
        )
      }
      return errors
    },
    setPreview(fileInfo) {
      this.previewUrl = fileInfo.base64
    },
    hidePreview(fileInfo) {
      this.previewUrl = ''
    },
    emitInvalidFile(fileInfo, errors) {
      this.$emit('invalid-file', fileInfo, errors)
    },
    emitNewFile() {
      this.$emit('new-file', this.fileInfo)
    },
    emitDeleteFiles() {
      this.$emit('delete-files')
    },
    getNameFromLink(link) {
      return link
        .split('/')
        .slice(-1)[0]
        .split('?')[0]
    },
    getFileExtensionFromFile(file) {
      return file.name.split('.').slice(-1)[0]
    },
    updateFiles() {
      this.files = this.$refs.input.files
    },
    clickInput() {
      this.$refs.input.click()
    },
    onDeleteFiles() {
      this.hidePreview()
      this.deleteFiles()
      this.emitDeleteFiles()
    },
    deleteFiles() {
      this.$refs.input.value = ''
      this.fileInfo = null
      this.files = []
    },
  },
}
</script>

<style lang="scss">
.preview {
  max-width: 90%;
  margin: 0px 5px 5px 0px;
}

.hidden-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
