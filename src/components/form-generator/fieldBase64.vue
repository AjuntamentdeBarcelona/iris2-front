<template>
  <div class="base64-file-uploader">
    <base64
      :max-size="maxSize"
      :accept="mimeTypes"
      :preview-tag="previewTag"
      :value="value"
      :show-allowed-extensions="schema.showAllowedExtensions"
      :show-max-size="schema.showMaxSize"
      :show-files="schema.showFiles"
      :minimal-mode="schema.minimalMode"
      class="v1"
      image-class="v1-image"
      input-class="v1-input"
      @invalid-file="onInvalidFile"
      @new-file="onFile"
      @delete-files="onDeleteFiles"
    />
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import irisField from './irisField.js'
import Base64 from '~/components/forms/Base64.vue'

var _ = require('lodash')

/**
 * File for uploading files using the base64 format, by wrapping the
 * file-base64 field. In addition, it can display the current file
 * value by previewing them.
 *
 * - Input value: URL of the previously upload reasource.
 * - Output value: base64 string for uploading. If the file didn't changed,
 * the output value will be undefined, for avoiding sending the file again.
 *
 * This component is not meant for multiple file.
 *
 * The field allows the following schema options:
 * - accepts: list of accepted mime file types (image/png,image/jpeg for example).
 * - maxSize: max size in kbs.
 * - previewTag: component or html tag for rendering the preview.
 */
export default {
  name: 'FieldBase64',
  components: {
    Base64,
  },
  mixins: [abstractField, irisField],
  data() {
    return {
      preview: this.value,
    }
  },
  computed: {
    mimeTypes() {
      return this.schema.accepts
    },
    maxSize() {
      return this.schema.maxSize
    },
    previewTag() {
      return this.schema.previewTag
    },
  },
  /**
   * On mount value must be set to undefined for not resending the value on save.
   */
  mounted() {
    this.value = undefined
  },
  methods: {
    onFile(fileInfo) {
      this.value = fileInfo.base64
      this.$emit('validated', true, [], this)
    },
    onDeleteFiles() {
      this.value = null
      this.$emit('validated', true, [], this)
    },
    onInvalidFile(fileInfo, errors) {
      this.$emit('validated', false, errors, this)
    },
  },
}
</script>
