<template>
  <div>
    <textarea
      v-attributes="'input'"
      v-model="value"
      :id="getFieldID(schema)"
      :class="schema.fieldClasses"
      :disabled="disabled"
      :maxlength="maxChars"
      :minlength="schema.min"
      :placeholder="schema.placeholder"
      :readonly="schema.readonly"
      :required="schema.required"
      :rows="schema.rows || 2"
      :name="schema.inputName"
      class="form-control" />
    <span
      ref="words"
      :class="wordColor"
      class="word-counter">{{ $t('valid_words') }} {{ words }}/{{ minWords }} {{ $t('min').toLowerCase() }}.</span>
    <span
      ref="chars"
      :class="charColor"
      class="word-counter">{{ $t('max_chars') }} {{ chars }}/{{ maxChars }}</span>
  </div>
</template>

<script>
import { abstractField, validators } from 'vue-form-generator'
import _ from 'lodash'
import trimAccents from '~/assets/js/utils/string/trimAccents.js'

/**
 * Text area extended with counters for a minimum number of words and a maximum number of characters.
 * Max and min are defined in the max (max chars) and minWords attributes from the schema.
 */
export default {
  name: 'FieldTextAreaCount',
  mixins: [abstractField],
  computed: {
    words() {
      return this.countWords(this.value)
    },
    chars() {
      return this.countChars(this.value)
    },
    minWords() {
      return this.schema.minWords || '-'
    },
    minWordLength() {
      return this.schema.minWordLength || 4
    },
    maxChars() {
      return this.schema.max || '-'
    },
    minChars() {
      return this.schema.min || '-'
    },
    wordColor() {
      return this.words >= this.minWords ? 'text-primary' : 'text-danger'
    },
    charColor() {
      return this.chars >= this.minChars
        ? this.colorCode(this.chars, this.maxChars)
        : 'text-danger'
    },
  },
  watch: {
    schema() {
      this.setSchemaValidators()
    },
  },
  mounted() {
    this.setSchemaValidators()
    this.validate()
  },
  updated() {
    if (this.value == null) {
      this.value = ''
    }
    this.$nextTick(function() {
      this.validate()
    })
  },
  methods: {
    countWords(text) {
      return _.words(trimAccents(text ? text : ''), /\w{4,}\b/g).length
    },
    countChars(text) {
      return text ? text.length : 0
    },
    colorCode(current, max) {
      const pct = (current * 100) / max
      if (pct < 80 || isNaN(pct)) {
        return 'text-primary'
      } else if (pct < 100) {
        return 'text-warning'
      } else {
        return 'text-danger'
      }
    },
    setSchemaValidators() {
      if (this.schema.validator == null) {
        this.schema.validator = [
          (value, schema, model) => {
            if (this.countWords(value) < this.minWords) {
              return (
                this.$t('error_at_least_words')
                  .replace('{words}', this.minWords)
                  .replace('{chars}', this.minWordLength) + '. '
              )
            }
            return null
          },
          validators.string.locale(),
        ]
      }
    },
  },
}
</script>


<style lang="scss">
</style>
