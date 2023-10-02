<template>
  <div
    :dir="dir"
    :class="dropdownClasses"
    class="dropdown v-select v-select-grouped">
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
            v-show="mutableLoading"
            class="spinner">Loading...</div>
        </slot>
      </div>
    </div>

    <transition :name="transition">
      <ul
        v-if="dropdownOpen"
        ref="dropdownMenu"
        :style="{ 'max-height': maxHeight }"
        class="dropdown-menu"
        role="listbox"
        @mousedown="onMousedown">
        <li
          v-for="(option, index) in filteredOptions"
          :key="index"
          :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer, group: option.optgroup, odd: option.$odd}"
          role="option"
          @mouseover="typeAheadPointer = index">
          <span
            v-if="option.optgroup"
            class="optgroup-header">{{ option.optgroup }}</span>
          <a
            v-if="!option.optgroup"
            @mousedown.prevent.stop="select(option)">
            <slot
              v-if="!option.optgroup"
              v-bind="(typeof option === 'object')?option:{[label]: option}"
              name="option">
              {{ getOptionLabel(option) }}
            </slot>
          </a>
        </li>
        <li
          v-if="!filteredOptions.length"
          class="no-options">
          <slot name="no-options">{{ $t('autocomplete_no_options') }}</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>


<script>
import vSelect from 'vue-select'

/**
 * Component that extends VueSelect in order to add option group functionality and
 * extend the number of slots and templating options.
 *
 * Options Example: [{title: 'A', options: [{}]}]
 *
 *
 */
export default {
  name: 'GroupSelect',
  extends: vSelect,
  watch: {
    /**
     * When options change, update
     * the internal mutableOptions.
     * @param  {array} val
     * @return {void}
     */
    options(val) {
      this.mutableOptions = this.normaliseOptGroups(val)
    },
    value(newValue) {
      if (newValue) {
        this.open = false
        this.$refs.search.blur()
      }
    },
  },
  created() {
    this.mutableValue = this.value
    this.mutableOptions = this.options.slice(0)
    this.mutableOptions = this.normaliseOptGroups(this.options.slice(0))
    this.mutableLoading = this.loading
    this.$on('option:created', this.maybePushTag)
  },
  methods: {
    /** check if the list has elements which have
     *  title and a list of options, and flatten out
     */
    normaliseOptGroups(val) {
      var count = 0
      return val
        .map(item => {
          if (item.title && item.options && item.options instanceof Array) {
            return [{ optgroup: item.title }].concat(item.options)
          } else {
            return [item]
          }
        })
        .reduce((arr, group) => {
          return arr.concat(group)
        }, [])
        .map(item => {
          if (!item.optgroup) {
            item.$odd = count % 2 != 0
            count++
          }
          return item
        })
    },
  },
}
</script>


<style lang="scss">
.v-select {
  .dropdown-menu {
    overflow-x: auto;
  }
}
.v-select .dropdown-menu .optgroup-header {
  display: block;
  padding: 10px 15px;
  font-weight: bolder;
  border-top: 2px solid rgba(50, 50, 50, 0.1);
  border-bottom: 2px solid rgba(50, 50, 50, 0.1);
}

.v-select.v-select-grouped .dropdown-menu a {
  padding: 10px 50px;
}

.v-select.v-select-grouped .dropdown-menu .odd {
  background: $light;
}

// .v-select.v-select-grouped .dropdown-menu li.active:not(.highlight) > a {
//   background-color: transparent;
//   font-weight: bold;
// }

.v-select.v-select-grouped .dropdown-toggle::after {
  display: none;
}
// TODO: DAMIÀ A. PONT;
</style>
