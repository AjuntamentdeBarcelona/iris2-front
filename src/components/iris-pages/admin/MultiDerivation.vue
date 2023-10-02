<template>
  <div class="multiderivation-editor">
    <div
      v-if="errorGroup"
      class="alert alert-danger">
      {{ $t('derivation_cannot_load_groups') }}
    </div>
    <b-tabs v-if="configReady">
      <b-tab
        v-for="item in forms"
        :key="item.uid"
        :title="item.model.description"
        :title-link-class="getTabClass(item)"
      >
        <form-generator
          :model="item.model"
          :schema="item.schema"
          :options="item.options"
          :external-errors="item.errors"
          @model-updated="onItemUpdated"
          @validated="onStateFormValidated(item, arguments)">
          <template slot="before-form">
            <td class="py-2">{{ item.label }}</td>
          </template>
          <template slot="after-form">
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
        </form-generator>
      </b-tab>
    </b-tabs>
    <div
      v-if="loadingMachine || loadingGroups"
      class="loading-overlay">
      <div class="loader"/>
    </div>
</div></template>

<script>
import { abstractField } from 'vue-form-generator'
import { mapState, mapActions } from 'vuex'
import DerivationSchema from '~/components/iris-pages/admin/DerivationSchema.js'
import multiformFieldMixin from '~/components/form-generator/multiformFieldMixin.js'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import IrisFormGenerator from '~/components/pages/form/irisFormGenerator.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import FormFieldset from '~/components/form-generator/layout/FormFieldset.vue'
import _ from 'lodash'

