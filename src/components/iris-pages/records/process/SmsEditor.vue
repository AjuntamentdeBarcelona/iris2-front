<template>
  <div v-if="!parameterLoading">
    <textarea
      v-model="text"
      :disabled="disabled"
      class="w-100"
      @input="newVal()" />
    <span
      :class="charColor"
      class="word-counter">{{ $t('max_chars') }} {{ text.length }}/{{ maxLength }}</span>
  </div>
  <div 
    v-else
    class="alert alert-info">
    {{ $t('loading') }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

/**
 * Component for editing SMS answers in IRIS2.
 * The max length of the SMS is limited by a Parameter, loaded in
 * the master store.
 */
export default {
  name: 'SmsEditor',
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      text: this.value,
    }
  },
  computed: {
    maxLength() {
      return this.parameters.get('SMSLENGTH', 160)
    },
    charsLeft() {
      return this.maxLength - this.text.length
    },
    charColor() {
      return this.charsLeft >= 0 ? '' : 'text-danger'
    },
    ...mapState(['parameters', 'parameterLoading']),
  },
  watch: {
    value() {
      this.text = this.value
      this.newVal()
    },
  },
  mounted() {
    this.$emit('validated', false, [this.$t('loading')])
    this.loadParams().then(() => {
      this.newVal()
    })
  },
  methods: {
    ...mapActions(['loadParams']),
    /**
     * Set the new val and validate length.
     */
    newVal() {
      this.$emit('input', this.text)
      if (!this.text) {
        this.$emit('validated', false, [this.$t('required')])
      } else if (this.charsLeft < 0) {
        this.$emit('validated', false, [
          this.$t('textTooBig')
            .replace('{0}', this.text.length)
            .replace('{1}', this.maxLength),
        ])
      } else {
        this.$emit('validated', true, [])
      }
    },
  },
}
</script>
