<template>
  <div class="converPrint">
    <div 
      v-for="(con, index) in conversations" 
      :key="index">
      <label><b>{{ con.creation_group.description }}</b></label>

      <div class="converPrint__paragraph">
        <!-- If is internal -->
        <template v-if="con.type === 0">
          <div 
            v-for="(grup, index) in grupsConversation(con)" 
            :key="index">
            <label>{{ grup.description }}</label>
          </div>
        </template>
  
        <!-- If is external -->
        <template v-if="con.type === 1">
          <label>{{ con.external_email }}</label>
        </template>

      </div>

      <chat-messages-print 
        :id-conversation="con.id" 
        @loadedComponent="loadComponent"
        @mustTobeLoaded="componentsToBeLoaded" />
      <br>
    </div>
  </div>
</template>

<script>
import ChatMessagesPrint from './ChatMessagesPrint.vue'
import _ from 'lodash'

export default {
  name: 'ConversationsPrint',
  components: {
    ChatMessagesPrint,
  },
  props: {
    conversations: {
      type: Array,
      required: true,
    },
    indexConversation: {
      type: Number,
      required: true,
    },
    recordCard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      componentsLoaded: {},
    }
  },
  created() {
    this.$emit('mustTobeLoaded', `conversationsPrint-${this.indexConversation}`)
    if (!this.areThereConversations()) {
      this.$emit(
        'loadedComponent',
        `conversationsPrint-${this.indexConversation}`
      )
    }
    this.responsableEmail()
  },
  methods: {
    grupsConversation(conversation) {
      return conversation.groups_involved
    },
    responsableEmail() {
      return `${_.get(
        this,
        'recordCard.recordcardresponse.address_mobile_email'
      )}`
    },
    // set loadedAllComponents true or false if all components that have to load are loaded. if it's true the button 'imprimir' is enabled
    loadComponent(e) {
      this.componentsLoaded[e] = true

      this.loadedAllComponents = true
      Object.entries(this.componentsLoaded).map(com => {
        if (com[1] == false) {
          this.loadedAllComponents = false
        }
      })

      if (this.loadedAllComponents) {
        this.$emit(
          'loadedComponent',
          `conversationsPrint-${this.indexConversation}`
        )
      }
    },
    componentsToBeLoaded(e) {
      this.componentsLoaded[e] = false
    },
    areThereConversations() {
      return this.conversations.length > 0
    },
  },
}
</script>

<style>
.converPrint .converPrint__paragraph {
  border-bottom: solid 1px;
  width: 50%;
  margin: 0px;
}
</style>
