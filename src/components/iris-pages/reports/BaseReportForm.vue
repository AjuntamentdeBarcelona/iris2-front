<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import { getContentDispositionFilename } from '~/assets/js/utils'
import { saveAs } from 'file-saver'

export default {
  name: 'BaseReportForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      required: true,
    },
    definition: {
      type: Function,
      required: true,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
    saveButtonText: {
      type: String,
      default: 'reports_generate_report',
    },
    saveButtonIcon: {
      type: String,
      default: 'file-download',
    },
    backButtonText: {
      type: String,
      default: 'go_back',
    },
    resetDefaultButton: {
      type: Boolean,
      default: true,
    },
    /**
     * New prop
     */
    enableVisualization: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      successMessage: this.$t('reports_successful_file_generation'),
    }
  },
  created() {
    if (this.isNewModel) {
      this.defaultModel()
    }

    if (this.enableVisualization) {
      this.addVisualizationButton()
    }
  },
  methods: {
    getExtraRequestConfig() {
      return {
        headers: {
          Accept: 'application/xlsx',
        },
        responseType: 'blob',
      }
    },
    /**
     * Overriden to save file on success
     */
    onSuccess(response, sentObj) {
      const filename = getContentDispositionFilename(
        response.headers['content-disposition']
      )

      saveAs(response.data, filename)

      if (this.successUrl) {
        this.$router.replace(this.getSuccessUrl(response.data))
      }
      this.$emit('form-saved', response, sentObj)
    },
    addVisualizationButton() {
      this.actionButtons.push({
        name: 'visualize_data',
        text: this.$t('reports_visualize_report'),
        click: this.visualizeData,
        icon: 'file-alt',
        classes: 'btn-primary',
      })
    },
    visualizeData() {
      if (this.isReadyForSend(this.model)) {
        if (this.beforeSubmit(this.model)) {
          this.$emit('visualize-data', {
            method: 'post',
            url: this.url,
            headers: {
              accept: 'application/json',
            },
            data: { ...this.constructSaveData(this.model) },
          })
        }
      }
    },
  },
}
</script>
