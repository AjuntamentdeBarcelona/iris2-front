<template>
  <div class="row no-gutters input-group">
    <div
      :class="{ required : schema.required }"
      class="col-6 pr-0 input-group-append">
      <field-select
        ref="select"
        :vfg="vfg"
        v-model="selectModel.value"
        :model="selectModel"
        :schema="selectSchema"
        :required="schema.required"
        :disabled="schema.disabled"
        @model-updated="selectModelUpdated"/>
    </div>
    <field-input
      ref="input"
      :vfg="vfg"
      v-model="inputModel.value"
      :model="inputModel"
      :schema="inputSchema"
      :required="schema.required"
      :disabled="inputDisabled"
      class="col-6 pl-0 input-group-append"
      @model-updated="inputModelUpdated"/>
  </div>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import irisField from '../irisField'
import { abstractField } from 'vue-form-generator'
import { isValidNif } from '~/assets/js/helpers'
import Ca from '~/lang/ca'
import Applicant from '~/assets/js/iris2/model/Applicant.js'

export default {
  components: {
    'field-select':
      VueFormGenerator.component.components.formGroup.components.fieldSelect,
    'field-input':
      VueFormGenerator.component.components.formGroup.components.fieldInput,
  },
  mixins: [irisField, abstractField],
  data() {
    const idCardLabel = this.$t('id_card').toLowerCase()
    return {
      selectModel: { value: this.model ? this.model.doc_type : null },
      selectSchema: {
        type: 'select',
        values: [
          { id: Applicant.NIF, name: this.$t('nif') },
          { id: Applicant.NIE, name: this.$t('nie') },
          { id: Applicant.PASS, name: this.$t('passport') },
        ],
        selectOptions: {
          noneSelectedText: this.$t('record_card_select_id_type'),
        },
        id: 'id_type',
        model: 'value',
        label: this.$t('id_type'),
        styleClasses: 'col-6 col-md-4',
      },

      inputDisabled: true,
      inputModel: { value: this.model.dni },
      inputSchema: {
        type: 'input',
        inputType: 'text',
        maxlength: 15,
        min: 9,
        id: 'dni',
        label: this.$t('identity_card'),
        model: 'value',
        disabled: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string.locale(),
      },
    }
  },
  methods: {
    selectModelUpdated() {
      if (this.selectModel.value != null) {
        this.inputDisabled = false
        this.$nextTick(() => {
          if (this.$refs.input) {
            this.$refs.input.$el.firstElementChild.focus()
          }
        })
      } else {
        this.inputDisabled = true
        this.inputModel.value = undefined
        this.$emit('validated', true, [], this)
      }
      this.model.doc_type = this.selectModel.value
      this.updateValue()
      this.validate()
    },
    inputModelUpdated() {
      this.updateValue()
      this.validate()
    },
    updateValue() {
      this.value = this.inputModel.value
    },
    validate() {
      if (
        this.inputModel.value &&
        (this.selectModel.value == Applicant.NIF ||
          this.selectModel.value == Applicant.NIE) &&
        !isValidNif(this.inputModel.value.toUpperCase())
      ) {
        this.$emit(
          'validated',
          false,
          [this.$t('create_applicant_invalid_id')],
          this
        )
      } else {
        this.$emit('validated', true, [], this)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.input-group-append {
  /deep/ select {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  /deep/ input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
