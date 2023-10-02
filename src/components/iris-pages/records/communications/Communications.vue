<template>
  <loader v-if="isLoading"/>
  <b-tabs
    v-else
    v-model="selected">
    <b-tab
      v-for="(group, key, index) in componentGroups"
      :key="index"
    >

      <template
        slot="title"
      >
        <font-awesome-icon
          :icon="commsTypesMap[group.type].icon"/>
        {{ $t(group.title) }}
        <unread-badge
          v-if="group.unreadCount"
          :unread="group.unreadCount"
        />
      </template>
      <keep-alive>
        <chat-base
          :record-card="recordCard"
          :form-component="commsTypesMap[group.type].formComponent"
          :convo-type="commsTypesMap[group.type].id"
          :convos="returnConvo(group.type)"
          :load-more-convos="Boolean(nextPageUrl)"
          :allow-no-answer="group.allowNoAnswer"
          :allow-files="group.allowFiles"
          :allow-templates="group.allowTemplates"
          @convo-read="convoRead"
          @load-next="loadNextPage"
          @reload-convos="reloadConvos"
          @message-sent="onMessageSent"
        />
      </keep-alive>
    </b-tab>
  </b-tabs>
</template>

<script>
import Loader from '~/components/utils/Loader'
import UnreadBadge from '~/components/iris-pages/records/communications/UnreadBadge'
import ChatBase from '~/components/iris-pages/records/communications/ChatBase'
import _ from 'lodash'
import InternalCommsForm from '~/components/iris-pages/records/communications/InternalCommsForm'
import ExternalCommsForm from '~/components/iris-pages/records/communications/ExternalCommsForm'
import ApplicantCommsForm from '~/components/iris-pages/records/communications/ApplicantCommsForm'
import { mapActions, mapGetters } from 'vuex'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'

/**
 * Loads conversations
 */
export default {
  name: 'Communications',
  components: {
    Loader,
    UnreadBadge,
    ChatBase,
  },
  props: {
    recordCard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      selected: 0,
      commsTypesMap: {
        internal: {
          id: 0,
          formComponent: InternalCommsForm,
          icon: ['fas', 'pen-square'],
        },
        external: {
          id: 1,
          formComponent: ExternalCommsForm,
          icon: ['fas', 'external-link-square-alt'],
        },
        applicant: {
          id: 2,
          formComponent: ApplicantCommsForm,
          icon: ['fas', 'user-tie'],
        },
      },
      comms: [],
      nextPageUrl: '',
    }
  },
  computed: {
    isLoading() {
      return this.loading || this.loadingTemplates
    },
    ...mapGetters('communication', { loadingTemplates: 'isLoading' }),
    categorizedOrderedComms() {
      return _.groupBy(this.comms, 'type')
    },
    internalComms() {
      return this.categorizedOrderedComms[this.commsTypesMap.internal.id]
    },
    externalComms() {
      return this.categorizedOrderedComms[this.commsTypesMap.external.id]
    },
    applicantComms() {
      return this.categorizedOrderedComms[this.commsTypesMap.applicant.id]
    },
    internalCommsUnreadMessages() {
      return this.internalComms ? this.internalComms.reduce(this.reducer, 0) : 0
    },
    externalCommsUnreadMessages() {
      return this.externalComms ? this.externalComms.reduce(this.reducer, 0) : 0
    },
    applicantCommsUnreadMessages() {
      return this.applicantComms
        ? this.applicantComms.reduce(this.reducer, 0)
        : 0
    },
    responseChannel() {
      return _.get(this.recordCard, 'recordcardresponse.response_channel', null)
    },
    componentGroups() {
      return [
        {
          type: 'internal',
          title: 'comms_internal_comms',
          unreadCount: this.internalCommsUnreadMessages,
          allowNoAnswer: false,
          allowFiles: false,
          allowTemplates: false,
        },
        {
          type: 'external',
          title: 'comms_external_comms',
          unreadCount: this.externalCommsUnreadMessages,
          allowNoAnswer: true,
          allowFiles: true,
          allowTemplates: false,
          requiresTemplatesVars: false,
        },
        ...(this.responseChannel == ResponseChannel.NONE
          ? []
          : [
              {
                type: 'applicant',
                title: 'comms_applicant_comms',
                unreadCount: this.applicantCommsUnreadMessages,
                allowNoAnswer: true,
                allowFiles: true,
                allowTemplates: true,
                requiresTemplatesVars: true,
              },
            ]),
      ]
    },
  },
  watch: {
    selected: {
      handler() {
        if (
          this.componentGroups[this.selected] &&
          (this.componentGroups[this.selected].allowTemplates ||
            this.componentGroups[this.selected].requiresTemplatesVars)
        ) {
          this.loadTemplates(this.recordCard.id)
        }
      },
      immediate: true,
    },
  },
  created() {
    this.loadComms()
  },
  methods: {
    ...mapActions('communication', ['loadTemplates']),
    async loadComms(nextUrl) {
      this.loading = true
      let commData = null

      try {
        commData = await this.$axios
          .get(
            nextUrl ||
              `/api/communications/conversations/${this.recordCard.id}/`
          )
          .then(resp => {
            return resp.data
          })

        this.nextPageUrl = commData.next
        this.comms = this.comms.concat(commData.results)
        this.comms = this.comms.sort((firstEl, secondEl) => {
          if (firstEl.created_at < secondEl.created_at) return 1
          else if (firstEl.created_at === secondEl.created_at) return 0
          else return -1
        })
      } catch (error) {
      } finally {
        this.loading = false
        return commData
      }
    },
    reloadConvos() {
      this.comms = []
      this.loadComms()
      this.emitMessageSent()
    },
    loadNextPage() {
      this.loadComms(this.nextPageUrl)
    },
    convoRead(convoId) {
      this.comms.some(convo => {
        if (convo.id === convoId) {
          convo.unread_messages = 0
          return true
        }
      })
    },
    reducer(accumulator, currentValue) {
      return accumulator + currentValue.unread_messages
    },
    returnConvo(type) {
      return this[`${type}Comms`] || []
    },
    onMessageSent() {
      this.emitMessageSent()
    },
    emitMessageSent() {
      this.$emit('message-sent')
    },
  },
}
</script>

<style lang="scss" scoped>
.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
