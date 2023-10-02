<template>
  <div
    :dir="dir"
    :class="dropdownClasses"
    class="dropdown v-select v-select-tree">
    <div
      ref="toggle"
      class="dropdown-toggle"
      @mousedown.prevent="toggleDropdown">

      <div
        ref="selectedOptions"
        class="vs__selected-options">
        <slot
          v-for="option in valueAsArray"
          :option="(typeof option === 'object')?option:{[label]: option}"
          :deselect="deselect"
          :multiple="multiple"
          :disabled="disabled"
          name="selected-option-container">
          <span
            :key="option.index"
            class="selected-tag">
            <slot
              v-bind="(typeof option === 'object')?option:{[label]: option}"
              name="selected-option">
              {{ getOptionLabel(option) }}
            </slot>
            <button
              v-if="multiple"
              :disabled="disabled"
              type="button"
              class="close"
              aria-label="Remove option"
              @click="deselect(option)">
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </slot>

        <input
          ref="search"
          v-model="search"
          :disabled="disabled"
          :placeholder="searchPlaceholder"
          :tabindex="tabindex"
          :readonly="!searchable"
          :id="inputId"
          :aria-expanded="dropdownOpen"
          type="search"
          class="form-control"
          autocomplete="off"
          role="combobox"
          aria-label="Search for option"
          @keydown.delete="maybeDeleteValue"
          @keyup.esc="onEscape"
          @keydown.up.prevent="typeAheadUp"
          @keydown.down.prevent="typeAheadDown"
          @keydown.enter.prevent="typeAheadSelect"
          @keydown.tab="onTab"
          @blur="onSearchBlur"
          @focus="onSearchFocus"
        >

      </div>
      <div class="vs__actions">
        <button
          v-show="showClearButton"
          :disabled="disabled"
          type="button"
          class="clear"
          title="Clear selection"
          @click="clearSelection"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <i
          v-if="!noDrop"
          ref="openIndicator"
          role="presentation"
          class="open-indicator"/>
        <slot name="spinner">
          <div
            v-show="loading"
            class="spinner">Loading...</div>
        </slot>
      </div>
    </div>

    <transition :name="transition">
      <ul
        v-show="dropdownOpen"
        ref="dropdownMenu"
        :style="{ 'max-height': maxHeight }"
        class="dropdown-menu"
        role="listbox"
        @mousedown="onMousedown"
      >
        <li
          v-for="block in filteredOptions"
          :key="block.label"
          class="no-hover">
          <a
            v-b-toggle="`block-${block.label}`"
            v-if="groupByType && block.areas.length"
            @mousedown.prevent.stop="noop"
          >
            <strong>{{ block.label }}</strong>
            <font-awesome-icon
              icon="caret-down"
              class="ml-1 fa-xs"
            />
          </a>
          <b-collapse
            :id="`block-${block.label}`"
            :visible="true"
          >
            <area-tree
              v-for="area in block.areas"
              :key="block.label + '-' + area.id"
              :prefix="block.label"
              :area="area"
              :visible="isSelectedArea(area, block)"
              :search="debouncedSearch"
              :visible-element="selectedElement"
              :selected-detail="selectedDetail"
              :no-collapse="noCollapse"
              :class="{'ml-3': groupByType}"
              class="no-hover"
              @select="select"
            />
          </b-collapse>
        </li>
        <li
          v-if="!filteredOptions.length || isEmpty"
          class="no-options">
          <slot name="no-options"> {{ $t() }}.</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>


<script>
import vSelect from 'vue-select'
import _ from 'lodash'
import moment from 'moment'
import ThemeTreeMixin from './ThemeTreeMixin.js'
import AreaTree from './AreaTree'
import RecordType from '~/assets/js/iris2/model/RecordType.js'
import { mapState } from 'vuex'

/**
 * Component that extends VueSelect in order to add option group functionality and
 * extend the number of slots and templating options.
 *
 * Options Example: [{title: 'A', options: [{}]}]
 *
 * @todo terminar de acoplar.
 */
