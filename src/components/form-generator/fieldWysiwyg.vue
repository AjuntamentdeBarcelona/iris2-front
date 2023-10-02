<template>
  <div id="app">
    <vue-editor
      v-model="value"
      :editor-toolbar="schema.editorToolbar"
      :editor-options="editorOptions"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'FieldWysiwyg',
  components: {
    'vue-editor': VueEditor,
  },
  mixins: [irisField, abstractField],
  computed: {
    editorOptions() {
      return {
        ...(this.schema.editorOptions || {}),
        ...(this.disabled && this.value ? { placeholder: '' } : {}),
      }
    },
  },
}
</script>
