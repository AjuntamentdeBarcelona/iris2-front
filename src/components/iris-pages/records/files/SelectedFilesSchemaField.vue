<template>
  <selected-files 
    :record="record"
    :name="schema.file_input_name"
    :files-origin="origin" 
    v-model="value"/>
</template>

<script>
import SelectedFiles from '~/components/iris-pages/records/files/SelectedFiles'
import { abstractField } from 'vue-form-generator'

export default {
  components: {
    SelectedFiles,
  },
  extends: abstractField,
  props: {
    model: {
      type: Object,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  computed: {
    record() {
      return this.model.record
    },
    origin() {
      return this.schema.origin
    },
  },
}
</script>
