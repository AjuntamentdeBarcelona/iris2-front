<template>
  <loader v-if="loading"/>
  <div
    v-else
    class="chatscreen"
  >
    <template v-if="markedConvo">

      <div
        ref="chatbox"
        class="chatscreen__box"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="chatClass(message.user_id)"
        >
          <b>{{ message.user_id }} <small class="text-dark font-weight-bolder">{{ message.group.description }}</small></b>
          <div v-html="message.text"/>
          <div class="text-right text-dark small">{{ normalizeDateTime(message.created_at) }}</div>
        </div>
        <div>
          <div
            v-if="nextPageUrl"
            class="chatscreen__message chatscreen__message--previous"
            @click="loadNext"
          >
            {{ $t('comms_previous_messages') }}
          </div>
        </div>
      </div>
      <div
        v-b-tooltip="sendDisabledMsg"
        v-if="!sendDisabledMsg"
        class="chatscreen__controls"
      >
        <vue-editor
          v-model="message"
          :editor-toolbar="editor.toolbar"
          :editor-options="editor.options"
          :disabled="!!sendDisabledMsg"
          :class="{'editor-template': allowTemplates}"
          class="editor"
        />
        <div
          v-if="allowNoAnswer"
          class="form-group field-checkbox require-answer">
          <label for="require_answer">
            <span>Sol·licitar resposta</span>
          </label>
          <div class="field-wrap">
            <input
              id="require_answer"
              v-model="requireAnswer"
              type="checkbox"
              extra-errors="">
          </div>
        </div>

        <div
          v-b-popover.hover="saveError"
          class="btn-wrapper">
          <selected-files
            v-if="allowFiles"
            v-model="selectedFiles"
            :record="recordCard"
            :name="filesName"
            :files-origin="filesOrigin" />
          <coms-master-template
            v-if="allowTemplates"
            :record-card="recordCard"
            @new-text="newTemplate"
          />
          <b-button
            :disabled="!!sendDisabledMsg || saveError"
            class="rounded-0 float-right"
            @click="sendMessage"
          >
            {{ $t('comms_send') }}
          </b-button>

        </div>
      </div>
    </template>
  </div>

</template>

<script>
import Loader from '~/components/utils/Loader'
import moment from 'moment'
import { VueEditor } from 'vue2-editor'
import SelectedFiles from '~/components/iris-pages/records/files/SelectedFiles'
import ComsMasterTemplate from '~/components/iris-pages/records/communications/ComsMasterTemplate'
import { trimHtmlText } from '~/assets/js/helpers'
import { mapState, mapGetters } from 'vuex'
import FilesType from '~/assets/js/iris2/model/FileTypes.js'

/**
 * Loads messages from a conversation
 */
