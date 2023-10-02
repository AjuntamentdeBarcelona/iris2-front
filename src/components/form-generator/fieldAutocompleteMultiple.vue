<template>
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
    :input-id="schema.model"
    :infinite-scroll-active="infiniteScroll"
    transition="autocomplete"
    type="text"
    class="form-autocomplete"
    @search="selectOnSearch"
    @search:focus="checkLazy"
    @infinite-scroll="loadNextPage"
  >
    <template slot="no-options">{{ $t('autocomplete_no_options') }}</template>
  </v-select>
  <v-select
    v-else
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
    :input-id="schema.model"
    :infinite-scroll-active="infiniteScroll"
    transition="autocomplete"
    type="text"
    class="form-autocomplete"
    @search:focus="checkLazy"
    @infinite-scroll="loadNextPage"
  >
    <template slot="no-options">{{ $t('autocomplete_no_options') }}</template>
  </v-select>
</template>

<script>
import FieldAutocomplete from '~/components/form-generator/fieldAutocomplete'
import { isPlainObject } from '~/assets/js/helpers'
import _ from 'lodash'

/**
 * Extra schema options:
 * - excludeSelectedValuesByField: Selected values are filtered out of the available options based on this field
 */
export default {
  extends: FieldAutocomplete,
  data() {
    return {
      internalSelectValue: [],
      multiple: true,
    }
  },
  computed: {
    filteredOptions() {
      let filteredOptions = _.get(this, 'schema.filterFn')
        ? this.schema.filterFn(this.options, this.value)
        : this.options

      const excludeField = _.get(this, 'schema.excludeSelectedValuesByField')
      if (excludeField && this.value) {
        if (_.get(this, 'schema.objectValue')) {
          const flattenedSelectValue = this.value.map(
            value => value[excludeField]
          )

          filteredOptions = filteredOptions.filter(
            option => !flattenedSelectValue.includes(option[excludeField])
          )
        } else {
          filteredOptions = filteredOptions.filter(
            option => !this.value.includes(option[excludeField])
          )
        }
      }

      return filteredOptions
    },
  },
  methods: {
    hasValue(value) {
      return value != null && Array.isArray(value) && value.length > 0
    },
    /**
     * Handles the value changes of the vue-select component according to the schema config.
     */
    onChange(newValue) {
      if (newValue && this.valueAttribute) {
        if (isPlainObject(newValue)) {
          this.value = newValue[this.valueAttribute]
        } else if (Array.isArray(newValue)) {
          this.value = newValue.map(obj => obj[this.valueAttribute])
        }
      } else {
        this.value = newValue
        // Try to load more options when selecting null
        if (!newValue && this.options && this.options.length <= 1) {
          this.load({}, true)
        }
      }
    },
    /**
     * Overriden as there's currently no implementation to get initial data for multiple values from the server
     */
    setInitialOption() {
      if (this.schema.getInitialOption) {
        // The initial option can be construct from the model itself
        const value = this.schema.getInitialOption(this.model)
        if (value) {
          this.internalSelectValue = value
          if (!this.schema.options) {
            this.options = _.isArray(value) ? value : [value]
          }
          if (!this.value) {
            this.value = value[this.schema.valueAttribute]
          }
          return false
        }
      }
    },
  },
}
</script>
