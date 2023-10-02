
<script>
import SelectedFiles from '~/components/iris-pages/records/files/SelectedFiles'
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

/**
 * Button for selecting files from a record card. It shows the current files selected.
 * Its meant for attaching files to the conversations.
 */
export default {
  name: 'SelectedAnswerFiles',
  extends: SelectedFiles,
  props: {
    record: {
      type: [Object, Number],
      required: true,
    },
    modalWidth: {
      type: [Number, String],
      default: '90%',
    },
    onlyPdf: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      recordForFiles: { files: [] },
      allowedExtensions: this.onlyPdf ? ['pdf'] : [],
    }
  },
  computed: {
    ...mapState('workflowFiles', ['mainRecord']),
    ...mapState('workflowFiles', {
      recordLoading: 'loading',
      recordError: 'error',
    }),
  },
  watch: {
    recordLoading() {
      this.loading = this.recordLoading
    },
    recordError() {
      this.error = this.recordError
    },
    mainRecord() {
      this.setMainRecord()
    },
  },
  mounted() {
    if (_.isObject(this.record)) {
      this.loading = false
      this.error = null
      this.recordForFiles = this.record
    } else if (this.mainRecord) {
      this.setMainRecord()
    }
  },
  methods: {
    ...mapActions('workflowFiles', ['retrieveMainRecord', 'newFiles']),
    setMainRecord() {
      this.recordForFiles = {
        ...this.mainRecord,
        files: [...this.mainRecord.files],
      }
    },
    onOpen() {
      if (!_.isObject(this.record) && !this.mainRecord) {
        this.retrieveMainRecord(this.record)
      }
    },
    onNewFiles(files) {
      if (this.mainRecord) {
        this.newFiles(files)
      }
    },
  },
}
</script>