export default {
  components: {
    Loader,
    VueEditor,
    SelectedFiles,
    ComsMasterTemplate,
  },
  props: {
    recordCard: {
      type: Object,
      required: true,
    },
    markedConvo: {
      type: Object,
      required: false,
      default: null,
    },
    convoType: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    currentCredentials: {
      type: Object,
      required: true,
    },
    allowNoAnswer: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowFiles: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowTemplates: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      message: '',
      loadingConvos: null,
      sendingMsg: null,
      requireAnswer: this.markedConvo
        ? this.markedConvo.convo.requireAnswer
        : true,
      messages: [],
      nextPageUrl: '',
      selectedFiles: [],
      editor: {
        options: {
          placeholder: this.$t('wysiwyg_placeholder'),
          formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list'],
        },
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
    }
  },
  computed: {
    ...mapState('communication', {
      templateHeader: 'header',
      answerTag: 'answerTag',
    }),
    ...mapGetters('communication', ['getRequireAnswer', 'getSimple']),
    loading() {
      return this.loadingConvos || this.sendingMsg
    },
    loadedConvo() {
      return !this.loading && this.markedConvo
    },
    canAddMessage() {
      return (
        this.recordCard.actions['add-message'] &&
        this.recordCard.actions['add-message'].can_perform
      )
    },
    sendDisabledMsg() {
      return (
        (this.canAddMessage ? '' : this.$t('comms_reason_no_action')) ||
        this.markedConvo.readOnly
      )
    },
    filesName() {
      return `${this.convoType}_chat_files`
    },
    payload() {
      return {
        conversation_id: this.markedConvo.convo.id,
        require_answer: this.requireAnswer,
        text: trimHtmlText(this.message),
      }
    },
    filesOrigin() {
      return FilesType.COMMS
    },
    saveError() {
      if (
        this.requireAnswer &&
        this.allowNoAnswer &&
        this.message &&
        this.message.indexOf(this.answerTag) < 0
      ) {
        return this.$t('comms_missing_answer_tag').replace(
          '{tag}',
          this.answerTag
        )
      }
      return undefined
    },
  },
  watch: {
    requireAnswer: {
      handler() {
        if (this.allowTemplates) {
          this.message = this.requireAnswer
            ? this.getRequireAnswer
            : this.getSimple
        }
      },
      immediate: true,
    },
    markedConvo() {
      if (this.markedConvo) {
        this.messages = []
        this.requireAnswer = this.markedConvo.convo.require_answer
        this.loadMessages()
      }
    },
    loadedConvo() {
      if (this.loadedConvo) {
        this.$nextTick(() => {
          const chatbox = this.$refs.chatbox
          chatbox.scrollTop = chatbox.scrollHeight
        })
      }
    },
  },
  methods: {
    async loadMessages(nextUrl) {
      this.loadingConvos = true
      let msgData = null
      try {
        msgData = await this.$axios
          .get(
            nextUrl ||
              `/api/communications/conversations/${
                this.markedConvo.convo.id
              }/messages/`
          )
          .then(resp => resp.data)
        this.messages = this.messages.concat(msgData.results)
        this.messages = this.messages.sort((firstEl, secondEl) => {
          if (firstEl.created_at < secondEl.created_at) return -1
          else if (firstEl.created_at === secondEl.created_at) return 0
          else return 1
        })
        this.nextPageUrl = msgData.next
        this.$emit('convo-read', this.markedConvo.convo.id)
      } catch (error) {
      } finally {
        this.loadingConvos = false
        return msgData
      }
    },
    loadNext() {
      this.loadMessages(this.nextPageUrl)
    },
    async sendMessage() {
      this.sendingMsg = true
      let msgData = null
      try {
        const data = {
          ...this.payload,
          record_file_ids: this.selectedFiles.map(rc => rc.id),
        }
        msgData = await this.$axios.post(this.url, data)
        this.messages = this.messages.concat(
          await this.loadMessages().then(data => data.results)
        )
        this.nextPageUrl = msgData.next
        this.message = ''
        this.messages = []
        this.loadMessages()
        this.resetSelectedFiles()
        this.emitMsgSent()
      } catch (error) {
      } finally {
        this.sendingMsg = false
        return msgData
      }
    },
    resetSelectedFiles() {
      this.selectedFiles = []
    },
    emitMsgSent() {
      this.$emit('message-sent')
    },
    isCurrentUser(user) {
      return user === this.currentCredentials.currentUser
    },
    chatClass(user) {
      return this.isCurrentUser(user)
        ? 'chatscreen__message chatscreen__message--user'
        : 'chatscreen__message'
    },
    normalizeDateTime(dateTime) {
      return moment(dateTime).format('DD/MM/YY HH:mm:ss')
    },
    newTemplate(text) {
      this.message = text
    },
  },
}
</script>

<style lang="scss" scoped>
$userColor: #ebf4fa;

.chatscreen {
  display: flex;
  flex-direction: column;
  background: $gray-400;
  width: 100%;
  &__box {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.25rem;
  }
  &__controls {
    margin-top: auto;
    background-color: $gray-100;
    padding: 0.5rem;
    .editor {
      &.editor-template {
        /deep/ .ql-editor {
          min-height: 150px;
          max-height: 250px;
        }
      }
      width: 100%;
      background-color: $white;
    }
    /deep/ .ql-container {
      height: unset;
      overflow-y: initial !important;
    }
    /deep/ .ql-snow .ql-toolbar button svg,
    /deep/ .quillWrapper .ql-snow.ql-toolbar button svg {
      width: 12px;
      height: 12px;
    }
    /deep/ .quillWrapper .ql-snow.ql-toolbar .ql-formats {
      margin-bottom: 4px;
    }
    /deep/ .ql-editor {
      min-height: 100px;
      max-height: 150px;
      font-size: 1rem;
    }
    .require-answer {
      padding: 3px;
    }
    .btn-wrapper {
      padding-top: 0.5rem;
    }
  }
  &__message {
    position: relative;
    background-color: $white;
    margin: 0.7rem 0.5rem;
    align-self: flex-start;
    min-width: 30%;
    max-width: 80%;
    width: fit-content;
    padding: 0.5rem 0.7rem;
    // :after is the chat triangle
    &:after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      width: 0;
      height: 0;
      border-right: 1rem solid transparent;
      border-top: 0.7rem solid $white;
    }

    &--user {
      background-color: $userColor;
      align-self: flex-end;
      margin-left: auto;
      display: flex;
      flex-direction: column;
      & > b {
        text-align: right;
      }
      &:after {
        left: initial;
        right: 0;
        border-right: none;
        border-color: $userColor;
        border-left: 1rem solid transparent;
      }

      /deep/ p {
        margin-bottom: 0;
      }
    }

    &--previous {
      margin: 0.5rem auto;
      opacity: 0.7;
      border-radius: 1rem;
      cursor: pointer;
      text-align: center;
      &:after {
        display: none;
      }
    }
  }
}
</style>
