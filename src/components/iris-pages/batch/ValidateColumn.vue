<template>
  <span 
    v-b-popover.hover="popover"
    v-if="label || !actions.can_perform"
    :class="{'badge badge-success p-1': isValidating}">
    {{ label }}
  </span>
  <post-button 
    v-else
    :url="actions.action_url"
    :confirm-text="$t('batch_validate_confirm')"
    :confirm-title="$t('batch_validate')"
    :text="$t('batch_validate')"
    @action-success="onValidated">
    {{ $t('batch_validate') }}
  </post-button>
</template>


<script>
import PostButton from '~/components/forms/PostButton.vue'
export default {
  name: 'ValidateColumn',
  components: {
    PostButton,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
  },
  computed: {
    isValidating() {
      return this.data.status == 2
    },
    popover() {
      return this.isValidating ? this.$t('batch_validate_confirm') : undefined
    },
    label() {
      if (this.isValidating) {
        return this.$t('batch_validating')
      }
      return this.data[this.column]
    },
    actions() {
      return this.data.actions.validate || {}
    },
  },
  methods: {
    onValidated(data) {
      Object.assign(this.data, data)
    },
  },
}
</script>