export default {
  name: 'Multiderivation',
  components: {
    'form-generator': IrisFormGenerator,
  },
  extends: abstractField,
  mixins: [multiformFieldMixin],
  data() {
    return {
      stateErrors: {},
      lastState: null,
      lastProcess: null,
      groupedValues: [],
    }
  },
  computed: {
    ...mapState('stateMachine', {
      loadingMachine: 'loading',
      stateMap: 'stateMap',
    }),
    ...mapState('derivation', {
      loadingGroups: 'loading',
      errorGroup: 'error',
    }),
    configReady() {
      return !this.loadingMachine && !this.loadingGroups && !this.errorGroup
    },
    modelProcess() {
      return this.model.process
    },
    districtDerivations() {
      return this.model.district_derivations
    },
    directDerivations() {
      return this.model.direct_derivations
    },
    process() {
      if (this.modelProcess && !this.loadingMachine) {
        return this.stateMap[this.modelProcess] || {}
      }
      return {}
    },
    modelAttrs() {
      return [this.schema.directModel || 'direct_multiderivations']
    },
    derivableStates() {
      const states = {}
      let initial = null
      for (let [step_id, step] of Object.entries(this.process)) {
        if (step.transitions && step_id != RecordState.EXTERNAL_PROCESSING.id) {
          states[step_id] = { ...step }
          if (step.initial) {
            states[step_id].description = this.$t('record_card_start_state')
          }
        }
      }
      return states
    },

    ready() {
      return !_.isEmpty(this.process)
    },
  },
  watch: {
    derivableStates() {
      if (this.lastProcess == null || this.modelProcess != this.lastProcess) {
        this.setGroupedValues()
        this.setForms()
      }
    },
  },
  mounted() {
    this.loadMap()
    this.loadTree()
  },
  methods: {
    ...mapActions('stateMachine', { loadMap: 'loadMap' }),
    ...mapActions('derivation', { loadTree: 'loadTree' }),
    /**
     * Values are received as a list that must be classified according to its state.
     */
    setGroupedValues() {
      const values = {}
      for (let state of Object.keys(this.derivableStates)) {
        values[state] = {
          state: state,
          initial: this.derivableStates[state].initial,
          description: this.derivableStates[state].description,
          id: this.model.id,
          district_derivations: this.model.district_derivations.filter(
            item => item.record_state == parseInt(state)
          ),
          direct_derivations: this.model.direct_derivations.filter(
            item => item.record_state == parseInt(state)
          ),
          polygon_derivations: this.model.polygon_derivations.filter(
            item => item.record_state == parseInt(state)
          ),
        }
        this.formErrors[state] = []
      }
      if (this.derivableStates.length > 0) {
        this.lastProcess = this.modelProcess
      }
      this.groupedValues = values
    },
    /**
     * Retrives the uid of a given item
     * @param {*} item
     */
    getItemInlineUid(item) {
      return item.state
    },
    /**
     * Retrieves the schema for editing a given state derivations.
     * @param {*} inlineItem
     */
    getSchemaForItem(inlineItem) {
      const definition = new FormDefinition(DerivationSchema.fields, {
        groups: DerivationSchema.groups,
      }).clone()
      const states = [parseInt(inlineItem.state)]
      definition.fields.district_derivations.required = inlineItem.initial
      definition.fields.district_derivations.recordStates = parseInt(
        inlineItem.state
      )
      if (inlineItem.initial) {
        this.adjustCentralizedSchema(definition)
      } else {
        definition.define('district_derivations', {
          title: this.$t(definition.fields.district_derivations.uid),
        })
      }
      definition.define('direct_derivations', {
        title: this.$t(definition.fields.direct_derivations.uid),
      })
      definition.fields.direct_derivations.required = inlineItem.initial
      definition.fields.direct_derivations.recordStates = states
      definition.getLayoutByName('derivations').legend =
        inlineItem.description || inlineItem.state
      return definition.getFormSchema()
    },
    /**
     * Initial state allows centralized derivations.
     */
    adjustCentralizedSchema(definition) {
      definition.define('territorial_derivations', {
        component: FormFieldset,
        title: this.$t('derivations_ubication'),
        emptyValue: [],
        model: 'territorial_derivations',
        fields: [
          {
            ...definition.fields.district_derivations,
            required: false,
            styleClasses: 'col-12 col-lg-6 mt-1 p-3',
            legend: this.$t(definition.fields.district_derivations.uid),
          },
          {
            ...definition.fields.polygon_derivations,
            styleClasses: 'col-12 col-lg-6 p-3',
            legend: this.$t(definition.fields.polygon_derivations.uid),
          },
        ],
        class: 'col-12 module',
      })
      definition.getLayoutByName('derivations').fields = [
        'direct_derivations',
        'territorial_derivations',
      ]
    },
    getItemLabel(item) {
      return item.description
    },
    getInlineItems() {
      return Object.values(this.groupedValues)
    },
    onStateFormValidated(item, eventArguments) {
      this.stateErrors = {
        ...this.stateErrors,
        [item.uid]: item.model.initial
          ? !this.validateInitial(item, eventArguments)
          : !eventArguments[0],
      }
      this.onItemFormValidated.apply(this, [!this.hasError()])
    },
    stateHasError(item) {
      return this.stateErrors[item.uid]
    },
    hasError() {
      for (const uid of Object.keys(this.stateErrors)) {
        if (this.stateErrors[uid]) {
          return true
        }
      }
      return false
    },
    getTabClass(item) {
      return (item.errors && item.errors.length > 0) || this.stateHasError(item)
        ? 'error'
        : ''
    },
    setValue(inlineItem) {
      this.value = this.groupedValues
    },
    setFormErrors() {},
    processFormErrors(errorList) {},
    validateInitial({ model }, [isValid, errors, field]) {
      if (!isValid) {
        let errorFields = {}
        errors.forEach(error => {
          errorFields[error.field.model] = true
        })
        // If we have no district but valid polygons, accept
        if (
          !errorFields.district_derivations ||
          (model.district_derivations.filter(d => d.group != null).length ==
            0 &&
            !errorFields.polygon_derivations &&
            model.polygon_derivations.length > 0)
        ) {
          return true
        }
        return false
      }
      return true
    },
  },
}
</script>


<style>
.multiderivation-editor {
  min-height: 200px;
}
</style>

<style lang="scss" scoped>
/deep/ .field-polygon-derivation {
  margin-top: 0 !important;
}
</style>
