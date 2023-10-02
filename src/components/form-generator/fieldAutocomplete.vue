<!-- fieldAwesome.vue -->
<template>
  <span>
    <v-select
      v-if="selectOnSearch"
      v-model="selectValue"
      :disabled="isDisabled || schema.readonly"
      :label="schema.optionLabelAttribute"
      :placeholder="schema.placeholder"
      :filterable="filterable"
      :filter-by="filterByFn"
      :options="filteredOptions"
      :loading="loading"
      :multiple="multiple"
      :taggable="taggable"
      :create-option="schema.formatUserInputToModel"
      :clearable="schema.clearable"
      :searchable="schema.searchable"
      :no-drop="schema.noDrop"
      :always-open="alwaysOpen"
      :input-id="schema.model"
      :infinite-scroll-active="infiniteScroll"
      transition="autocomplete"
      type="text"
      class="form-autocomplete"
      @search="selectOnSearch"
      @search:focus="checkLazy"
      @infinite-scroll="loadNextPage"
    >
      <template slot="no-options">{{ noOptionsText }}</template>
    </v-select>
    <v-select
      v-if="!selectOnSearch"
      v-model="selectValue"
      :disabled="isDisabled || schema.readonly"
      :label="schema.optionLabelAttribute"
      :placeholder="schema.placeholder"
      :filterable="filterable"
      :filter-by="filterByFn"
      :options="filteredOptions"
      :loading="loading"
      :multiple="multiple"
      :taggable="taggable"
      :create-option="schema.formatUserInputToModel"
      :clearable="schema.clearable"
      :searchable="schema.searchable"
      :no-drop="schema.noDrop"
      :always-open="alwaysOpen"
      :input-id="schema.model"
      :infinite-scroll-active="infiniteScroll"
      transition="autocomplete"
      type="text"
      class="form-autocomplete"
      @infinite-scroll="loadNextPage"
    >
      <template slot="no-options">{{ noOptionsText }}</template>
    </v-select>
  </span>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import irisField from './irisField.js'
import autocompleteMixin from './autocompleteMixin.js'
import vSelect from './IrisVueSelect'
var _ = require('lodash')

/**
 * VueFormGenerator Autocomplete  field implemente with Vue-Select.
 *
 * For using ajax you must set the url property, by default it process the RestFramework pagination style.
 * For custom processing the ajax result, you can pass a function in the processAjaxResult schema attribute.
 *
 * Extra schema options:
 * - url (axios uri): autocomplete from an external endpoint with the v-select options.
 * - optionLabelAttribute: vue select label option. Specifies a field from the ajax call for retrieving the option label
 *   defaults to 'label'
 * - processAjaxResult (function): function for further processing over the ajax results.
 * - valueAttribute: The returned value will be the one contained by this property, defaults to 'id'
 * - objectValue (default: false): the full object is set as value of the field
 *   valueAttribute must be explicitally set, and not rely on the default, so we can read it from
 *   the schema on outside, otherwise returns the full object
 * - filterFn: function to filter the options with
 * - forwardFields (list): field names which will be included in the query for ajax requests.
 * - requiredFields (list): this field will be disabled until all the fields had a value
 * - getInitialOption (function): this function will be called with the model instance in order to retrieve
 *   the initial option for the field. Is meant for avoiding the initial request.
 * - isRestful (boolean): if true, will look for the initial value by performing a detail GET (with pk) rather
 *   than perfoming a list request. With the following endpoint '/my-awesome-list/', the component will look for
 *   the initial value on '/my-awesome-list/{value}/'
 * - allowUserInput: The v-select component will allow user inputted values, requires the next schema option to be set
 * - formatUserInputToModel: formats the user inputted value
 * - clearable: Specifies if the user can clear the selected property or not
 * - searchable: Enable/disable filtering the options.
 * - noDrop: Disables the dropdown
 *
 * @todo allow to pass any prop to v-select inside the schema
 */
