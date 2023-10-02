<template>
  <loader v-if="loading"/>
  <div
    v-else-if="loadingError"
    class="alert alert-danger"
    v-text="$t('file_upload_loading_error')"
  />
  <div
    v-else
    class="files"
  >
    <div class="upload">
      <!-- File list or initial message -->
      <b-table
        v-if="files.length"
        :items="files"
        :fields="columns"
        :stacked="stackedTable"
        hover
        responsive
      >

        <template
          slot="status"
          slot-scope="data"
        >
          <record-card-file-upload-status
            :data="merge(data, {item: {status: fileStatus(data.item), statusMapping: statusMapping}})"
            :index="data.index"
            :column="data.field.key"
          />
        </template>

        <template
          slot="delete"
          slot-scope="data"
        >
          <b-button
            :disabled="data.item.success"
            variant="link"
            @click="deleteFile(data.item.id)"
          >
            <font-awesome-icon icon="trash"/>
          </b-button>
        </template>
      </b-table>

      <div
        v-else
        class="py-3 mb-3 dropzone d-flex flex-column flex-wrap h6"
      >
        <p class="px-3">
          <template v-if="!automatedUpload">1º </template>{{ multiple ? $t('files_drop_text_1') : $t('files_drop_text_1_singular') }}
        </p>
        <p
          v-if="!automatedUpload"
          class="px-3">2º {{ $t('files_drop_text_2') }}</p>
        <p
          v-if="showAllowed"
          class="px-3">
          {{ $t('files_allowed_extensions') }}:
          <template v-for="(extension, index) in finalAllowedExtensions">
            {{ `${extension}${index + 1 &lt; finalAllowedExtensions.length ? ',' : '.'}` }}
          </template>
        </p>
        <p class="px-3">{{ $t('files_max_size') }}: {{ finalMaxFileSize | formatSize }}</p>
      </div>

      <!-- Drop overlay -->
      <div
        v-show="$refs.upload && $refs.upload.dropActive"
        class="drop-active">
        <h3>{{ $t('files_drop_overlay') }}</h3>
      </div>

      <!-- Buttons -->
      <div class="buttons">
        <!-- Select files button -->
        <file-upload
          ref="upload"
          v-model="files"
          :name="name"
          :drop="true"
          :multiple="multiple"
          :extensions="finalAllowedExtensions"
          :size="finalMaxFileSize"
          :timeout="timeOut"
          :chunk-enabled="true"
          :chunk="chunkOptions"
          class="btn btn-outline-secondary"
          @input-file="inputFile"
          @hook:created="onFileUploadCreated"
        >
          <font-awesome-icon
            :icon="iconName"/>
          {{ multiple ? $t('files_select_files') : $t('files_select_file') }}
        </file-upload>
        <!-- Upload files button -->
        <template v-if="!automatedUpload">
          <button
            v-if="!$refs.upload || !$refs.upload.active
            "
            type="button"
            class="btn btn-success"
            @click.prevent="startUpload">
            <font-awesome-icon
              :icon="['fas', 'file-upload']"/>
            {{ $t('files_start_upload') }}
          </button>
          <!-- Cancel upload button -->
          <button
            v-else
            type="button"
            class="btn btn-danger"
            @click.prevent="stopUpload">
            <i
              class="fa fa-stop"
              aria-hidden="true"/>
            {{ $t('files_stop_upload') }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import CustomChunkUploadHandler from '~/components/iris-pages/records/files/CustomChunkUploadHandler'
import Loader from '~/components/utils/Loader'
import Vue from 'vue'
import RecordCardFileUploadStatus from '~/components/tables/columns/RecordCardFileUploadStatus'
import { merge } from 'lodash'
import FilesType from '~/assets/js/iris2/model/FileTypes.js'
import { mapActions, mapState } from 'vuex'
import {
  allowedExtensionsParameter,
  maxFileSizeParameter,
} from '~/assets/js/iris2/constants'
import { throws } from 'assert'

const initial = 0
const uploading = 1
const error = 2
const success = 3

const statuses = new Map([
  [initial, 'initial'],
  [uploading, 'uploading'],
  [error, 'error'],
  [success, 'success'],
])

export default {
  name: 'FileUploader',
  components: {
    FileUpload,
    Loader,
    RecordCardFileUploadStatus,
  },
  props: {
    url: {
      type: String,
      default: '/api/record_cards/record_files/upload/',
    },
    name: {
      type: String,
      default: 'file',
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    idField: {
      type: String,
      default: 'record_card_id',
    },
    /**
     * Allows usage from a ModalFormButton
     */
    recordCard: {
      type: Object,
      default: () => ({}),
    },
    formComponentData: {
      type: Object,
      default: () => {},
    },
    automatedUpload: {
      type: Boolean,
      default: true,
    },
    stackedTable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    showAllowed: {
      type: Boolean,
      default: true,
    },
    origin: {
      type: Number,
      default: FilesType.DETAIL,
    },
    allowedExtensions: {
      type: Array,
      default: () => [],
    },
    maxFileSize: {
      type: Number,
      default: 0 * 2 ** 20, // 0Mb
    },
    iconName: {
      type: [Array, String],
      default() {
        return ['fas', 'file-upload']
      },
    },
  },
  data() {
    return {
      files: [],
      timeOut: 60 * 1000, // 60s
      loading: null,
      configApp: {},
      sessionInfo: {},
      merge: merge,
      columns: [
        {
          key: 'name',
          label: this.$t('files_filename'),
        },
        {
          key: 'size',
          label: this.$t('files_size'),
          formatter: Vue.filter('formatSize'),
        },
        ...(this.automatedUpload
          ? []
          : [
              {
                // Slotted
                key: 'status',
                label: this.$t('files_status'),
                tdClass: this.statusCellClass,
              },
            ]),
        {
          // Slotted
          key: 'delete',
          label: this.$t('delete'),
        },
      ],
      componentReady: false,
      loadingError: false,
    }
  },
  computed: {
    fullUrl() {
      try {
        return new URL('.' + this.url, this.configApp.API_BASE_URL).toString()
      } catch (e) {
        const base = this.configApp.API_BASE_URL
        if (base[base.length - 1] == '/') {
          return base.substr(0, base.length - 1) + this.url
        }
        return base + this.url
      }
    },
    statusMapping() {
      return {
        constants: { initial, uploading, error, success },
        map: statuses,
      }
    },
    chunkOptions() {
      return {
        headers: {
          ...this.$axios.defaults.headers.common,
        },
        action: this.fullUrl,
        minSize: 0, // Important, backend requires chunking no matter the size
        maxActive: 1, // Important, backend requires chunks to be sent in order
        maxRetries: 1,
        chunkSize: 100 * 1024 ** 2, // Bytes => 100mb (NO SUPPORT FOR CHUNKING, API MANAGER LIMITS THE SIZE)
        handler: CustomChunkUploadHandler,
        startBody: {
          [this.idField]: this.model.id || this.recordCard.id,
          file_type: this.origin,
        },
        uploadBody: {
          [this.idField]: this.model.id || this.recordCard.id,
        },
      }
    },
    uploading() {
      return this.componentReady ? this.$refs.upload.active : undefined
    },
    uploadWithFullSuccess() {
      return (
        Boolean(this.files.length) && this.files.every(file => file.success)
      )
    },
    errors() {
      return this.componentReady
        ? this.$refs.upload.files.map(file => file.error).filter(error => error)
        : []
    },
    hasErrors() {
      return Boolean(this.errors.length)
    },
    hasFiles() {
      return Boolean(this.files.length)
    },
    hadFiles() {
      return Boolean(this.model[this.name])
    },
    uploadDone() {
      return !this.uploading && (this.hasErrors || this.uploadWithFullSuccess)
    },
    finalAllowedExtensions() {
      return this.allowedExtensions.length
        ? this.allowedExtensions
        : this.parameters
            .get(allowedExtensionsParameter, '')
            .split(',')
            .filter(e => e !== '')
            .map(e => e.trim().toLowerCase())
    },
    finalMaxFileSize() {
      return this.maxFileSize
        ? this.maxFileSize
        : this.parameters.get(maxFileSizeParameter, 0) * 2 ** 20
    },
    ...mapState(['parameters']),
  },
  watch: {
    model: {
      immediate: true,
      handler(value, oldVal) {
        // Currently has support for single file mode
        if (!this.multiple && value[this.name]) {
          if (
            oldVal === undefined ||
            !oldVal[this.name] ||
            value[this.name] !== oldVal[this.name]
          ) {
            this.files = [
              {
                active: false,
                data: {},
                error: '',
                file: null,
                headers: {},
                id: Math.random()
                  .toString(36)
                  .substr(2),
                name: this.getNameFromLink(this.model[this.name]),
                postAction: undefined,
                progress: '0.00',
                putAction: undefined,
                response: {},
                size: '',
                success: false,
                timeout: this.timeout,
                type: '',
              },
            ]
          }
        }
      },
    },
    files(value, oldVal) {
      this.$emit('files-change', value.slice())
      this.eagerFileChecks(value)

      if (!value.length && this.hadFiles) {
        this.$emit('delete-file')
      }
    },
    uploadDone(value, oldVal) {
      if (value) {
        this.$emit('upload-done', {
          success: this.uploadWithFullSuccess,
          files: this.files.slice(),
        })
      }
    },
  },
  created() {
    this.loadRequiredConfigData()
  },
  methods: {
    async loadRequiredConfigData() {
      this.loading = true
      this.loadingError = false
      try {
        console.log(this.$axios.defaults)
        console.log(this.$auth, this.$auth.strategy)
        this.configApp = this.$irisConfig
        await this.loadParams()
      } catch (e) {
        console.log(e)
        this.loadingError = true
      } finally {
        this.loading = false
      }
    },
    startUpload() {
      this.$refs.upload.active = true
    },
    stopUpload() {
      this.$refs.upload.active = false
    },
    deleteFile(fileId) {
      this.files = this.files.filter(file => file.id !== fileId)
    },
    deleteAllFiles() {
      this.files = []
    },
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && newFile.success !== oldFile.success) {
        this.$emit('form-saved')
        this.$emit('files-uploaded', this.files)
      }
    },
    eagerFileChecks(files) {
      const results = [
        ...this.checkFilesExtension(files),
        ...this.checkFilesSize(files),
      ]

      if (results.length) {
        this.$emit('files-not-allowed', results)
      }
    },
    checkFilesExtension(files) {
      const reducer = (accumulator, currentValue) => {
        if (
          !this.finalAllowedExtensions.includes(
            this.getFileExtensionFromName(currentValue.name)
          )
        ) {
          accumulator.push(
            `"${currentValue.name}": ${this.$t(
              'support_file_extension_not_allowed'
            )}`
          )
        }
        return accumulator
      }

      return files.reduce(reducer, [])
    },
    checkFilesSize(files) {
      const reducer = (accumulator, currentValue) => {
        if (currentValue.size > this.finalMaxFileSize) {
          accumulator.push(
            `"${currentValue.name}": ${this.$t(
              'support_file_size_not_allowed'
            )}`
          )
        }
        return accumulator
      }

      return files.reduce(reducer, [])
    },
    /**
     * Returns the appropriated td class for each cell
     */
    statusCellClass(value, key, item) {
      const fileStatus = this.fileStatus(item)

      switch (fileStatus) {
        case statuses.get(success):
          return 'alert-success'
        case statuses.get(uploading):
          return 'alert-info'
        case statuses.get(error):
          return 'alert-danger'
        default:
          return ''
      }
    },
    fileStatus(file) {
      if (file.success) return statuses.get(success)
      if (file.active) return statuses.get(uploading)
      if (file.error) return statuses.get(error)
      return statuses.get(initial)
    },
    onFileUploadCreated() {
      this.componentReady = true
      this.$emit('component-ready')
    },
    getNameFromLink(link) {
      return link
        .split('/')
        .slice(-1)[0]
        .split('?')[0]
    },
    getFileExtensionFromName(name) {
      return name.split('.').slice(-1)[0]
    },
    ...mapActions(['loadParams']),
  },
}
</script>

<style lang="scss" scoped>
.files {
  .dropzone {
    border: 2px dashed $gray;
  }
  .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: $zindex-modal;
    opacity: 0.6;
    text-align: center;
    background: $black;
    h3 {
      margin: -0.5em 0 0;
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      font-size: 40px;
      color: $white;
      padding: 0;
    }
  }
  /deep/ button.btn-link {
    padding: 0;
    > svg {
      margin: 0;
    }
  }
  .buttons {
    margin-top: -0.5rem;
    > .btn {
      margin-top: 0.5rem;
    }
  }
}
</style>
