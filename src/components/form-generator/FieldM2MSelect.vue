<template>
  <div
    v-if="loading"
    class="irisbox"
  >
    <div
      class="loading-overlay"
    >
      <div class="loader" />
    </div>
  </div>
  <div
    v-else
    :id="fieldId"
    class="row irisbox m-0"
  >
    <template v-if="errors.length">
      <div class="alert alert-danger w-100">{{ $t('form_load_failure') }}</div>
    </template>
    <template v-else>
      <span class="select-group">
        <p>{{ $t(schema.labelKeySelect1 || 'all_plural') }}</p>

        <div class="input-group">
          <div class="input-group-append">
            <div class="input-group-text">
              <font-awesome-icon icon="search"/>
            </div>
          </div>
          <input
            v-model="search"
            :disabled="isDisabled"
            type="text"
            class="form-control"
          >
        </div>
        <select
          v-model="markedSelectable"
          multiple
          class="form-control"
        >
          <option
            v-for="option in selectableOptions"
            :value="option.id"
            :key="option.id"
          >{{ option[optionLabelAttribute] }}</option>
        </select>
      </span>

      <div class="buttons-select-group">
        <div class="buttons">
          <span class="d-flex flex-column pb-2">
            <b-button
              :disabled="isDisabled"
              class="add-marked"
              @click="addMarked"
            >
              <font-awesome-icon icon="angle-right"/>
            </b-button>
            <b-button
              :disabled="isDisabled"
              class="add-all"
              @click="addAll"
            >
              <font-awesome-icon icon="angle-double-right"/>
            </b-button>
          </span>
          <span class="d-flex flex-column">
            <b-button
              :disabled="isDisabled"
              class="remove-marked"
              @click="removeMarked"
            >
              <font-awesome-icon icon="angle-left"/>
            </b-button>
            <b-button
              :disabled="isDisabled"
              class="remove-all"
              @click="removeAll"
            >
              <font-awesome-icon icon="angle-double-left"/>
            </b-button>
          </span>
        </div>

        <span class="select-group">
          <p>{{ $t(schema.labelKeySelect2 || 'selected') }}</p>
          <select
            v-model="markedSelected"
            multiple
            class="form-control"
          >
            <option
              v-for="option in selectedOptions"
              :value="option.id"
              :key="option.id"
            >{{ option[optionLabelAttribute] }}</option>
          </select>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import { modelFromId } from '~/assets/js/helpers'
import { get } from 'lodash'

/**
 * Component to manage M2M relations.
 *
 * Extra schema options:
 *
 * Required:
 * - allOptionsUrl: Url to load all possible options
 * - modelAttribute: Attribute to map model values from and value values to
 *    For instance we can receive from the model: [{reasign_group: 8, otherAttrs: otherValues}]
 *    and while internally we keep just the ids: [8]
 *    we must send it in the same structure to the server: [{reasign_group: 8}]
 *
 * Optional:
 * - formatModel: Function to format model to initial selected values
 * - processApiData: Function that adapts resp.data to allOptions
 * - selectedOptionsSorting: Compare function to sort the selected options
 * - formatValueToModel: Function to format the select values to the model
 * - labelKeySelect1
 * - labelKeySelect2
 * - selectedOptionsAttribute: Atribute on the model prop from which to get
 *    the currently selected options. Defaults to the model name
 * - valueAttribute: Attribute to use as value on the select. Defaults to 'id'
 * - optionLabelAttribute: The attribute to use as label on the select. Defaults to 'description'
 * - hideUntraceableOptions: If a value can't be found among all options, don't show it. Defaults to true.
 * - modelLabelAttribute: If hideUntraceableOptions is false, a made up description will be generated. If the api
 *    provides it, the value from this model's field can be used to generate said description.
 *    The element will be marked still, so to indicate that there're incongruences between the two apis's results.
 *
 * Example:
 * // Data from the model (model's selected options)
 * model: {
 *    id: 1,
 *    description: 'model_desc',
 *    input_channels: [
 *      { input_channel: 1, description: 'test' }, // 'description' may not appear, only the other attribute is needed
 *    ]
 * }
 *
 * selectedOptionsAttribute is meant to target 'input_channels'
 * modelAttribute is meant to target 'input_channel'
 * modelLabelAttribute is meant to target 'description'
 *
 * // Data from the API (api's all options)
 * resp.data = [
 *   { id: 1, description: 'test' },
 *   { id: 2, description: 'test2' },
 * ]
 *
 * valueAttribute is meant to target 'id'
 * optionLabelAttribute is meant to target 'description'
 *
 * // Value (component's currently selected options)
 * value: [
 *  { input_channel: 1 },
 * ]
 *
 * modelAttribute set the 'input_channel' key name
 * 'input_channel' value was gotten from either the model's selectedOptionsAttribute's modelAttribute's value
 * or from the select's array of values that were added by addMarked or addAll
 */
