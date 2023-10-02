<template>
  <div>
    <!-- Button -->
    <b-button
      v-if="isAuthorized"
      :variant="variant"
      :disabled="disabled"
      class="ml-auto"
      @click="openModal"
    >
      <slot>
        <font-awesome-icon
          :icon="icon"
          class="mr-1" />
        {{ text }}
      </slot>
    </b-button>

    <!-- Modal -->
    <portal-modal
      ref="confirm"
      :alt="confirmTitle"
      :portal="portalModal"
      icon="warning"
      aria-describedby="modalDescription"
      role="alertdialog"
      @close="onModalClose"
    >
      <!-- Title -->
      <template>
        <p id="modalDescription">{{ confirmText }}</p>
        <slot name="extraComponent"/>
      </template>

      <!-- Errors -->
      <div v-if="hasGlobalErrors && displayGlobalErrors">
        <p>{{ $t(errorTitle) }}:</p>
        <div
          class="alert alert-danger"
        >
          <ul>
            <template
              v-for="(value, name, index) in globalErrors"
            >
              <li :key="index">
                {{ name !== ALL_ERROR ? `${name}: ` : '' }} {{ value }}
              </li>
            </template>

          </ul>
        </div>
      </div>
      <div v-if="authorizationError">
        <h2 class="text-danger">{{ $t('authorization_error') }}</h2>
        <p>{{ $t('authorization_error_description') }}</p>
      </div>

      <!-- Form / Buttons -->
      <component
        v-if="renderForm"
        :is="formComponent"
        v-bind="formComponentProps"
        @submit="onFormSubmit"
      />
      <template v-else>
        <button
          slot="button"
          class="btn btn-light"
          autofocus
          @click="close"
        >
          <font-awesome-icon icon="sign-out-alt" />
          {{ $t('delete_confirm_cancel') }}
        </button>
        <button
          slot="button"
          :disabled="disabledSend"
          class="btn btn-primary"
          @click="send"
        >
          {{ text }}
        </button>
      </template>
    </portal-modal>
  </div>
</template>

<script>
/* Events

+ post-done: Returns true if the post returns correctly or false id returns error
*/

import queue from '~/assets/js/utils/promises/queue.js'
import { isResponseClass, isPlainObject } from '~/assets/js/helpers'
import { ALL_ERROR } from '~/assets/js/iris2/constants'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'
import PortalModal from '~/components/forms/modals/PortalModal'

export default {
  name: 'PostButton',
  components: { PortalModal },
  mixins: [AuthorizationMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledSend: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
    variant: {
      type: String,
      required: false,
      default: '',
    },
    url: {
      type: [Array, String],
      required: true,
      default: '',
    },
    method: {
      type: String,
      default: 'post',
    },
    icon: {
      type: [String, Array],
      default() {
        return ['fas', 'check']
      },
    },
    confirmText: {
      type: String,
      required: true,
      default: '',
    },
    confirmTitle: {
      type: String,
      required: true,
      default: '',
    },
    errorTitle: {
      type: String,
      default: 'record_card_validate_error',
    },
    extraData: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    displayGlobalErrors: {
      type: Boolean,
      default: true,
    },
    /**
     * Reset errors on close.
     */
    resetErrors: {
      type: Boolean,
      required: false,
      default: false,
    },
    resetFormOnClose: {
      type: Boolean,
      default: true,
    },
    formComponent: {
      type: Object,
      default: undefined,
    },
    portalModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      urls: Array.isArray(this.url) ? this.url : [this.url],
      multiple: Array.isArray(this.url),
      errors: [],
      globalErrors: [],
      ALL_ERROR: ALL_ERROR,
      extraFormData: {},
      modalOpened: false,
    }
  },
  computed: {
    hasGlobalErrors() {
      return Object.keys(this.globalErrors).length > 0
    },
    renderForm() {
      const theresForm = Boolean(this.formComponent)
      return this.resetFormOnClose ? theresForm && this.modalOpened : theresForm
    },
    /**
     * The first id is fed if we're dealing with reassignments
     */
    formComponentProps() {
      return this.urls.length && isPlainObject(this.urls[0])
        ? { propModel: { id: this.getIdFromUrlObj(this.urls[0]) } }
        : {}
    },
  },
  watch: {
    url() {
      this.urls = Array.isArray(this.url) ? this.url : this.urls
    },
  },
  methods: {
    openModal() {
      if (!this.$refs.confirm) {
        return
      }
      this.$refs.confirm.open()
      this.modalOpened = true
    },
    close() {
      if (!this.$refs.confirm) {
        return
      }
      this.$refs.confirm.close()
      if (this.resetErrors) {
        this.errors = []
        this.globalErrors = []
      }
    },
    onModalClose() {
      this.modalOpened = false
    },
    onFormSubmit(model) {
      this.extraFormData = model
      this.send()
    },
    buildUrlWithIdentifier(obj) {
      return `${obj.url}${this.getIdFromUrlObj(obj)}/`
    },
    getIdFromUrlObj(obj) {
      return Object.values(obj.data)[0]
    },
    send() {
      this.errors = []
      this.$emit('post-start', true)
      let promise = null
      if (this.multiple) {
        promise = queue.promises(this.urls, 3, url => {
          return this.post(url)
        })
      } else {
        promise = this.post(this.url)
      }

      promise
        .then(resp => {
          this.$emit('action-success', resp.data)
        })
        .catch(e => {
          if (e.response.status == 403) {
            this.onUnauthorized()
          } else {
            if (this.errors.length > 0) {
              this.$emit('post-error', this.errors)
            }
          }
        })
        .then(() => {
          if (this.errors.length === 0 && !this.authorizationError) {
            this.close()
          }
        })

      return promise
    },
    post(url) {
      let rq = {}

      if (isPlainObject(url)) {
        rq = {
          url: url.url,
          method: this.method,
          data: { ...this.getData(), ...url.data },
        }
      } else {
        rq = {
          url: url,
          method: this.method,
          data: this.getData(),
        }
      }

      const promise = this.$axios.request(rq)
      promise
        .then(resp => {
          this.$emit('post-done', true, resp.data)
        })
        .catch(resp => {
          this.$emit('post-done', false, resp)
          if (resp.response.status == 403) {
            this.onUnauthorized()
          } else {
            if (isPlainObject(url)) {
              this.errors.push(this.buildUrlWithIdentifier(url))
            } else {
              this.errors.push(url)
            }

            if (isResponseClass(resp.response.status, 400)) {
              this.globalErrors = isPlainObject(resp.response.data)
                ? resp.response.data
                : { [ALL_ERROR]: resp.response.data }
            } else {
              this.globalErrors = {
                [ALL_ERROR]: this.$t('delete_error_generic'),
              }
            }
          }
        })
      return promise
    },
    getData() {
      return {
        ...this.extraData,
        ...this.extraFormData,
      }
    },
  },
}
</script>
