<template>
  <nav>
    <ul class="pagination alphabet-pagination">
      <li
        v-for="(character, index) in alphabet"
        :key="index"
        :class="{active: character === selectedCharacter}"
        class="page-item"

      >
        <a
          class="page-link rounded-0"
          @click.prevent="selectCharacter(character)"
        >
          {{ character }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
/**
 * Given an iterable of objects and a property, generates an alphabetic index based on the first letter of each
 * object's field of said property
 * If an alphabet is provided, it renders that instead
 *
 * Signals the selected character with an event to use on a filtering function afterwards
 */
import { sortDataAlpabetically, normalizeCharacter } from '~/assets/js/helpers'

export default {
  props: {
    customAlphabet: {
      type: [String, Array],
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemTitleProperty: {
      type: String,
      default: 'title',
    },
  },
  data() {
    return {
      builtAlphabet: [],
      allResultsCharacter: this.$t('all'),
      selectedCharacter: this.$t('all'),
    }
  },
  computed: {
    alphabet() {
      return this.customAlphabet
        ? [this.allResultsCharacter, ...this.customAlphabet]
        : this.builtAlphabet
    },
  },
  watch: {
    items: {
      handler(value, oldVal) {
        if (!this.alphabet) {
          this.constructAlphabet()
        }
      },
      immediate: true,
    },
  },
  methods: {
    constructAlphabet() {
      let tempAlphabet = new Set()
      let orderedTempAlphabet = []

      this.items.forEach(item => {
        const itemFirstChar = item[this.itemTitleProperty].substr(0, 1)
        if (itemFirstChar !== '') {
          tempAlphabet.add(normalizeCharacter(itemFirstChar))
        }
      })
      orderedTempAlphabet = this.sortAlphabet([...tempAlphabet])

      this.builtAlphabet = [this.allResultsCharacter, ...orderedTempAlphabet]
    },
    sortAlphabet(alphabet) {
      return sortDataAlpabetically(alphabet)
    },
    selectCharacter(character) {
      this.selectedCharacter = character

      if (character === this.allResultsCharacter) {
        this.$emit('reset-selection')
      } else {
        this.$emit('character-selected', this.selectedCharacter)
      }
    },
  },
}
</script>


<style lang="scss" scoped>
.alphabet-pagination {
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  .page-item {
    text-transform: uppercase;
    text-align: center;
    &:first-of-type {
      text-transform: initial;
    }
    &.active {
      font-weight: bold;
    }
  }
}
</style>
