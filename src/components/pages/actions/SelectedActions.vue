<template>
  <div class="selected-actions">
    <slot
      :selected="selected"
      :disabled="disabled">
      <post-button
        ref="postButton"
        :url="urls"
        :confirm-title="titleText"
        :confirm-text="confirmText"
        :error-title="errorTitle"
        :text="titleText"
        :disabled="disabled"
        :variant="variant"
        :extra-data="extraData"
        :reset-errors="true"
        :display-global-errors="false"
        :form-component="formComponent"
        @action-success="actionDone"
        @post-start="actionStart"
        @post-error="actionError"
      />
    </slot>
    <sweet-modal
      ref="error"
      :alt="$t('error')"
      icon="error"
      aria-describedby="modalDescription"
      role="alertdialog"
      hide-close-button
    >
      <p id="modalDescription">{{ errorMessage }}</p>
      <button
        slot="button"
        class="btn btn-primary"
        @click="closeError"
      >
        {{ $t('ok') }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
import PostButton from '~/components/forms/PostButton.vue'
import { isPlainObject } from 'lodash'

export default {
  name: 'SelectedActions',
  components: {
    PostButton,
  },
  props: {
    selected: {
      type: Array,
      default: () => [],
    },
    /**
     * getUrl function must return either:
     * - A url that explicitly identifies the resource
     *    /api/model/99/action/
     * - An object with an url that doesn't identify the resource and a data object with a single key:value
     *    They key will be sent on the post body along its value.
     *    { url: /api/model/action/, data: { id: 99} }
     */
    getUrl: {
      type: Function,
      default: () => {
        return row => row.url
      },
    },
    extraData: {
      type: Object,
      default() {
        return {}
      },
    },
    /**
     * i18n key for confirming the operation. You can add vars using the format:
     * {number} {selected}
     */
    successMessageKey: {
      type: String,
      required: true,
    },
    /**
     * i18n key for the title confirmation. You can add vars using the format:
     * {number} {selected}
     */
    confirmTitleKey: {
      type: String,
      required: true,
    },
    /**
     * i18n key for the text confirmation. You can add vars using the format:
     * {number} {selected}
     */
    confirmTextKey: {
      type: String,
      required: true,
    },
    /**
     * i18n key for the errors. You can add vars using the format:
     * {number} {selected}
     */
    errorMessageKey: {
      type: String,
      required: true,
    },
    errorTitle: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'primary',
      required: false,
    },
    formComponent: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      errors: [],
    }
  },
  computed: {
    urls() {
      return this.selected
        .map(item => this.getUrl(item))
        .filter(item => item != null)
    },
    mappedUrls() {
      const urls = this.selected
        .map(item => {
          const url = this.getUrl(item)
          if (isPlainObject(url)) {
            return { [this.buildUrlWithIdentifier(url)]: item }
          } else {
            return { [url]: item }
          }
        })
        .filter(item => item != null)
      return urls.length > 0 ? Object.assign.apply({}, urls) : {}
    },
    disabled() {
      return this.urls.length == 0
    },
    confirmText() {
      return this.$t(this.confirmTextKey)
        .replace('{number}', this.urls.length)
        .replace('{selected}', this.selected.length)
    },
    titleText() {
      return this.$t(this.confirmTitleKey)
        .replace('{number}', this.urls.length)
        .replace('{selected}', this.selected.length)
    },
    errorMessage() {
      const errorMsg = this.$t(this.errorMessageKey)
        .replace('{number}', this.urls.length)
        .replace(
          '{records}',
          this.errors
            .filter(url => this.mappedUrls[url] != undefined)
            .map(url => '#' + this.mappedUrls[url].normalized_record_id)
            .join(',')
        )
        .replace('{selected}', this.selected.length)
        .replace('{errorNumber}', this.errors.length)
      return errorMsg
    },
  },
  methods: {
    actionStart() {
      this.$nuxt.$loading.start()
    },
    actionDone() {
      this.$nuxt.$loading.finish()
      this.$emit('action-done', this.selected)
      this.$notify({
        group: 'iris',
        title: this.$t(this.successMessageKey),
        type: 'success',
        text: '',
      })
    },
    actionError(errors) {
      this.$nuxt.$loading.finish()
      this.errors = errors
      this.$refs.error.open()
    },
    closeError() {
      this.$emit('action-done', this.selected)
      this.$refs.postButton.close()
      this.$refs.error.close()
    },
    buildUrlWithIdentifier(obj) {
      return `${obj.url}${Object.values(obj.data)[0]}/`
    },
  },
}
</script>

<style lang="scss">
.selected-actions {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
