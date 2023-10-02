<template>
  <div class="answer-preview">
    <strong>{{ $t('answer_preview') }}</strong>
    <div 
      v-if="loading"
      class="alert alert-warning">
      {{ $t('answer_preview_loading') }}
    </div>
    <http-error :error="error" />
    <button 
      v-if="blobUrl"
      class="btn btn-primary"
      @click="print">
      <font-awesome-icon icon="print"/>
      {{ $t('print') }}
    </button>
    <iframe
      v-if="blobUrl" 
      :id="uid"
      :name="uid" 
      :src="blobUrl"
      class="preview-frame"/>
  </div>
</template>

<script>
import moment from 'moment'
import HttpError from '~/components/pages/HttpError.vue'
import uuidv4 from '~/assets/js/main.js'

export default {
  name: 'AnswerPreview',
  components: {
    HttpError,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
    recordId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      blob: null,
      uid: uuidv4(),
    }
  },
  computed: {
    requestUrl() {
      return `api/record_cards/record_cards/${this.recordId}/answer-preview/`
    },
    blobUrl() {
      return this.blob ? URL.createObjectURL(this.blob) : null
    },
  },
  async created() {
    this.loading = true
    this.error = null
    try {
      await this.loadPreview()
    } catch (e) {
      console.log(e)
      this.error = e
    }
    this.loading = false
  },
  methods: {
    async loadPreview() {
      const response = await this.$axios.post(
        this.requestUrl,
        {
          response: this.text,
          send_date: moment().format('YYYY-MM-DD'),
        },
        {
          responseType: 'arraybuffer',
        }
      )
      this.setBlob(response)
    },
    setBlob(response) {
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      })
      if (response.headers['content-type'] == 'application/pdf') {
        window.open(URL.createObjectURL(blob), '_blank')
        this.$emit('ready')
      } else {
        this.blob = blob
      }
    },
    print() {
      window.frames[this.uid].focus()
      window.frames[this.uid].print()
    },
  },
}
</script>

<style>
.answer-preview {
  width: 100%;
}

.preview-frame {
  width: 100%;
  min-height: 700px;
}
</style>
