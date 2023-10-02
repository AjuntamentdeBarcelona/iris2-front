<template>
  <div>
    <!-- Open button -->
    <b-button
      v-if="canTakeAction"
      :variant="openButtonVariant"
      @click="openModal"
    >
      <font-awesome-icon
        v-if="iconProp"
        :icon="['fas', iconProp]"/>
      {{ $t(openButtonTextKey) }}
    </b-button>
    <!-- Modal -->
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        v-if="canTakeAction && modalOpened"
        ref="modal"
        :id="`modal-${actionName}`"
        blocking
        enable-mobile-fullscreen
        @close="onModalClosed"
      >
        <p v-text="$t(modalContentTextKey)"/>

        <loader v-if="!loaded"/>

        <template v-else-if="state.checkError">
          <div class="alert alert-danger w-100">
            {{ $t('checks_check_failure') }}

            <ul class="list-group">
              <li
                v-for="(error, key) in state.checkErrors"
                :key="uniqueId(key)"
                class="list-group-item"
                v-text="error"
              />
            </ul>
          </div>
        </template>

        <div
          v-else
          :key="renderKey"
        >
          <!-- Check components -->
          <component
            v-for="checkComponent in checkComponents"
            :key="checkComponent.name"
            :is="checkComponent"
            :model="model"
            :check-response="state.checkResponse"
            :action-url="action.action_url"
            @check-action="onCheckAction"
            @done="onDone"
          />

          <!-- Form -->
          <component
            :is="formComponent"
            v-bind="computedFormProps"
            v-on="formEventHandlers"
          />
        </div>

      </sweet-modal>
    </MountingPortal>
  </div>
</template>

<script>
import formMixin from '~/components/forms/formMixin'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin'
import Loader from '~/components/utils/Loader'
import { get, uniqueId } from 'lodash'

/**
 * Universal component for the pattern button -> modal -> form that automatically handles actions, checks & permissions.
 * Comes with a plugin system to customize the checking actions.
 *
 * This component executes preemptively a check action when it's available.
 * The button is enabled if there's an action_url and the user has the required permission.
 * The form is enabled after a successful check response.
 *
 * Accepts an array of checkComponents which receive the model and check's response and may
 * add additional data to the formComponent.
 */
export default {
  name: 'CheckModalFormButton',
  components: {
    Loader,
  },
  mixins: [formMixin, AuthorizationMixin],
  props: {
    // Mandatory
    model: {
      type: Object,
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
    formComponent: {
      type: Object,
      required: true,
    },
    openButtonTextKey: {
      type: String,
      required: true,
    },
    modalContentTextKey: {
      type: String,
      required: true,
    },
    // Optional
    formProps: {
      type: Object,
      default: () => ({}),
    },
    checkComponents: {
      type: Array,
      default: () => [],
    },
    openButtonVariant: {
      type: String,
      default: '',
    },
    iconProp: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      renderKey: 0,
      modalOpened: false,
      loading: {
        checkResponse: false,
      },
      state: {
        extraData: {},
        checkResponse: {},
        checkError: false,
        checkErrors: {},
      },
      formEventHandlers: {
        'form-saved': this.onFormSaved,
      },
    }
  },
  computed: {
    action() {
      return this.model.actions[this.actionName]
    },
    actionUrl() {
      return get(this, 'action.action_url')
    },
    checkUrl() {
      return get(this, 'action.check_url')
    },
    computedPermission() {
      return get(this, 'action.permission', null)
    },
    /**
     * There're two dimensions being analyzed here:
     * - The presence of an action_url dictates whether the action is possible on the current state of the model.
     * Usually RecordCard's record_state (not RecordCard's workflow's state)
     * - The presence of a permission dictates if it's possible for the user's group's profile to carry this
     * kind of operation. It's abscence means there's not such restriction.
     */
    canTakeAction() {
      return Boolean(this.actionUrl) && this.isAuthorized
    },
    loaded() {
      return Object.values(this.loading).every(v => !v)
    },
    computedFormProps() {
      const defaultProps = {
        url: this.actionUrl,
        saveButtonText: this.openButtonTextKey,
        'extra-data': this.state.extraData,
        'extra-info': { model: this.model, action: this.action },
        'show-loading': !this.loaded,
      }

      return Object.keys(this.formProps).length ? this.formProps : defaultProps
    },
  },
  created() {
    this.uniqueId = uniqueId
  },
  methods: {
    async loadCheckResponse() {
      if (this.checkUrl && !this.loading.checkResponse) {
        this.loading.checkResponse = true
        this.state.checkError = false
        this.state.checkErrors = {}

        try {
          const response = await this.$axios.post(this.checkUrl)
          this.state.checkResponse = response.data.__action__
        } catch (error) {
          this.state.checkError = true
          this.state.checkErrors = this.normalizeErrorResponseData(
            error.response
          )
        } finally {
          this.loading.checkResponse = false
        }
      }
    },
    async openModal() {
      this.loadCheckResponse()
      this.modalOpened = true
      await this.$nextTick()
      this.$refs.modal.open()
    },
    closeModal() {
      this.$refs.modal.close()
    },
    /**
     * Resets the state obtained through checkComponents and forces a re-render of the forms
     */
    resetState() {
      this.state = { ...this.$options.data().state }
      this.renderKey += 1
    },
    onCheckAction(extraData) {
      this.state.extraData = { ...this.state.extraData, ...extraData }
    },
    onFormSaved(response, sentObj) {
      const success = true
      this.$emit('action-done', success, response, sentObj)
    },
    onModalClosed() {
      this.resetState()
    },
    onDone() {
      this.$emit('action-done', true)
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .sweet-modal {
  .sweet-content-content {
    text-align: left;
  }
}
</style>
