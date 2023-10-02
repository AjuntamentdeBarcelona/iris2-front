<template>
  <loader v-if="isLoading"/>
  <div v-else>
    <div 
      v-for="(group, index) in componentGroups"
      :key="index">
      <h3>{{ $t(group.title) }}</h3>

      <conversations-print 
        :index-conversation="index"
        :conversations="conversationsByType(index)"
        :record-card="recordCard" 
        @loadedComponent="loadComponent"
        @mustTobeLoaded="componentsToBeLoaded"/>
      <br>
    </div>
    
  </div>

</template>

<script>
import _ from 'lodash'
import Loader from '~/components/utils/Loader'
import { mapActions, mapGetters } from 'vuex'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import ConversationsPrint from '~/components/iris-pages/records/communications/print/ConversationsPrint'

/**
 * Loads conversations
 */
export default {
  name: 'Communications',
  components: {
    Loader,
    ConversationsPrint,
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
      comms: [],
      nextPageUrl: '',
      componentsLoaded: {},
    }
  },
  computed: {
    isLoading() {
      return this.loading || this.loadingTemplates
    },
    ...mapGetters('communication', { loadingTemplates: 'isLoading' }),
    responseChannel() {
      return _.get(this.recordCard, 'recordcardresponse.response_channel', null)
    },
    componentGroups() {
      return [
        {
          type: 'internal',
          title: 'comms_internal_comms',
        },
        {
          type: 'external',
          title: 'comms_external_comms',
        },
        ...(this.responseChannel == ResponseChannel.NONE
          ? []
          : [
              {
                type: 'applicant',
                title: 'comms_applicant_comms',
              },
            ]),
      ]
    },
  },
  created() {
    this.loadComms()
    this.$emit('mustTobeLoaded', 'communicationsPrint')
  },
  methods: {
    ...mapActions('communication', ['loadTemplates']),
    conversationsByType: function(index) {
      return this.comms.filter(c => c.type === index)
    },
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
        // recursive function till all conversations are loaded
        if (this.nextPageUrl != null) {
          this.loadComms(this.nextPageUrl)
        }
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
    loadComponent(e) {
      this.componentsLoaded[e] = true

      this.loadedAllComponents = true
      Object.entries(this.componentsLoaded).map(com => {
        if (com[1] == false) {
          this.loadedAllComponents = false
        }
      })

      if (this.loadedAllComponents) {
        this.$emit('loadedComponent', 'communicationsPrint')
      }
    },
    componentsToBeLoaded(e) {
      this.componentsLoaded[e] = false
    },
  },
}
</script>
