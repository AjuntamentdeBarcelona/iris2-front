<template>
  <div v-if="getInitial.response" >
    <div class="printrecord__card">
      <div 
        id="descriptionResponse" 
        class="printrecord__description">
        <span 
          v-html="getInitial.response"/>
      </div>
    </div>
  </div>
</template>

<script>
import ProcessStepMixin from './ProcessStepMixin.js'
import _ from 'lodash'
import plainFromHtml from '~/assets/js/utils/string/plainFromHtml.js'

export default {
  name: 'AnswerForm',
  mixins: [ProcessStepMixin],
  props: {
    current: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      default: '',
      required: false,
    },
    answerData: {
      type: Object,
      default: () => {
        return {}
      },
      required: false,
    },
    manyMode: {
      type: Boolean,
      default: false,
      required: false,
    },
    commentTask: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      confirmedTemplate: false,
    }
  },
  computed: {
    getInitial() {
      return {
        response: this.answerData.response,
        worked: this.answerData.worked,
        notify_quality: this.answerData.notify_quality,
        record_files: this.answerData.record_files.map(item => ({
          ...item,
          id: item.record_file,
        })),
        record: this.process,
        current: this.current,
        key: this.answerData.key,
      }
    },
  },
  watch: {
    adaptSchema(schemaDef) {
      schemaDef.response.manyMode = this.manyMode
    },
    answerData() {
      this.model.response = this.answerData.response
      this.model.worked = this.answerData.worked
    },
  },
  methods: {
    afterUpdate() {
      this.confirmedTemplate =
        plainFromHtml(this.model.response) !=
        plainFromHtml(this.model.templated || '')
    },
    afterServerError() {
      this.confirmed = false
    },
    getDefaultButtons() {
      if (this.readOnly) {
        return []
      }

      let buttons = []

      buttons.push({
        name: 'save-draft',
        text: this.$t('record_card_save_draft'),
        click: this.saveDraft,
        icon: 'save',
        classes: 'btn-outline-primary ml-auto',
      })

      return buttons
    },
  },
}
</script>