export default {
  name: 'ThemeTreeVSelect',
  components: {
    AreaTree,
  },
  extends: {
    ...vSelect,
    created() {},
  },
  mixins: [ThemeTreeMixin],
  props: {
    options: {
      type: [Object],
      required: false,
      default() {
        return {}
      },
    },
    filter: {
      type: Function,
      default(options, search, self) {
        return self.filterTree(search)
      },
    },
    label: {
      type: String,
      default: 'description',
    },
    alwaysOpen: {
      type: Boolean,
      default: false,
    },
    noCollapse: {
      type: Boolean,
      default: false,
    },
    groupByType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      debouncedSearch: '',
      search: '',
    }
  },
  computed: {
    ...mapState(['parameters']),
    minSearchLength() {
      return parseInt(this.parameters.get('CERCA_SUBSTRING', 1))
    },
    minKeywordLength() {
      return parseInt(this.parameters.get('CERCA_MINIM_PARAULA', 1))
    },
    minKeywordCount() {
      return parseInt(this.parameters.get('CERCA_COINCIDENCIES', 1))
    },
    autoOpen() {
      return this.schema.autoOpen
    },
    isEmpty() {
      return !this.filteredOptions.find(b => b.areas.length > 0)
    },
    /**
     * Return the current state of the
     * dropdown menu.
     * @return {Boolean} True if open
     */
    dropdownOpen() {
      return this.noDrop
        ? false
        : (this.open || this.alwaysOpen) && !this.mutableLoading
    },
    /**
     * The currently displayed options, filtered
     * by the search elements value. If tagging
     * true, the search text will be prepended
     * if it doesn't already exist.
     *
     * @return {array}
     */
    filteredOptions() {
      if (!Array.isArray(this.mutableOptions)) {
        return []
      }
      if (!this.filterable && !this.taggable) {
        return this.mutableOptions.slice()
      }
      let options = this.debouncedSearch.length
        ? this.filter(this.mutableOptions, this.debouncedSearch, this)
        : this.mutableOptions
      if (
        this.taggable &&
        this.debouncedSearch.length &&
        !this.optionExists(this.debouncedSearch)
      ) {
        options.unshift(this.debouncedSearch)
      }
      return options
    },
    selectedElement() {
      return _.get(this.mutableValue, 'element.id', false)
    },
    selectedDetail() {
      return _.get(this.mutableValue, 'id', false)
    },
    selectedIsQuery() {
      return (
        _.get(this.mutableValue, 'record_type_id', null) === RecordType.CONSULTA
      )
    },
  },
  watch: {
    /**
     * When options change, update
     * the internal mutableOptions.
     * @param  {array} val
     * @return {void}
     */
    options(val) {
      this.mutableOptions = this.displayTree()
    },
    value(newValue) {
      if (newValue) {
        this.open = false
        this.$refs.search.blur()
      }
    },
    search(newValue) {
      if (
        newValue.length >= this.minSearchLength ||
        !newValue ||
        !isNaN(newValue)
      ) {
        this.newSearch(newValue)
      }
    },
    /**
     * Autoselect first
     */
    filteredOptions(tree) {
      if (this.loading || !tree) {
        return
      }
      const blocks = tree.filter(block => block.areas.length > 0)
      if (
        blocks.length == 1 &&
        blocks[0].areas.length == 1 &&
        blocks[0].areas[0].elements.length == 1 &&
        blocks[0].areas[0].elements[0].details.length == 1
      ) {
        this.select(blocks[0].areas[0].elements[0].details[0])
      }
    },
  },
  created() {
    this.mutableValue = _.isEmpty(this.value) ? null : this.value
    this.mutableOptions = this.displayTree()
    this.mutableLoading = this.loading
    this.oldNewSearch = this.newSearch
    this.newSearch = _.debounce(this.newSearch, 1000, {
      leading: false,
      trailing: true,
    })
    this.$on('option:created', this.maybePushTag)
  },
  mounted() {
    if (this.autoOpen) {
      this.open = true
      this.$refs.search.focus()
    }
  },
  methods: {
    newSearch(value) {
      this.debouncedSearch = value
    },
    isSelectedArea(area, block) {
      return (
        area.id == _.get(this.mutableValue, 'area.id', null) &&
        this.selectedIsQuery === block.query
      )
    },
    /**
     * Toggle the visibility of the dropdown menu. Fix for on blur problems.
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
    noop() {},
  },
}
</script>


<style lang="scss">
.v-select-tree.v-select {
  .dropdown-menu {
    overflow-x: auto;
    li.no-hover {
      &:hover,
      &.highlight,
      &:focus {
        a {
          background-color: transparent;
        }
      }
    }
    li:not(.no-hover):hover > a {
      background-color: rgba($primary, 0.5);
    }
  }
}
.v-select .dropdown-menu .optgroup-header {
  display: block;
  padding: 10px 15px;
  font-weight: bolder;
  border-top: 2px solid rgba(50, 50, 50, 0.1);
  border-bottom: 2px solid rgba(50, 50, 50, 0.1);
}

.v-select.v-select-tree .dropdown-menu li > a {
  padding: 5px 20px;
  cursor: pointer;
}

.v-select.v-select-tree .dropdown-menu li.odd > a {
  background: rgba(50, 50, 50, 0.1);
}

.v-select.v-select-tree .dropdown-menu li.active:not(.highlight) > a {
  background-color: transparent;
  font-weight: bold;
}

.v-select.v-select-tree .dropdown-toggle::after {
  display: none;
}

.v-select.v-select-tree li.detail > a {
  padding: 5px 10px;
}

.v-select.v-select-tree ul.details {
  padding: 0px 60px;
}

.v-select.v-select-tree li {
  line-height: 1; /* Normalize line height */
}
</style>
