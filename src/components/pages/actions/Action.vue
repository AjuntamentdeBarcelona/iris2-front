<template>
  <post-button
    v-if="hadPermission"
    :url="postUrl"
    :confirm-title="$t(confirmTitleKey)"
    :confirm-text="confirmText"
    :text="$t(confirmTitleKey)"
    :disabled="!postUrl"
    :disabled-send="!ready"
    :variant="variant"
    :icon="icon"
    :extra-data="extraData"
    portal-modal
    @post-start="actionStart"
    @post-done="validateDone">

    <component
      v-if="extraComponent"
      slot="extraComponent"
      :is="extraComponent"
      :extra-component-data="extraComponentData"
      @component-event="onComponentEvent"
    />
  </post-button>
</template>

<script>
import PostButton from '~/components/forms/PostButton.vue'
import { mapGetters } from 'vuex'

/**
 * Component that implements the interface to make and action with confirmation
 *
 * This component uses sweet modal in order to ask for confirmation.
 * Also, uses the default notification library for showing the secondary
 * message toast. The button and the post is implemented by PostButton.
 */
export default {
  name: 'Action',
  components: {
    'post-button': PostButton,
  },
  props: {
    successMessageKey: {
      type: String,
      required: true,
    },
    confirmTitleKey: {
      type: String,
      required: true,
    },
    confirmTextKey: {
      type: String,
      required: true,
    },
    errorMessageKey: {
      type: String,
      required: true,
    },
    actions: {
      type: Object,
      required: true,
    },
    variant: {
      type: String,
      default: 'primary',
      required: false,
    },
    icon: {
      type: [String, Array],
      default() {
        return ['fas', 'check']
      },
    },
  },
  data() {
    return {
      ready: true,
      successMessageTitle: this.$t(this.successMessageKey),
      errorMessage: this.$t(this.errorMessageKey),
      extraComponent: null,
      extraComponentData: {},
      hadPermission: false,
    }
  },
  computed: {
    postUrl() {
      return this.actions.action_url
    },
    extraData() {
      return this.getData()
    },
    confirmText() {
      return this.$t(this.confirmTextKey)
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
  },
  mounted() {
    this.hadPermission = this.hasItemPermission()
  },
  methods: {
    hasItemPermission() {
      if (this.actions.permission) {
        return this.hasPermission(this.actions.permission)
      }
      return true
    },
    actionStart() {
      this.$nuxt.$loading.start()
    },
    validateDone(success, data) {
      this.$nuxt.$loading.finish()
      if (success) {
        this.$notify({
          group: 'iris',
          title: this.successMessageTitle,
          type: 'success',
          text: '',
        })
      } else {
        this.$notify({
          group: 'iris',
          title: this.errorMessage,
          type: 'error',
          text: '',
        })
      }
      this.$emit('action-done', success, data)
    },
    getData() {
      return {}
    },
    onComponentEvent() {},
  },
}
</script>
