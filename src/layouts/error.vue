
<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <div
        :class="errorLevel"
        class="unauthorized irisbox bg-danger text-white">
        <h1>{{ $t(errorInfo.title) }}</h1>
        <p>{{ $t(errorInfo.explanation) }}</p>
        <p
          v-if="debug && message"
          class="description">{{ message }}</p>
        <div class="d-flex">
          <button
            v-if="errorInfo.actionRefresh"
            class="btn btn-primary ml-auto"
            @click="refresh">
            {{ $t(errorInfo.actionRefresh) }}
          </button>
          <button
            v-if="!errorInfo.actionRefresh"
            class="btn btn-primary ml-auto"
            @click="goBack">
            {{ $t('error_go_back') }}
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
const handledErrors = {
  404: {
    title: 'error_404_title',
    explanation: 'error_404_explanation',
  },
  default: {
    title: 'error_unexpected_title',
    explanation: 'error_unexpected_explanation',
  },
  newVersion: {
    title: 'error_new_version_title',
    explanation: 'error_new_version_explanation',
    actionRefresh: 'error_new_version_action',
  },
  sessionLost: {
    title: 'error_session_lost',
    explanation: 'error_session_lost_explanation',
    actionRefresh: 'error_new_access',
  },
  connectionLost: {
    title: 'error_connextion_lost',
    explanation: 'error_connextion_lost_explanation',
    actionRefresh: 'error_new_access',
  },
  dataNotLoaded: {
    title: 'error_loading_data_title',
    explanation: 'error_loading_data_explanation',
    actionRefresh: 'error_new_access',
  },
}

/**
 * Error page for IRIS. Its responsible of handling unexpected errors and errors related to
 * the SPA page load and events itself.
 *
 * In general, each page component is responsible of handling its errors, but they can decide
 * to throw errors that will be handlend by this component. For example, a component loading the
 * detail of a REST resource could throw an error with status 404 and the Error component will
 * handle and display it.
 *
 * This class allows to handle an special case of user-friendly exceptions, which error message
 * and title will be shown directly to the usen, event if the debug mode is disabled. This class
 * consider an error user-friendly when the error object has an attribute userFriendly set to true.
 * A HandledPageError object is availably within the libraries for throwing those kinds of errors
 * easily.
 */
export default {
  layout: 'backoffice', // you can set a custom layout for the error page
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  computed: {
    debug() {
      try {
        return this.$nuxt.debug
      } catch {
        return false
      }
    },
    errorInfo() {
      if (this.error.userFriendly) {
        return this.error
      } else if (this.isNewVersion) {
        return handledErrors.newVersion
      } else if (this.sessionLost) {
        return handledErrors.sessionLost
      } else if (this.connectionLost) {
        return handledErrors.connectionLost
      } else if (this.error.statusCode) {
        return handledErrors[this.error.statusCode] || handledErrors.default
      }
      return handledErrors.default
    },
    isNewVersion() {
      return this.error.statusCode == 404 && this.isChunkFailed()
    },
    sessionLost() {
      return (
        (this.error.statusCode == 403 || this.error.statusCode == 401) &&
        this.isChunkFailed()
      )
    },
    connectionLost() {
      return this.error.statusCode == 500 && this.isChunkFailed()
    },
    errorLevel() {
      if (this.isNewVersion) {
        return 'alert alert-info'
      } else if (this.sessionLost) {
        return 'alert alert-warning'
      }
      return 'alert alert-danger'
    },
  },
  created() {
    this.nuxt
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    refresh() {
      window.location.reload()
    },
    isChunkFailed() {
      return this.error.message.toLowerCase().indexOf('loading chunk') >= 0
    },
    isOnline() {
      return this.error.message.toLowerCase().indexOf('loading chunk') >= 0
    },
  },
}
</script>

<style>
.__nuxt-error-page {
  /*position: absolute;*/
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
