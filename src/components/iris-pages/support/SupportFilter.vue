<template>
  <div class="irisbox">
    <h4>{{ $t('support_can_help') }}</h4>
    <span class="input-group">
      <input
        ref="input"
        v-model="internalValue"
        :placeholder="$t('support_search')"
        type="text"
        class="form-control"
        @keypress.enter="onSearch"
      >
      <div class="input-group-append">
        <button
          class="btn btn-primary rounded-right"
          @click="onSearch"
          v-text="$t('search')"
        />
      </div>

      <button
        v-if="internalValue && !selection"
        class="ml-1 btn btn-primary"
        @click="onClear"
        v-text="$t('clear')"
      />

      <button
        v-if="selection"
        class="ml-1 btn btn-primary"
        @click="onUnselect"
        v-text="$t('support_unselect')"
      />
    </span>
  </div>
</template>

<script>
export default {
  name: 'SupportFilter',
  props: {
    value: {
      type: String,
      default: '',
    },
    selection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      internalValue: this.value,
    }
  },
  watch: {
    value(value, oldVal) {
      this.internalValue = value
    },
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    search() {
      this.$emit('input', this.internalValue)
      this.focusInput()
    },
    focusInput() {
      this.$refs.input.focus()
    },
    onSearch() {
      this.search()
    },
    onClear() {
      this.internalValue = ''
      this.search()
    },
    onUnselect() {
      this.$emit('unselect')
    },
  },
}
</script>
