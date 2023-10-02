<template>
  <div class="file-selector">
    <div
      class="col-lg-6"
    >
      <h4>{{ $t('file_upload_select_files') }}</h4>
      <select-table
        :initial="selected"
        id-attr="id"
        @selected-change="onChangeSelection">
        <files-table
          :prop-data="files"
          :allow-delete="false"
          :per-page="10000"
        />
      </select-table>
    </div>
    <div
      class="col-lg-6"
    >
      <h4>{{ $t('file_upload_upload_new') }}</h4>
      <file-uploader
        :model="record"
        :automated-upload="false"
        :name="name"
        :origin="filesOrigin"
        :allowed-extensions="allowedExtensions"
        @files-uploaded="onUploadFiles"
      />
    </div>
  </div>
</template>

<script>
import FileUploader from './FileUploader.vue'
import FilesTable from './FilesTable.vue'
import SelectTable from '~/components/pages/list/SelectTable.vue'
import { isEmpty } from 'lodash'

/**
 * Given a record cards, this component allows to select n files from
 * the record file list or upload new ones.
 */
export default {
  name: 'SelectOrUpload',
  components: {
    FileUploader,
    FilesTable,
    SelectTable,
  },
  props: {
    value: {
      type: Array,
      required: false,
      default: () => {
        return []
      },
    },
    name: {
      type: String,
      required: false,
      default: 'file',
    },
    record: {
      type: Object,
      required: true,
    },
    filesOrigin: {
      type: Number,
      required: true,
    },
    allowedExtensions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: this.value,
      uploaded: {},
    }
  },
  computed: {
    files() {
      return this.record.files.filter(file => {
        if (this.allowedExtensions.length == 0) {
          return true
        }
        const parts = file.filename.split('.')
        return (
          parts.length > 1 &&
          this.allowedExtensions.includes(parts[parts.length - 1])
        )
      })
    },
  },
  methods: {
    onChangeSelection(selected) {
      this.selected = selected
      this.$emit('input', this.selected)
    },
    onUploadFiles(files) {
      console.log(files)
      for (const file of files) {
        if (
          !isEmpty(file.response) &&
          this.uploaded[file.response.record_file_id] === undefined
        ) {
          const newFile = this.transformUploaded(file)
          this.record.files.push(newFile)
          this.selected = [...this.selected, newFile]
          Object.assign(this.uploaded, {
            [newFile.record_file_id]: newFile,
          })
        }
      }
      this.$emit('new-files', this.record.files)
    },
    transformUploaded(uFile) {
      return {
        ...uFile.response,
        id: uFile.response.record_file_id,
      }
    },
  },
}
</script>
