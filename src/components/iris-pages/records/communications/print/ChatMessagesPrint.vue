<template>
  <loader v-if="loading"/>
  <div 
    v-else 
    class="chatMessages">
    <div 
      v-for="(message, index) in messages" 
      :key="index">
      <div class="chatMessages__box">
        <!--Si no es un chat mio se pasa a la izquierda-->
        <b class="chatMessages__box__title">{{ message.user_id }} <small>{{ message.group.description }}</small></b>
        <div v-html="message.text"/>
        <div class="chatMessages__box__data">{{ normalizeDateTime(message.created_at) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Loader from '~/components/utils/Loader'

export default {
  name: 'ConversationsPrint',
  components: {
    Loader,
  },
  props: {
    idConversation: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sendingMsg: null,
      messages: [],
      nextPageUrl: '',
      loadingChat: null,
    }
  },
  computed: {
    loading() {
      return this.loadingChat
    },
  },
  created() {
    this.loadMessages()
    this.$emit('mustTobeLoaded', `chatMessagesPrint-${this.idConversation}`)
  },
  methods: {
    async loadMessages(nextUrl) {
      this.loadingChat = true
      let msgData = null
      try {
        msgData = await this.$axios
          .get(
            nextUrl ||
              `/api/communications/conversations/${
                this.idConversation
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
        // recursive function until all pages are loaded
        if (this.nextPageUrl != null) {
          this.loadMessages(this.nextPageUrl)
        }
      } catch (error) {
      } finally {
        this.loadingChat = false
        this.$emit(
          'loadedComponent',
          `chatMessagesPrint-${this.idConversation}`
        )
        return msgData
      }
    },
    normalizeDateTime(dateTime) {
      return moment(dateTime).format('DD/MM/YY HH:mm:ss')
    },
  },
}
</script>

<style>
.chatMessages .chatMessages__box {
  border: solid 1px;
  margin: 5px;
  width: 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.chatMessages .chatMessages__box p {
  padding: 0;
  margin: 0;
}

.chatMessages .chatMessages__box .chatMessages__box__title,
.chatMessages .chatMessages__box .chatMessages__box__data {
  align-self: flex-end;
}
</style>
