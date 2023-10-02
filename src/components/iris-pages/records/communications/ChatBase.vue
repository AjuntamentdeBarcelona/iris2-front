<template>
  <loader v-if="loading"/>
  <div
    v-else
    class="chatBase"
  >
    <div
      :class="{ 'chatBase__sidebar--show': showMenu }"
      class="chatBase__sidebar"
      @click.self.stop="unSelectConvo"
    >
      <modal-form-button
        v-b-tooltip.right="createConvoDisabledMsg"
        v-if="canCreate"
        :record-card="recordCard"
        :form-component="formComponent"
        :form-component-data="formComponentData"
        :url="postConvoUrl"
        :disabled="createConvoDisabled"
        :show-scroll="true"
        width="70%"
        class="sidebar__convo-btn pt-2"
        open-button-text-key="comms_create_new_comm_btn"
        modal-content-text-key="comms_create_new_comm_modal"
        @action-done="$emit('reload-convos', $event)"
      />
      <ul
        ref="convosRoot"
        class="chatBase__list">
        <li
          v-for="markedConvo in markedConvos"
          :key="markedConvo.convo.id"
          :class="[
            'sidebar__convo',
            {'sidebar__convo--selected': isSelectedConvo(markedConvo.convo.id)},
            {'sidebar__convo--readonly': markedConvo.readOnly}
          ]"
          @click="selectConvo(markedConvo)"
        >
          <div class="sidebar__convo__messages">
            <div
              v-for="(recipient, index) in recipients(markedConvo.convo)"
              :key="index"
              :class="{'font-weight-bolder': recipient.isSelf}"
              @click="showMenu = false"
            >
              {{ recipient.recipient }}
            </div>
          </div>
          <unread-badge
            v-if="markedConvo.convo.unread_messages"
            :unread="markedConvo.convo.unread_messages"
          />
        </li>
      </ul>
      <div
        :class="{ 'chatBase__showlist--show': showMenu }"
        class="chatBase__showlist"
        @click="showMenu = !showMenu">
        <font-awesome-icon icon="angle-right"/>
      </div>
      <div v-if="loadMoreConvos">
        <b-button
          variant="outline-dark"
          class="rounded-0"
          @click="$emit('load-next')"
        >
          {{ $t('comms_load_more_convos') }}
        </b-button>
      </div>
    </div>
    <chat-screen
      :marked-convo="selectedConvo"
      :convo-type="convoType"
      :url="postConvoUrl"
      :record-card="recordCard"
      :current-credentials="currentCredentials"
      :allow-no-answer="allowNoAnswer"
      :allow-templates="allowTemplates"
      :allow-files="allowFiles"
      class="chatBase__convo"
      @convo-read="$emit('convo-read', $event)"
      @message-sent="onMessageSent"
    />
  </div>
</template>

<script>
import Loader from '~/components/utils/Loader'
import UnreadBadge from '~/components/iris-pages/records/communications/UnreadBadge'
import ChatScreen from '~/components/iris-pages/records/communications/ChatScreen'
import ModalFormButton from '~/components/forms/buttons/ModalFormButton'
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { emailResponseChannel } from '~/assets/js/iris2/constants'
import { isEmail } from '~/assets/js/utils'

/**
 * Requests the load of next conversations
 */
