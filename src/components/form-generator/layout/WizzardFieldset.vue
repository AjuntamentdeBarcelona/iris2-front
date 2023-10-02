<template lang="pug">
  fieldset(:is='fieldsetTag', :class='getFieldsetRowClasses(group)')
    div(v-if="selected" :class="{row: !selected.customLayout, 'next-step': selectedIndex > 0}")
      div.col-12(v-if='selected.legend')
          legend(v-if='selected.legend') {{ selected.legend }}
      component(v-for="step in steps" :is="step.component || 'form-fieldset'", :key="step.title" :group="step", :vfg="vfg"
                :errors="errors", :model="internalModel", :options="options", :active="selected == step",
                :class="{wizardSelected: selected == step}", class="wizardStep"
                @validated="selected == step ? onFieldValidated(step, arguments) : emitValidated(step, arguments)",
                @model-updated="step == selected ? onModelUpdated(step, arguments) : emitUpdated(step, arguments)")
      div.w-100.mb-4.d-flex.mx-2
        button(class="btn btn-outline-dark ml-2 mr-4 w-50" v-if="selectedIndex > 0" @click="backStep")
          font-awesome-icon(icon="chevron-left")
          span.mx-1.text-uppercase {{ $t('back') }}
        button(v-if="!isLast" :disabled="!isValid || !checkValue()" class="btn btn-secondary ml-auto mr-2 w-50" @click="nextStep").text-uppercase {{ $t('wizard_next_step') }}
        button(v-if="isLast" :disabled="!isValid || !checkValue()" class="btn btn-secondary ml-auto mr-2 w-50" @click="submit").text-uppercase {{ $t('form_save') }}
      breadcrumb(:active="selectedIndex + 1" :max="max" :title="steps[selectedIndex].title"  :class="{'mb-0': selectedIndex < 1}" :errors="breadcrumbErrors")
</template>

<script>
import FormFieldset from '~/components/form-generator/layout/FormFieldset.vue'
import breadcrumb from '~/components/mobile/breadcrumb.vue'
import _ from 'lodash'

export default {
  name: 'WizzardFieldset',
  components: {
    FormFieldset,
    breadcrumb,
  },
  extends: FormFieldset,
  data() {
    return {
      selected: null,
      selectedIndex: -1,
      validatedTimes: 0,
      updatedTimes: 0,
      valid: false,
      value: false,
      transition: false,
      maxStepReached: 0,
      groupErrors: {},
    }
  },
  computed: {
    /**
     * @returns {Object[]} Wizard step, each step is a common IrisFormGenerator group with special props.
     */
    steps() {
      return _.get(this.group, 'groups', [])
    },
    /**
     * @returns {Boolean} True if the next step should be triggered when the current is valid.
     */
    autonext() {
      if (this.checkFastForward(this.selected)) {
        return _.get(this.selected, 'autonext', true)
      }
      return false
    },
    /**
     * @returns {Boolean} True if the step is revisited backwards
     */
    backstep() {
      return this.maxStepReached > this.selectedIndex
    },
    /**
     * @returns {Array} Fields that must be filled for considering the current step valid.
     */
    nextRequired() {
      return this.selected ? this.getStepRequired(this.selected) : []
    },
    /**
     * @returns {Boolean} If true, the step will forward when the field emits the positive validated event.
     */
    nextOnValidated() {
      return _.get(this.selected, 'nextOnValidated', false)
    },
    /**
     * @returns {Number} Last step index.
     */
    max() {
      return this.steps.length
    },
    eagerSteps() {
      return this.steps.filter(step => !_.get(step, 'lazy', true))
    },
    isLast() {
      return this.selectedIndex == this.steps.length - 1
    },
    isValid() {
      return !this.groupErrors[this.selected.uid]
    },
    breadcrumbErrors() {
      return this.steps.map(
        (step, idx) =>
          !!this.groupErrors[step.uid] && idx <= this.maxStepReached
      )
    },
  },
  created() {
    this.nextStep(true)
  },
  methods: {
    start() {
      this.selectedIndex = -1
      this.nextStep()
    },
    emitValidated(step, [isValid, errors, vm]) {
      if (step.fields[0].model == vm.schema.model) {
        this.groupErrors = {
          ...this.groupErrors,
          [step.uid]: !isValid,
        }
      }
      this.$emit('validated', [isValid, errors, vm])
    },
    emitUpdated(step, [newVal, schema]) {
      this.$emit('model-updated', newVal, schema)
    },
    onFieldValidated(step, [isValid, errors, vm]) {
      this.valid = isValid
      this.emitValidated(step, [isValid, errors, vm])
      if (isValid && !this.transition) {
        if (this.autonext) {
          this.transition = true
          this.$nextTick(() => {
            this.nextStep(this.nextOnValidated)
            this.transition = false
          })
        }
        this.validatedTimes++
      }
    },
    onModelUpdated(step, [newVal, schema]) {
      this.value = true
      this.emitUpdated(step, [newVal, schema])
      this.updatedTimes++
    },
    backStep() {
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
      this.selected = this.steps[this.selectedIndex]
    },
    nextStep(force = false) {
      if (this.selected && this.selected.checkValue) {
        force = this.selected.checkValue(
          this.internalModel,
          !this.groupErrors[this.selected.uid]
        )
        if (!force) {
          return
        }
      }
      if (force || this.checkStepRequired(this.nextRequired)) {
        if (this.selectedIndex + 1 < this.max) {
          this.valid = false
          this.value = false
          this.validatedTimes = 0
          this.updatedTimes = 0
          this.selectedIndex++
          this.selected = this.steps[this.selectedIndex]
          this.maxStepReached = Math.max(
            this.maxStepReached,
            this.selectedIndex
          )
          if (
            this.selected.checkValue &&
            this.selectedIndex == this.maxStepReached
          ) {
            this.nextStep(false)
          }
        }
      }
    },
    checkStepRequired(required) {
      for (const field of required) {
        if (this.model[field] == null) {
          return false
        }
      }
      return true
    },
    checkValue() {
      return (
        !this.selected.checkValue ||
        this.selected.checkValue(
          this.internalModel,
          !this.groupErrors[this.selected.uid]
        )
      )
    },
    getStepRequired(step) {
      return (
        step.nextRequired || _.get(step, 'fields', []).map(field => field.model)
      )
    },
    allValid() {
      for (const step of this.steps) {
        if (!this.checkStepRequired(step)) {
          return false
        }
      }
      return true
    },
    /**
     * @return {Boolean} True if the step allows to
     */
    checkFastForward(step) {
      if (!step.fastForward) {
        return true
      }
      return step.fastForward()
    },
    /**
     * Starts the form saving by calling it on the parent form.
     */
    submit() {
      this.vfg.$emit('submit')
    },
  },
}
</script>

<style lang="scss" scoped>
.md-breadcrumb {
  position: absolute;
  bottom: 0;
}
.wizardStep {
  padding: 2rem;
  min-height: calc(100vh - 12.5rem);
  display: none;
  &.wizardSelected {
    display: block;
  }
}
</style>