export default {
  extends: abstractField,
  data() {
    return {
      loading: true,
      valueAttribute: this.schema.valueAttribute || 'id',
      optionLabelAttribute: this.schema.optionLabelAttribute || 'description',
      hideUntraceableOptions: this.schema.hideUntraceableOptions || true,
      allOptions: [],
      selectedIds: [],
      search: null,
      markedSelectable: [],
      markedSelected: [],
    }
  },
  computed: {
    selectedOptionsAttribute() {
      return get(this, 'schema.selectedOptionsAttribute', this.schema.model)
    },
    selectedOptions() {
      const selectedOptions = this.selectedIds
        .map(id => this.getModelFromId(id))
        .filter(element => element != null)

      if (this.schema.selectedOptionsSorting) {
        selectedOptions.sort(this.schema.selectedOptionsSorting)
      }
      return selectedOptions
    },
    selectableOptions() {
      let selectableOptions = this.allOptions.filter(
        option => !this.selectedIds.includes(option[this.valueAttribute])
      )
      if (this.schema.selectedOptionsSorting) {
        selectableOptions.sort(this.schema.selectedOptionsSorting)
      }
      if (this.search) {
        const lowerSearch = this.search.toLowerCase()
        selectableOptions = selectableOptions.filter(option =>
          option[this.optionLabelAttribute].toLowerCase().includes(lowerSearch)
        )
      }
      return selectableOptions
    },
    isDisabled() {
      return this.disabled
    },
    fieldId() {
      return this.schema.model ? `field-m2m-${this.schema.model}` : null
    },
  },
  watch: {
    selectedIds() {
      this.updateValue()
    },
  },
  created() {
    this.loadAllOptions().then(() => {
      this.loading = false
    })
  },
  mounted() {
    this.selectedIds = this.getInternalValueFromModel()
    this.updateValue()
  },
  methods: {
    getInternalValueFromModel() {
      if (this.value) {
        return this.formatModel(this.model[this.selectedOptionsAttribute])
      }
      return []
    },
    /**
     * Adapts the values from the model to the selectedIds list
     * @example
     *
     * const model = [{reasign_group: 8}]
     * this.formatModel(model)
     * // => [8]
     */
    formatModel(model) {
      return this.schema.formatModel
        ? this.schema.formatModel(model)
        : model.map(option => option[this.schema.modelAttribute])
    },
    /**
     * Called each time this.value is going to change to adapt the select value to the desired structure on the model
     */
    formatValueToModel(value) {
      return get(this, 'schema.formatValueToModel')
        ? this.schema.formatValueToModel(value)
        : Array.isArray(value)
          ? value.map(id => ({ [this.schema.modelAttribute]: id }))
          : value
    },
    /**
     * Given an id returns either a match from the allOptions api result, or a generated one.
     */
    getModelFromId(id) {
      return this.hideUntraceableOptions
        ? modelFromId(id, this.allOptions)
        : modelFromId(id, this.allOptions) || this.generateModelFromId(id)
    },
    generateModelFromId(id) {
      return {
        id: id,
        [this.optionLabelAttribute]: this.getUntraceableDescription(id),
      }
    },
    getUntraceableDescription(id) {
      if (this.schema.modelLabelAttribute) {
        return `- ${this.$t('untraceable_item')} ${this.getDescriptionFromModel(
          id
        )}(${id}) -`
      } else {
        return `- ${this.$t('untraceable_item')} (${id}) -`
      }
    },
    getDescriptionFromModel(id) {
      const originalModelMatch = this.model[this.selectedOptionsAttribute]
        ? this.model[this.selectedOptionsAttribute].find(
            model => model[this.schema.modelAttribute] === id
          )
        : undefined

      const originalModelMatchLabel =
        originalModelMatch &&
        originalModelMatch[this.schema.modelLabelAttribute]
          ? originalModelMatch[this.schema.modelLabelAttribute]
          : ''

      return originalModelMatchLabel ? `(${originalModelMatchLabel}) ` : ''
    },
    updateValue() {
      this.value = this.selectedIds
    },
    loadAllOptions() {
      return this.$axios
        .get(this.schema.allOptionsUrl)
        .then(resp => {
          this.allOptions = this.processApiData(resp.data)
        })
        .catch(error => {
          this.errors.push(this.schema.allOptionsUrl)
        })
    },
    processApiData(data) {
      return this.schema.processApiData
        ? this.schema.processApiData(data)
        : Array.isArray(data)
          ? data // Not paginated
          : data.results // Paginated
    },
    addMarked() {
      this.markedSelectable.forEach(markedId => {
        if (
          this.selectedIds.findIndex(selectedId => selectedId === markedId) ===
          -1
        ) {
          this.selectedIds.push(markedId)
        }
      })
    },
    addAll() {
      const selectableIds = this.selectableOptions.map(
        option => option[this.valueAttribute]
      )
      this.selectedIds.push(...selectableIds)
    },
    removeMarked() {
      this.selectedIds = this.selectedIds.filter(
        id => !this.markedSelected.includes(id)
      )
    },
    removeAll() {
      this.selectedIds = []
    },
  },
}
</script>

<style lang="scss" scoped>
.irisbox {
  min-height: 210px;
  padding: 1.5em;
}

.select-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 1em;
  input {
    border-radius: unset;
  }
  select {
    min-height: 300px;
    flex-grow: 1;
    border-radius: unset;
  }
}
.buttons-select-group {
  display: flex;
  flex-grow: 1;
  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2em 1em 0;
    button:not(:last-of-type) {
      margin-bottom: 2px;
    }
  }
}
</style>