export default {
  name: 'FieldAutocomplete',
  components: {
    vSelect,
  },
  mixins: [autocompleteMixin, irisField, abstractField],
  data() {
    return {
      internalSelectValue: {},
      multiple: false,
      noOptionsText:
        this.schema.noOptionsText || this.$t('autocomplete_no_options'),
    }
  },
  computed: {
    /**
     * If objectValue is true, returns nothing so the full object is returned
     * otherwise returns the specified valueAttribute, defaulting to id
     */
    valueAttribute() {
      return this.schema.objectValue
        ? undefined
        : this.schema.valueAttribute || 'id'
    },
    selectValue: {
      get() {
        return this.value != null && !this.isDisabled
          ? this.internalSelectValue
          : null
      },
      set(newValue, oldValue) {
        this.internalSelectValue = newValue
        this.onChange(newValue)
      },
    },
    filteredOptions() {
      return _.get(this, 'schema.filterFn')
        ? this.schema.filterFn(this.options, this.value)
        : this.options
    },
    taggable() {
      return this.schema.allowUserInput && this.schema.formatUserInputToModel
        ? this.schema.allowUserInput
        : false
    },
    alwaysOpen() {
      return _.get(this.schema, 'alwaysOpen', false)
    },
  },
  watch: {
    options() {
      if (
        Array.isArray(this.options) &&
        this.filteredOptions.length == 1 &&
        this.schema.autoselectOne
      ) {
        this.selectValue = this.options[0]
      } else if (this.options && this.selectValue != null) {
        const selected = this.options.find(value => {
          if (this.valueAttribute) {
            return value[this.valueAttribute] == this.value
          } else if (this.schema.compareFn) {
            return this.schema.compareFn(this.value, value)
          } else {
            return value == this.selectValue
          }
        })
        if (!selected && !this.multiple) {
          this.selectValue = {}
        }
        // Initial is a number, convert to option
        if (
          selected &&
          this.schema.objectValue &&
          _.isNumber(this.selectValue)
        ) {
          this.selectValue = selected
        }
      }
    },
  },
  methods: {
    /**
     * Performs the initial load of the options if needed, handling the initial value of the model.
     * Called when the component is mounted.
     */
    initialLoad() {
      if (!this.setInitialOption(this.model) && this.schema.url) {
        this.load({}, true)
        return true
      }
    },
    /**
     * On lazy case, we need to attach the current value, without loading.
     */
    initLazy() {
      this.setInitialOption(this.model)
    },
    /**
     * Performs lazy load if needed.
     */
    checkLazy() {
      if (this.lazy && (this.options.length == 0 || !this.lazyStarted)) {
        this.initialLoad()
      }
    },
    hasValue(value) {
      return value != null
    },
    /**
     * Handles the value changes of the vue-select component according to the schema config.
     */
    onChange(newValue) {
      if (
        newValue != null &&
        this.valueAttribute &&
        newValue instanceof Object
      ) {
        this.value = newValue[this.valueAttribute]
      } else {
        this.value = newValue
        // Try to load more options when selecting null
        if (
          !newValue &&
          this.options &&
          this.options.length <= 1 &&
          (!this.lazy || this.lazyStarted)
        ) {
          this.load({}, true)
        }
      }
    },
    /**
     * @returns the value from the model
     */
    getValue() {
      return this.model[this.schema.model]
    },
    /**
     * Sets the initial value of the field component base on the schema options and
     * the current value of the model instance.
     */
    setInitialOption() {
      if (this.schema.getInitialOption) {
        // The initial option can be constructed from the model itself
        const value = this.schema.getInitialOption(this.model)
        if (value) {
          this.internalSelectValue = value
          this.options = [value]
          if (!this.value) {
            this.value = value[this.valueAttribute]
          }
          return true
        }
      }
      this.selectValue = this.getValue()
      if (this.schema.url && this.selectValue != null) {
        if (this.schema.objectValue || this.schema.isRestful) {
          // Load from server
          const params = this.schema.findParams
            ? this.schema.findParams(this.getValue())
            : { id: this.getValue() }
          return this.load(params, false).then(res => {
            if (!this.schema.findParams) {
              this.internalSelectValue =
                res.data.results != null ? res.data.results[0] : res.data
            }
          })
        } else {
          this.options = [this.selectValue]
        }
      }
      return this.selectValue != null
    },
  },
}
</script>

<style>
.vue-form-generator .form-group.error.form-autocomplete .field-wrap input {
  border-color: transparent;
}

.vue-form-generator
  .form-group.error.form-autocomplete
  .field-wrap
  .v-select
  .dropdown-toggle {
  border-color: #dc3545;
}
.vue-form-generator
  .form-group.error.form-autocomplete
  .field-wrap
  .v-select
  .dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(244, 67, 54, 0.11);
}
.vue-form-generator
  .dropdown.v-select.form-autocomplete
  .dropdown-toggle::after {
  content: none;
}
.vue-form-generator
  .form-group.error.form-autocomplete
  .open-indicator::before {
  border-color: #dc3545;
}

.vue-form-generator
  .dropdown.v-select.form-autocomplete
  .autocomplete-enter-active,
.autocomplete-leave-active {
  transition: opacity 0.1s cubic-bezier(0.1, 0.1, 0.1, 0.1);
}
.vue-form-generator .dropdown.v-select.form-autocomplete .autocomplete-enter,
.autocomplete-leave-to {
  opacity: 0;
}
</style>
