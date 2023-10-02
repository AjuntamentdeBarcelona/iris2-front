<template>
  <div class="template-text-editor">
    <div class="row">
      <variable-selector 
        class="col-4 var-selector" 
        @selected="addVar"/>
      <div class="col-8">
        <textarea 
          v-if="editorComponent == 'textarea'"
          ref="text" 
          v-model="value" 
          class="form-control"
          @click="onTextAreaSelection"
          @input="onTextAreaSelection"
        />
        <component
          v-else 
          ref="quill"
          :is="editorComponent"
          v-model="value" 
          :editor-options="editorOptions"
          :editor-toolbar="editorToolbar"
          @selection-change="onQuillSelection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import irisField from '~/components/form-generator/irisField.js'
import VariableSelector from './VariableSelector.vue'
import { VueEditor } from 'vue2-editor'

/**
 * Component for editing que text templates for IRIS2. It can work both with char delimited vars and direct string vars (IRIS1).
 * The editor allows the user to both write text and add variables in a "find & add" way. The component is meant for work with
 * the FormGenerator component, defined and used as a schema.
 *
 * The IRIS1 model consist in inserting directly a variable key, without any patter identificable. For example: "Fitxa codi_fitxa",
 * will render to "Fitxa ABCD001".
 *
 * The delimited model is the canonical way of defining templates and the recommended for the future in IRIS2. For example: "Fitxa _codi_fitxa_,
 * or a template system like Django {{codi_fitxa}}". This component is ready to work with both models by adjusting its schema, by passing the
 * regexp and the delimiters associated to the desired pattern:
 *
 * - varRegexp: RegExp instance for finding vars in the text. For example: /^(_\w+_)$/ for _ delimited vars.
 * - openDelimiter: Preffix delimiter of the var, for example _.
 * - closeDelimiter: Suffix delimiter of the var, for example _.
 */
export default {
  name: 'TemplateTextEditor',
  components: {
    VariableSelector,
  },
  mixins: [irisField, abstractField],
  data() {
    return {
      quillSelection: null,
    }
  },
  computed: {
    varRegexp() {
      return this.schema.varRegexp
    },
    openDelimiter() {
      return this.schema.openDelimiter || ''
    },
    closeDelimiter() {
      return this.schema.closeDelimiter || ''
    },
    input() {
      return this.schema.type == 'textarea'
        ? this.$refs.text
        : this.$refs.quill.quill
    },
    required() {
      return this.schema.required
    },
    editorComponent() {
      return this.schema.type == 'textarea' ? 'textarea' : VueEditor
    },
    editorOptions() {
      return {
        placeholder: 'Escrigui aquí...',
        formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list'],
      }
    },
    editorToolbar() {
      return [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ]
    },
  },
  watch: {
    required() {
      this.validate()
    },
  },
  methods: {
    onTextAreaSelection() {
      this.selection({
        selectionStart: this.$refs.text.selectionStart,
        selectionEnd: this.$refs.text.selectionEnd,
      })
    },
    onQuillSelection(range) {
      if (range) {
        this.quillSelection = {
          selectionStart: range.index,
          selectionEnd: range.index + range.length,
        }
        this.selection(this.quillSelection)
      }
    },
    getSelection() {
      if (this.editorComponent == 'textarea') {
        return {
          selectionStart: this.$refs.text.selectionStart,
          selectionEnd: this.$refs.text.selectionEnd,
        }
      } else if (this.$refs.quill && this.quillSelection) {
        return this.quillSelection
      } else {
        return {
          selectionStart: this.value.length,
          selectionEnd: this.value.length,
        }
      }
    },
    setSelection(start, end) {
      if (this.$refs.quill) {
        const range = this.$refs.quill.quill.setSelection(start, start - end)
      } else {
        this.$refs.text.selectionStart = start
        this.$refs.text.selectionStart = end
      }
    },
    setContent(start, end, text) {
      if (this.$refs.quill) {
        const range = this.$refs.quill.quill.insertText(start, text)
      } else {
        this.value =
          this.value.slice(0, start) +
          text +
          this.value.slice(end, this.value.length)
      }
    },
    selection(range) {
      if (this.value == null) {
        return
      }
      // find left end of var
      let startVar = range.selectionStart
      while (startVar > 0 && this.value[startVar] != ' ') {
        startVar--
      }
      // find right end of var
      let endVar = range.selectionEnd
      while (endVar < this.value.length && this.value[endVar] != ' ') {
        endVar++
      }
      if (this.isVar(this.value.substring(startVar, endVar))) {
        this.setSelection(startVar, endVar)
      }
    },
    isVar(str) {
      if (!this.varRegexp) {
        return false
      }
      return this.varRegexp.test(str.trim())
    },
    addVar(varKey) {
      if (this.value == null) {
        this.value = ''
      }
      const selection = this.getSelection()
      let startPosition = selection.selectionStart
      let endPosition = selection.selectionEnd
      let templateKey = `${this.openDelimiter}${varKey}${this.closeDelimiter}`
      // Add space for separting words
      if (startPosition > 0 && this.value[startPosition - 1] != ' ') {
        templateKey = ' ' + templateKey
      }
      if (
        endPosition < this.value.length - 1 &&
        this.value[startPosition + 1] != ' '
      ) {
        templateKey = ' ' + templateKey
      }
      this.setContent(startPosition, endPosition, templateKey)
      this.$nextTick(() => {
        this.input.focus()
        this.setSelection(
          endPosition + templateKey.length,
          endPosition + templateKey.length
        )
      })
    },
  },
}
</script>

<style>
.template-text-editor textarea.form-control {
  width: 100%;
  height: 300px;
}
.template-text-editor .var-selector {
  min-height: 300px;
}
</style>