export default {
  components: {
    UnreadBadge,
    ChatScreen,
    ModalFormButton,
    Loader,
  },
  props: {
    recordCard: {
      type: Object,
      required: true,
    },
    formComponent: {
      type: Object,
      required: true,
    },
    convos: {
      type: Array,
      required: true,
    },
    convoType: {
      type: Number,
      required: true,
    },
    loadMoreConvos: {
      type: Boolean,
      required: true,
    },
    allowNoAnswer: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowTemplates: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowFiles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loadingGroups: null,
      selectedConvo: null,
      postConvoUrl: '/api/communications/conversations/messages/add/',
      showMenu: true,
    }
  },
  computed: {
    canCreate() {
      return (
        this.recordCard.actions['add-conversation'] &&
        this.recordCard.actions['add-conversation'].can_perform
      )
    },
    responseChannelIsEmail() {
      return (
        _.get(this, 'recordCard.recordcardresponse.response_channel') ===
        emailResponseChannel
      )
    },
    responseHasEmail() {
      return isEmail(
        _.get(this, 'recordCard.recordcardresponse.address_mobile_email')
      )
    },
    createConvoDisabled() {
      if (this.convoType === 2) {
        return !(
          this.canCreate &&
          this.responseChannelIsEmail &&
          this.responseHasEmail
        )
      } else {
        return !this.canCreate
      }
    },
    createConvoDisabledMsg() {
      if (this.createConvoDisabled) {
        return this.$t('comms_reason_not_email_response_channel')
      }

      return ''
    },
    loading() {
      return this.loadingGroups
    },
    markedConvos() {
      return this.convos
        ? this.convos.map(convo => ({
            convo: convo,
            readOnly: this.convoIsReadOnly(convo),
          }))
        : []
    },
    currentCredentials() {
      return {
        currentUser: this.currentUser,
        currentGroup: this.currentGroup,
      }
    },
    previouslyUsedExternalEmails() {
      return this.convos
        ? [...new Set(this.convos.map(convo => convo.external_email))]
        : []
    },
    formComponentData() {
      return {
        type: this.convoType,
        currentCredentials: this.currentCredentials,
        previouslyUsedExternalEmails: this.previouslyUsedExternalEmails,
      }
    },
    ...mapState('groups', {
      currentUser: 'username',
      currentGroup: 'selectedGroup',
    }),
  },
  async created() {
    this.loadingGroups = true
    let groups = null
    try {
      groups = await this.loadGroups()
    } catch (error) {
    } finally {
      this.loadingGroups = false
      return true
    }
  },
  methods: {
    recipients(convo) {
      let recipients = []
      const creationGroup = {
        recipient: convo.creation_group.description,
        isSelf: this.groupIsSelfGroup(convo.creation_group),
      }

      switch (this.convoType) {
        case 0:
          recipients = [creationGroup].concat(
            ...convo.groups_involved.map(group => ({
              recipient: group.description,
              isSelf: this.groupIsSelfGroup(group),
            }))
          )
          break
        case 1:
          recipients = [creationGroup].concat({
            recipient: convo.external_email,
            isSelf: false,
          })
          break
        case 2:
          recipients = [creationGroup].concat({
            recipient: _.get(
              this,
              'recordCard.recordcardresponse.address_mobile_email'
            ),
            isSelf: false,
          })
          break
      }

      return recipients
    },
    selectConvo(markedConvo) {
      this.selectedConvo = markedConvo
    },
    unSelectConvo() {
      this.selectedConvo = null
    },
    isSelectedConvo(id) {
      return _.get(this.selectedConvo, 'id') === id
    },
    groupIsSelfGroup(group) {
      const packagedGroup = { creation_group: group, groups_involved: [group] }
      return (
        this.groupIsConvoStarter(packagedGroup) ||
        this.groupIsInRecipientGroups(packagedGroup)
      )
    },
    groupIsConvoStarter(convo) {
      return (
        this.currentCredentials.currentGroup.id === convo.creation_group.id ||
        (this.recordCard.actions['add-message'] &&
          this.recordCard.actions['add-message'].can_perform == true)
      )
    },
    groupIsInRecipientGroups(convo) {
      return convo.groups_involved.some(
        group =>
          this.currentCredentials.currentGroup.id === group.group ? true : false
      )
    },
    convoIsReadOnly(convo) {
      if (!convo.is_opened) {
        return this.$t('comms_reason_closed_convo')
      }

      const groupIsConvoStarter = this.groupIsConvoStarter(convo)
      let groupIsInRecipientGroups = true
      if (this.convoType === 0) {
        groupIsInRecipientGroups = this.groupIsInRecipientGroups(convo)
      }
      if (!(groupIsConvoStarter || groupIsInRecipientGroups)) {
        return this.$t('comms_reason_not_participant')
      }

      return ''
    },
    onMessageSent() {
      this.$emit('message-sent')
    },
    ...mapActions('groups', ['loadGroups']),
  },
}
</script>

<style lang="scss" scoped>
.chatBase {
  display: flex;
  width: calc(100% + 1rem);
  margin: -0.5rem;
  margin-top: -1.5rem;
  max-height: 700px;
  min-height: 350px;
  overflow: hidden;

  &__list {
    padding: 0;
    margin: 0;
    padding-top: 1rem;
    height: 100%;
    overflow: auto;
    li {
      display: flex;
    }
  }
  &__sidebar {
    display: flex;
    flex-direction: column;
    width: calc(200px + 2rem);
    transition: transform 0.3s ease-out;
    margin-left: -190px;
    z-index: 2;
    transform: translateX(0);
    background-color: $gray-100;
    border-right: 1px solid $gray-400;
    .sidebar__convo {
      position: relative;
      border-bottom: 1px solid $gray-400;
      padding: 0.5rem 0.3rem;
      font-size: 0.85em;
      cursor: pointer;
      color: $gray-800;
      &--selected {
        color: $black;
        background-color: $gray-300;
      }
      &--readonly {
        color: $gray-600;
      }
      &__messages {
        width: 100%;
        span:not(:last-child) {
          margin-right: 0.5rem;
        }
      }
    }
    .unread-badge {
      transform: scale(0.8);
    }
    /* Adjustment inner btn */
    .sidebar__convo-btn /deep/.btn {
      width: 100%;
      border-radius: 0;
      white-space: nowrap;
    }
    &--show {
      transform: translateX(190px);
    }
  }
  &__showlist {
    text-align: right;
    padding: 0.25rem 0.8rem;
    transition: transform 0.3s ease-out;
    cursor: pointer;
    &--show {
      /deep/ svg {
        transform: rotate(180deg);
      }
    }
  }
  &__convo {
    width: calc(100% - 4px);
  }
}

@include media-breakpoint-up(lg) {
  .chatBase {
    &__showlist {
      display: none;
    }
    &__sidebar {
      margin-left: 0;
      transform: translateX(0);
      transition: transform 0s;
    }
    &__convo {
      width: calc(100% - 204px);
    }
  }
}
</style>
