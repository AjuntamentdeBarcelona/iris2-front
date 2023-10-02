<template>
  <div class="form-group quicksearch">
    <span class="input-group">
      <input
        ref="input"
        v-model="inputText"
        :placeholder="$t('tasks_auto_search')"
        type="text"
        class="form-control"
        @keydown.enter.prevent.stop="search"
      >
      <div class="input-group-append">
        <button
          class="btn btn-primary"
          @click.prevent.stop="search">
          <font-awesome-icon
            :icon="['fas', 'search']"/>
          {{ $t('search') }}
        </button>
      </div>
    </span>
  </div>
</template>

<script>
import { isNormalizedRecordId } from '~/assets/js/helpers'

// Maps back's filters found in 'src/record_cards/filters.py'
const filters = {
  normalized_record_id: 'normalized_record_id',
  applicant_identifier: 'applicant_identifier',
}

const defaultFilters = {
  [filters['normalized_record_id']]: '',
  [filters['applicant_identifier']]: '',
  normalized_record_id_lookup: 'startswith',
}

export default {
  name: 'FilterFormQuickSearch',
  props: {
    initial: {
      type: Object,
      default: () => ({ normalized_record_id: '' }),
    },
    /**
     * If true, only will search for complete codes.
     */
    validateCode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputText:
        this.initial.normalized_record_id ||
        this.initial.applicant_identifier ||
        '',
      queryParams: {},
    }
  },
  computed: {
    inputType() {
      // Maps back's filters found in 'src/record_cards/filters.py'
      return filters['normalized_record_id']
    },
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    focusInput() {
      this.$refs.input.focus()
    },
    sendErrorMessage() {
      this.$notify({
        group: 'iris',
        title: this.$t('tasks_invalid_id'),
        type: 'error',
        text: '',
      })
    },
    search(event) {
      this.inputText = this.inputText.trim()
      const textLength = this.inputText.length
      if (this.validateCode) {
        if (textLenght >= 7 || textLength == 0) {
          this.updateQueryParams()
        } else {
          this.sendErrorMessage()
        }
      } else {
        this.updateQueryParams()
      }
      this.focusInput()
    },
    updateQueryParams() {
      this.queryParams = Object.assign(
        { ...defaultFilters },
        this.inputText ? { [this.inputType]: this.inputText } : {}
      )
      this.signalUpdateQueryParams()
    },
    signalUpdateQueryParams() {
      this.$emit(
        'updated-query-params',
        { ...this.queryParams },
        this.inputType,
        this.$options.name
      )
    },
    clearField() {
      this.inputText = ''
    },
    resetField() {
      this.clearField()
      this.updateQueryParams()
    },
  },
}
</script>
<style lang="scss">
.quicksearch {
  width: 450px;
}
</style>
