<template>
  <span>
    <v-select
      v-model="internalModel.value"
      :label="internalSchema.selectOptions.name"
      :placeholder="schema.placeholder"
      :options="options"
      :filter-by="filterByFn"
      :reset-on-options-change="resetOptChange"
      :always-open="alwaysOpen"
      transition="autocomplete"
      @input="modelUpdated"
    >
      <template slot="no-options">{{ $t('autocomplete_no_options') }}</template>
    </v-select>
  </span>
</template>

<script>
import VuexSelect from './VuexSelect.vue'
import vSelect from '~/components/form-generator/IrisVueSelect'
import { iUnaccentContains } from '~/assets/js/utils/string/trimAccents.js'
import _ from 'lodash'

/**
 * VuexSelect extended with autocomplete functionality with v-select.
 */
export default {
  name: 'FieldAutocompleteVuexSelect',
  components: {
    vSelect,
  },
  extends: VuexSelect,
  props: {
    resetOnOptionsChange: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    resetOptChange() {
      return _.get(
        this.schema,
        'resetOnOptionsChange',
        this.resetOnOptionsChange
      )
    },
    valueAttr() {
      return this.schema.valueAttribute || 'id'
    },
    attrValue() {
      return _.get(this.internalModel.value, this.valueAttr, null)
    },
    filterByFn() {
      if (this.schema.filterByFn) {
        return this.schema.filterByFn
      }
      return function filterUnaccent(option, label, search) {
        return iUnaccentContains(label, search)
      }
    },
    alwaysOpen() {
      return _.get(this.schema, 'alwaysOpen', false)
    },
  },
  mounted() {
    if (this.value && !this.refreshOnMount) {
      this.setValue(false)
    }
  },
  methods: {
    /**
     * Clears the value
     */
    clearValue() {
      this.internalModel.value = null
    },
    modelUpdated(newValue) {
      if (this.loaded) {
        if (this.internalModel.value != null) {
          this.value = this.schema.objectValue
            ? this.internalModel.value
            : this.internalModel.value[this.valueAttr]
        } else {
          this.value = null
        }
        this.$emit('model-updated', newValue)
      }
    },
    setInitialValue() {
      this.value = this.schema.getInitialOption
        ? this.schema.getInitialOption(this.model)
        : this.value
      if (!this.objectValue) {
        this.setValue()
      }
    },
    setValue(modelUpdate = true) {
      if (this.readonly) {
        this.internalModel.value = this.value
      }
      if (this.value) {
        const val = this.schema.objectValue
          ? this.value[this.valueAttr]
          : this.value
        const values = this.options.filter(option => {
          return option[this.valueAttr] == val
        })
        if (values.length > 0) {
          this.internalModel.value = values[0]
          if (modelUpdate) {
            this.modelUpdated(this.internalModel.value)
          }
        }
      } else {
        this.clearValue()
      }
    },
  },
}
</script>

<style>
.vue-form-generator
  .form-group.error.field-autocomplete-vuex-select
  .field-wrap
  input {
  border-color: transparent;
}
.vue-form-generator
  .form-group.error.field-autocomplete-vuex-select
  .field-wrap
  .v-select
  .dropdown-toggle {
  border-color: #dc3545;
}
.vue-form-generator
  .form-group.error.field-autocomplete-vuex-select
  .field-wrap
  .v-select
  .dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(244, 67, 54, 0.11);
}
.vue-form-generator
  .form-group.field-autocomplete-vuex-select
  .dropdown-toggle::after {
  content: none;
}
.vue-form-generator
  .form-group.error.field-autocomplete-vuex-select
  .open-indicator::before {
  border-color: #dc3545;
}

.vue-form-generator
  .form-group.field-autocomplete-vuex-select
  .autocomplete-enter-active,
.autocomplete-leave-active {
  transition: opacity 0.1s cubic-bezier(0.1, 0.1, 0.1, 0.1);
}
.vue-form-generator
  .form-group.field-autocomplete-vuex-select
  .autocomplete-enter,
.autocomplete-leave-to {
  opacity: 0;
}
</style>
