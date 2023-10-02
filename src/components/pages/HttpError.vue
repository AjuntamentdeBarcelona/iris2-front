<template>
  <div
    v-if="error" 
    class="unauthorized irisbox bg-danger text-white">
    <h1>{{ $t(message.title) }}</h1>
    <p
      class="description">{{ $t(message.explanation) }}</p>
    <slot name="actions" />
  </div>
</template>

<script>
const messages = {
  default: {
    title: 'error_unexpected_title',
    explanation: 'error_unexpected_explanation',
  },
  403: {
    title: 'error_unauthorized',
    explanation: 'error_unauthorized_explanation',
  },
  404: {
    title: 'error_404_title',
    explanation: 'error_404_explanation',
  },
}
export default {
  name: 'HttpError',
  props: {
    error: {
      type: Error,
      required: false,
      default: null,
    },
  },
  computed: {
    message() {
      if (
        this.error &&
        this.error.response &&
        messages[this.error.response.status]
      ) {
        return {
          ...messages[this.error.response.status],
        }
      }
      return messages.default
    },
  },
}
</script>
