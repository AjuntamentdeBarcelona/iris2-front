<template>
  <field-select
    ref="select"
    :model="internalModel"
    :schema="internalSchema"
    :disabled="schema.disabled"
    @focus.native="checkLazy"
    @model-updated="modelUpdated"
  />
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import irisField from '../irisField.js'
import { abstractField } from 'vue-form-generator'
import { mapState, mapActions } from 'vuex'

/**
 * Select field which options proceed from the Vuex storage. The component is meant to work
 * with async store loading through actions.
 *
 * The schema must define at least:
 * - storeModule (default: 'index'): Vuex module
 * - storeAction: action of the previous module to perform on load
 * - storeAttribute: attribute of the state where the data is placed
 * - filterFn: extra filtering for options.
 * - optionLabelAttribute (default: 'description'): attribute for getting the Option label
 * - valueAttribute (default: 'id'): attribute for getting the Option value
 * - objectValue (default: false): valueAttribute is still used for selection purposes, but the full object is set as value of the field
 *   valueAttribute must be explicitally set, and not rely on the default, so we can read it from the schema on outside components
 */
export default {
  name: 'FieldVuexSelect',
  components: {
    'field-select':
      VueFormGenerator.component.components.formGroup.components.fieldSelect,
  },
  mixins: [irisField, abstractField],
  data: function() {
    return {
      options: [],
      lastReadonly: this.schema.readonly,
      storeGetter: this.schema.storeGetter,
      storeModuleName: this.schema.storeModule,
      storeModule: this.schema.storeModule
        ? this.$store.state[this.schema.storeModule]
        : this.$store.state,
      storeAttribute: this.schema.storeAttribute,
      activeChannelsToggles: [],
      loaded: false,
      internalModel: { value: this.value },
      noneSelectedText: this.$t('form_select_none_selected'),
      internalSchema: {
        values: [],
        selectOptions: {
          name: this.schema.optionLabelAttribute || 'description',
          value: this.schema.valueAttribute || 'id',
          noneSelectedText: this.$t('form_select_none_selected'),
        },
      },
    }
  },
  computed: {
    readonly() {
      return this.schema.readonly
    },
    lazy() {
      return !!this.schema.lazy
    },
    storeOptions() {
      if (this.storeGetter) {
        return this.$store.getters[
          `${this.storeModuleName}/${this.storeGetter}`
        ]
      } else {
        return this.storeModule[this.storeAttribute]
      }
    },
    refreshOnMount() {
      const refresh = this.schema.refreshOnMount
        ? this.schema.refreshOnMount
        : true
      return refresh && this.schema.storeAction
    },
    filterFn() {
      return this.schema.filterFn
    },
  },
  watch: {
    /**
     * Component allows to sync readonly attribute on schema.
     * Since this affects to options, it must be tracked for avoiding unnecessary model updates.
     */
    readonly() {
      if (this.readonly != this.lastReadonly) {
        this.setSchema()
        this.lastReadonly = this.readonly
      }
    },
    /**
     * Each time store options change, they must attached to the undeliying select component.
     */
    storeOptions: {
      handler() {
        this.setSchema()
        this.$nextTick(() => {
          // If not loaded, and we have a value, we need to set it
          if (!this.loaded && (!this.lazy || this.value)) {
            this.loaded = true
            this.setInitialValue()
          } else {
            this.setValue()
          }
        })
      },
      immediate: true,
    },
    /**
     * Sync external value.
     */
    value() {
      if (this.value != this.internalModel.value) {
        if (this.readonly) {
          this.setSchema()
        }
        this.setValue()
      }
    },
  },
  mounted() {
    // Load Options
    if (this.refreshOnMount) {
      if (!this.lazy || this.value) {
        this.initialLoad()
      }
    } else {
      this.loaded = false
    }
  },
  methods: {
    initialLoad() {
      return this.load().then(() => {
        // Enable toggles
        this.loaded = true
        this.setSchema()
      })
    },
    checkLazy() {
      if (this.lazy && !this.loaded) {
        this.initialLoad().then(() => {
          this.$nextTick(() => {
            this.$refs.select.$el.click()
            this.$refs.select.$el.click()
          })
        })
      }
    },
    modelUpdated() {
      if (this.loaded) {
        if (this.schema.objectValue) {
          this.value = this.getObjectValue(this.internalModel.value)
        } else {
          this.value = this.internalModel.value
        }
      }
    },
    load() {
      if (this.schema.storeAction) {
        return this.$store.dispatch(
          `${this.storeModuleName}/${this.schema.storeAction}`
        )
      }
    },
    setValue() {
      if (this.schema.objectValue) {
        this.internalModel.value = this.value
          ? this.getValue(this.value)
          : this.value
      } else {
        this.internalModel.value = this.value
      }
    },
    setSchema() {
      this.options = this.getOptions()
      this.internalSchema = {
        model: 'value',
        values: this.readonly ? [this.value] : this.options,
        selectOptions: {
          name: this.schema.optionLabelAttribute || 'description',
          value: this.schema.valueAttribute || 'id',
          noneSelectedText: this.noneSelectedText,
        },
      }
    },
    getOptions() {
      if (this.readonly) {
        return [this.value]
      } else if (this.filterFn) {
        return this.filterFn(this.storeOptions)
      }
      return this.storeOptions || []
    },
    /**
     * Identifies the (unique) value from the store from the selected one and returns the object
     */
    getObjectValue() {
      for (const object of this.options) {
        if (
          object[this.internalSchema.selectOptions.value] ===
          this.internalModel.value
        ) {
          return object
        }
      }
    },
    setInitialValue() {
      this.value = this.schema.getInitialOption
        ? this.schema.getInitialOption(this.model)
        : this.value
    },
    /**
     * Gets the valueAttribute of the given object
     */
    getValue(object) {
      return object[this.internalSchema.selectOptions.value]
    },
  },
}
</script>

<style>
</style>
