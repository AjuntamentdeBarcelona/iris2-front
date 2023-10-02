<!-- fieldAwesome.vue -->
<template>
  <div class="field-select-list row">
    <div class="col-12 col-lg-4 mb-2">
      <legend>{{ schema.selectLabel }}</legend>
      <v-select
        v-model="selectValue"
        :label="schema.labelField"
        :placeholder="schema.placeholder"
        :options="selectOptions"
        :reset-on-options-change="true"
        type="text"
        @change="addSelected"
        @search="selectOnSearch"
      />
    </div>
    <div :class="formContainerClasses">
      <legend>{{ schema.tableLabel }}</legend>
      <slot name="selectedForms">
        <table
          v-if="selected.length > 0"
          class="table table-striped table-sm">
          <thead v-if="fixedSchema">
            <th/>
            <th
              v-for="field in fixedSchema.fields"
              :key="field.model">
              {{ field.label }}
            </th>
            <th v-show="orderBy"/>
            <th/>
          </thead>
          <tbody>
            <component
              v-for="(item, index) in forms"
              :is="formComponent"
              :key="item.uid"
              :model="item.model"
              :schema="item.schema"
              :options="item.options"
              :external-errors="item.errors"
              @model-updated="onItemUpdated"
              @validated="onItemFormValidated">
              <template slot="before-form">
                <td class="py-2">{{ item.label }}</td>
              </template>
              <template slot="after-form">
                <td v-if="orderBy">
                  <b-button
                    v-show="index > 0"
                    variant="outline-primary"
                    @click="swapPosition(index, -1)">
                    <font-awesome-icon icon="arrow-up" />
                  </b-button>
                  <b-button
                    v-show="index < lastSelectedIndex"
                    variant="outline-primary"
                    @click="swapPosition(index, +1)">
                    <font-awesome-icon icon="arrow-down" />
                  </b-button>
                </td>
                <td>
                  <b-button
                    variant="outline-danger"
                    class="field-select-list__btn float-right btn-sm"
                    @click="removeSelected(item.model)"
                  >
                    <font-awesome-icon icon="trash" />
                  </b-button>
                </td>
              </template>
            </component>
          </tbody>
        </table>
        <div
          v-if="selected.length == 0"
          class="alert alert-info">
          {{ $t('select_list_empty') }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import autocompleteMixin from './autocompleteMixin.js'
import multiformFieldMixin from './multiformFieldMixin.js'
import vSelect from 'vue-select'
import IrisFormGenerator from '~/components/pages/form/irisTableFormGenerator.vue'

var _ = require('lodash')

/**
 * This field allows to select n items from a list and edit some information for each one.
 * Each item is edited using a form-schema, and the value of the field is considered valid
 * when all the item forms are valid.
 *
 * @todo validation error
 */
export default {
  name: 'FieldSelectList',
  components: {
    'v-select': vSelect,
    'form-generator': IrisFormGenerator,
  },
  mixins: [autocompleteMixin, multiformFieldMixin, abstractField],
  data() {
    return {
      selected: this.value || [],
      itemErrors: {},
    }
  },
  computed: {
    formContainerClasses() {
      return 'col-12 col-lg-8'
    },
    lastSelectedIndex() {
      return this.selected.length - 1
    },
    selectedUids() {
      return this.selected.map(item => this.getItemInlineUid(item))
    },
    selectOptions() {
      return this.options.filter(item => !this.isSelected(item))
    },
    selectValue: {
      get() {
        return null
      },
      set(value) {
        if (value) {
          this.addSelected(value)
        }
      },
    },
    items() {
      return this.selected
    },
    /**
     * Each option must have uniqueField that acts as uid
     */
    uniqueField() {
      return this.initialSchema.uniqueField || 'id'
    },
  },
  watch: {
    value() {
      if (this.schema.sync) {
        this.selected = this.value || []
      }
    },
    schema() {
      this.validateRequired()
    },
  },
  mounted() {
    this.adjustIndexes()
  },
  methods: {
    /**
     * Adds a selected item to the list.
     */
    addSelected(item) {
      if (!item) {
        return
      }
      const uid = this.getItemUid(item)
      if (uid == null) {
        throw Error(
          'Found item without a valid unique field, please check the uniqueField option of the schema.'
        )
      }
      if (this.isSelected(item)) {
        return
      }
      this.selected.push(this.createInlineItem(item, uid))
      this.sortSelected()
      this.setValue()
    },
    /**
     * Given an item from the options list, creates an editable inline model.
     * The inline model can have a different attribute for the uid, this way we allow
     * to have different ids for them.
     *
     * Example: Selecting toppings for a recipe, giving them a quantity editable inline.
     * - Given a list toppings as options [{id: 1, name: "basil"}]
     * - We select basil
     * - The inline item (a recipe ingredient) can have this form: {id: 11, name: "basil", quantity: 1, unit: 'gr'}
     *
     * This way, the selector allows to select the ingredients but with an inline edition that gives context to that selection.
     */
    createInlineItem(item, uid) {
      let inlineItem = Object.assign({}, item)
      delete inlineItem[this.uniqueField]
      inlineItem[this.inlineIdName] = uid
      if (this.orderBy) {
        inlineItem[this.orderBy] = this.currentOrder + 1
      }
      return inlineItem
    },
    /**
     * This class not allows multichema, only fixed.
     * @param {*} inlineItem
     */
    getSchemaForItem(inlineItem) {
      if (this.initialSchema.multischema) {
        throw Error('selectList field does not allow multischema configs.')
      }
      return this.initialSchema.itemFormDef
    },
    isSelected(item) {
      return this.selectedUids.indexOf(this.getItemUid(item)) >= 0
    },
    removeSelected(inlineItem) {
      const uid = this.getItemInlineUid(inlineItem)
      this.selected = this.selected.filter(
        otherItem => this.getItemInlineUid(otherItem) != uid
      )
      this.setValue()
    },
    setValue() {
      this.value = this.selected
      this.validateRequired()
      this.setForms()
    },
    validateRequired() {
      if (
        this.initialSchema.required &&
        (!this.value || this.value.length == 0)
      ) {
        this.$emit('validated', false, [this.$t('required')], this)
      }
    },
    getItemUid(item) {
      return item[this.uniqueField]
    },
    getInlineItems() {
      return this.selected
    },
  },
}
</script>

<style>
.vue-form-generator .form-group.field-select-list .dropdown-toggle::after {
  content: none;
}
.vue-form-generator .form-group.field-select-list .form-group.error .errors {
  position: static;
}
</style>
