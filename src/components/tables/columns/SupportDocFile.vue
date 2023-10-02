<template>
  <div
    class="d-flex flex-column align-items-center"
  >
    <!-- File -->
    <b-link
      v-if="data.file"
      :title="fileName"
      :href="data.file"
      target="_blank"
    >
      <font-awesome-icon
        :icon="['far', fileIcon]"
      />
    </b-link>

    <!-- Link -->
    <b-link
      v-if="data.link && !data.file"
      :title="data.link"
      :href="data.link"
      :class="{'bordered-link' : data.file}"
      target="_blank"
    >
      <font-awesome-icon
        :icon="['fa', 'link']"
      />
    </b-link>
    <!-- None -->
    <span v-if="!data.file && !data.link">-</span>
  </div>
</template>

<script>
const fileTypeMap = {
  pdf: 'file-pdf',
  xlsx: 'file-excel',
  xls: 'file-excel',
  ods: 'file-excel',
  docx: 'file-word',
  doc: 'file-word',
  odt: 'file-word',
  jpeg: 'file-image',
  jpg: 'file-image',
  png: 'file-image',
}

export default {
  name: 'SupportDocFileColumn',
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
  },
  computed: {
    fileName() {
      return this.data.file
        ? this.data.file
            .split('/')
            .slice(-1)[0]
            .split('?')[0]
        : null
    },
    fileType() {
      return this.fileName ? this.fileName.split('.').slice(-1)[0] : null
    },
    fileIcon() {
      return fileTypeMap[this.fileType] || 'file'
    },
  },
}
</script>

<style lang="scss" scoped>
.bordered-link {
  border-top: 1px solid $gray-700;
  margin-top: 0.5rem;
  padding-top: 0.15rem;
}
</style>
