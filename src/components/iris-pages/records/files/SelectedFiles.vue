<template>
  <dynamic-tag-modal
    ref="dtm"
    :component-props="{variant:'outline-secondary'}"
    :width="modalWidth"
    show-scroll
    @opened="onOpen">
    <font-awesome-icon icon="paperclip"/>
    {{ $t('record_card_attach_files') }}
    <span class="badge badge-dark">{{ selected.length }}</span>
    <template slot="modal">
      <div v-if="loading">
        <loader/>
      </div>
      <div v-if="!loading && !error">
        <select-or-upload
          v-if="!loading && !error && recordForFiles"
          v-model="selected"
          :record="recordForFiles"
          :name="name"
          :allowed-extensions="allowedExtensions"
          :files-origin="filesOrigin"
          class="row"
          @new-files="onNewFiles"
        />
        <div class="sweet-buttons px-0">
          <button
            class="btn btn-primary mr-auto ml-0 mt-2"
            @click="closeSelector()">
            {{ $t('record_card_include_files') }}
          </button>
        </div>
      </div>
      <http-error :error="error"/>
    </template>
  </dynamic-tag-modal>
</template>

<script>
import Loader from '~/components/utils/Loader'
import HttpError from '~/components/pages/HttpError.vue'
import SelectOrUpload from './SelectOrUpload'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'

/**
 * Button for selecting files from a record card. It shows the current files selected.
 * Its meant for attaching files to the conversations.
 */
export default {
  name: 'SelectedFiles',
  components: {
    SelectOrUpload,
    Loader,
    HttpError,
    DynamicTagModal,
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: 'file',
    },
    value: {
      type: Array,
      required: false,
      default: () => [],
    },
    filesOrigin: {
      type: Number,
      required: true,
    },
    modalWidth: {
      type: [Number, String],
      default: '60%',
    },
  },
  data() {
    return {
      selected: this.value,
      error: null,
      loading: false,
      recordForFiles: this.record,
      allowedExtensions: undefined,
    }
  },
  watch: {
    selected() {
      this.$emit('input', this.selected)
    },
  },
  methods: {
    closeSelector() {
      this.$refs.dtm.close()
    },
    onOpen() {},
    onNewFiles() {},
  },
}
</script>
