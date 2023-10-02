<script>
import vSelect from 'vue-select'

/**
 * Extends VueSelect adding the always open option.
 */
export default {
  extends: vSelect,
  props: {
    /**
     * If true, the dropdown will be always opened.
     */
    alwaysOpen: {
      type: Boolean,
      default: false,
    },
    /**
     * If true, will emit infinite scroll events.
     */
    infiniteScrollActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      $ul: null,
      lastSearch: '',
    }
  },
  computed: {
    /**
     * Return the current state of the
     * dropdown menu.
     * @return {Boolean} True if open
     */
    dropdownOpen() {
      return this.noDrop ? false : this.open || this.alwaysOpen
    },
    pixels() {
      return this.pixelsToPointerBottom()
    },
  },
  watch: {
    async dropdownOpen() {
      if (this.dropdownOpen && !this.observer && this.infiniteScrollActive) {
        await this.$nextTick()
        const $ul = this.$el.querySelector('ul')
        this.$el.querySelector('ul>li:last-child')
        if ($ul != this.$ul) {
          this.$ul = $ul
          this.$ul.addEventListener('scroll', event => {
            if (
              !this.mutableLoading &&
              (this.$ul.scrollTop * 100) /
                (this.$ul.scrollHeight - this.$ul.offsetHeight) >
                70
            ) {
              this.$emit('infinite-scroll')
            }
          })
        }
      }
    },
    /**
     * Override search for $emit the event when empty
     */
    search() {
      if (this.search.length > 0) {
        this.onSearch(this.search, this.toggleLoading)
      }
      if (this.dropdownOpen) {
        this.$emit('search', this.search, this.toggleLoading)
      }
    },
  },
  methods: {
    maybeAdjustScroll() {
      return false
    },
    /**
     * Toggle the visibility of the dropdown menu.
     * @param  {Event} e
     * @return {void}
     */
    toggleDropdown(e) {
      if (
        e.target === this.$refs.openIndicator ||
        e.target === this.$refs.search ||
        e.target === this.$refs.toggle ||
        e.target.classList.contains('selected-tag') ||
        e.target === this.$el
      ) {
        if (this.open) {
          this.$refs.search.blur() // dropdown will close on blur
          // FIX CLOSING PROBLEMS WHEN LOSING BLUR
          this.$nextTick(() => {
            if (this.open) {
              this.open = false
            }
          })
        } else {
          if (!this.disabled) {
            this.open = true
            this.$refs.search.focus()
          }
        }
      }
    },
  },
}
</script>
