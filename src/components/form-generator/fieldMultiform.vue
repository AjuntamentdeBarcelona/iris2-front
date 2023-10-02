<template>
  <table
    v-if="forms.length > 0 || allowAdd"
    class="table table-striped table-sm">
    <thead>
      <tr v-if="fixedSchema">
        <th
          v-for="field in fixedSchema.fields"
          :key="field.model">
          {{ field.label }}
        </th>
        <th v-show="allowAdd" />
      </tr>
    </thead>
    <component
      :is="draggableTag"
      :value="forms"
      :class="{'drag': orderBy}"
      tag="tbody"
      @change="orderChanged">
      <form-generator
        v-for="(item, idx) in forms"
        ref="generatedForms"
        :key="item.uid"
        :model="item.model"
        :schema="item.schema"
        :options="item.options"
        :external-errors="item.errors"
        @model-updated="onItemUpdated"
        @validated="onItemFormValidated">
        <template slot="before-form">
          <td v-if="!fixedSchema">{{ item.label }}</td>
        </template>
        <template slot="after-form">
          <td v-if="allowAdd">
            <b-button
              @click="deleteItem(item, idx)"
            >
              <font-awesome-icon icon="trash" />
            </b-button>
          </td>
        </template>
      </form-generator>
    </component>
    <tr v-if="allowAdd">
      <td>
        <b-button
          @click="addInlineItem"
        >
          <font-awesome-icon icon="plus" />
          {{ $t('add') }}
        </b-button>
      </td>
    </tr>
  </table>
</template>

<script>
import { abstractField } from 'vue-form-generator'
import draggable from 'vuedraggable'
import irisField from './irisField.js'
import multiformFieldMixin from './multiformFieldMixin.js'
import IrisFormGenerator from '~/components/pages/form/irisTableFormGenerator.vue'
import _ from 'lodash'

/**
 * Field for editing many forms inline in a table.
 * The forms can have different schemas, but each of them edit a different
 * model instance.
 */
export default {
  name: 'FieldMultiForm',
  components: {
    'form-generator': IrisFormGenerator,
    draggable,
  },
  mixins: [abstractField, multiformFieldMixin],
  computed: {
    draggable() {
      return _.get(this.schema, 'draggable', true)
    },
    draggableTag() {
      return this.draggable ? 'draggable' : 'tbody'
    },
  },
}
</script>
