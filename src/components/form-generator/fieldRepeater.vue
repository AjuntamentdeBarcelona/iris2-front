<template>
  <div class="repeater">
    <div
      v-for="(s_model, index) in internalModel.values"
      :key="index"
    >
      <field-input
        :model="s_model"
        :schema="schema"
        @model-updated="modelUpdated"
      />
      <button
        class="btn btn-light"
        @click="removeInput(index, $event)"
      ><i class="fas fa-trash-alt" /></button>
    </div>
    <button
      class="btn btn-primary"
      @click="addInput"
    ><i class="fas fa-plus" /></button>
  </div>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'

export default {
  name: 'FieldRepeater',
  components: {
    'field-input':
      VueFormGenerator.component.components.formGroup.components.fieldInput,
  },
  mixins: [irisField, abstractField],
  data: function() {
    return {
      internalModel: {
        values: this.value,
      },
    }
  },
  watch: {
    value() {
      this.internalModel.values = this.value
    },
  },
  mounted() {
    this.internalModel.values = this.value
  },
  methods: {
    addInput() {
      this.internalModel.values.push({
        id: '',
      })
    },
    removeInput: function(index, event) {
      this.internalModel.values.splice(index, 1)
    },
    modelUpdated() {
      this.value = this.internalModel.values
    },
  },
}
</script>

<style scoped>
.repeater {
  width: 100%;
}
.repeater > div {
  display: flex;
  margin-bottom: 5px;
}

.repeater .wrapper {
  width: 100%;
}

.repeater > .btn-primary {
  margin-left: 0;
}
</style>
