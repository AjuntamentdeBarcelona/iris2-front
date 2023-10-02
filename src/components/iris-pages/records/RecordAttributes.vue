<template>
  <div class="record-card-attributes">
    <div
      v-show="error && !loading"
      class="alert alert-danger">
      {{ $t('system_error') }}
    </div>
    <div
      v-show="empty && !loading"
      class="alert alert-success">
      {{ $t('detail_no_features') }}
    </div>
    <div
      v-show="!hasAllRequired && !loading"
      class="alert alert-warning">
      {{ $t('all_madatory') }}
    </div>
    <div
      v-if="loading"
      class="loading-overlay"
    >
      <div class="loader" />
    </div>
    <iris-form-generator
      v-if="!loading && !error"
      ref="subform"
      :schema="schema"
      :model="model"
      :options="formOptions"
      :is-new-model="false"
      @model-updated="valueChanged"
      @validated="validated" />
  </div>
</template>

<script>
import IrisFormGenerator from '~/components/pages/form/irisFormGenerator.vue'
import { mapState, mapActions } from 'vuex'
import Feature from '~/assets/js/iris2/model/Feature.js'
import _ from 'lodash'

/**
 * Component for edit the attributes for a RecordCard. The component retrieves
 * the attribute IDs from server and then relates them with the given values list
 * and mapped to a values object.
 *
 * Besides, each attribute is transformed into a FormGenerator Schema and all together
 * are edited inside the IrisFormGenerator component, related with the correct value.
 *
 * In case of attribute loading error, the attribute-retrieve-error event is emitted.
 * In case of an IrisFormGenerator validation, the validation result is sent in a validate event.
 * In case of model value change, the input event is emitted.
 *
 * This component allows the v-model directive.
 *
 * @todo validation errors
 * @todo masks
 * @todo Values list
 * @todo field per type
 */
export default {
  name: 'RecordAttributes',
  components: {
    IrisFormGenerator,
  },
  props: {
    detailId: {
      type: Number,
      required: true,
    },
    value: {
      type: Array,
      required: false,
      default: () => [],
    },
    extraErrors: {
      type: Array,
      default() {
        return []
      },
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false,
    },
    /**
     * If true, Features.AUTOVALUES will be applied.
     */
    auto: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      empty: false,
      hasAllRequired: false,
      formOptions: {
        validateAfterChanged: true,
        validateAfterLoad: true,
      },
      model: {},
      schemas: {},
    }
  },
  computed: {
    editableValues() {
      return this.value.filter(value => this.schemas[value.feature] != null)
    },
    missingValues() {
      return this.value.filter(value => this.schemas[value.feature] == null)
    },
    schema() {
      return {
        groups: [
          {
            class: 'col-12',
            fields: _.orderBy(
              Object.keys(this.schemas).map(key => this.schemas[key]),
              'order'
            ),
          },
        ],
      }
    },
    ...mapState('features', 'masks'),
  },
  watch: {
    value() {
      this.attachValues()
      this.checkRequired()
    },
    detailId() {
      this.loadAttributes()
    },
  },
  mounted() {
    /**
     * @todo load masks from server in order to extend with additional
     *  /this.loadMasks().then(() => {
      this.loadAttributes()
    })*/
    this.validated(false, [], this)
    this.attachValues()
    this.loadAttributes()
  },
  methods: {
    loadAttributes() {
      if (this.detailId) {
        this.validated(false, [], this)
        this.loading = true
        this.$axios
          .get(`/api/theme/details/${this.detailId}/features/`)
          .then(resp => {
            this.schemas = this.processFields(resp.data.results)
            this.empty = _.isEmpty(this.schemas)
            this.valueChanged()
          })
          .catch(error => {
            this.error = true
            this.$emit('validated', false, ['System error'], {})
          })
          .then(resp => {
            this.loading = false
            this.checkRequired()
          })
      } else {
        this.schemas = []
        this.checkRequired()
      }
    },
    /**
     * Map each feature, using its pk as key, with its form schema.
     */
    processFields(features) {
      const schemas = {}
      const singleFeature = Boolean(
        _.uniqBy(features, 'feature.id').length === 1
      )

      features.forEach(feature => {
        schemas[this.getModelAttr(feature)] = this.getDefinition(
          feature,
          singleFeature
        )
      })
      return schemas
    },
    /**
     * Transform a feature into a valid IrisFormGenerator schema.
     */
    getDefinition(edFeature, singleFeature) {
      return {
        model: this.getModelAttr(edFeature),
        styleClasses: `col-12${singleFeature ? '' : ' col-lg-6'}`,
        edFeature: edFeature,
        readonly: this.readonly,
        order: edFeature.order,
        ...Feature.schemaFromEDFeature(edFeature, this.masks, this),
      }
    },
    getModelAttr(edFeature) {
      return '' + edFeature.feature.id
    },
    /**
     * Updates the undeliying VueFormGenerator model with the values
     */
    attachValues() {
      Object.assign(this.model, this.getModelValue())
    },
    /**
     * Transform the list of values into a model for editing them
     * on the IrisFormGenerator.
     */
    getModelValue() {
      const model = {}
      this.value.map(value => {
        model['' + value.feature] = value.value
      })
      try {
        this.setValuesFromCodename(model)
      } catch {
        console.error('Cannot process data from url.')
      }
      return model
    },
    setValuesFromCodename(model) {
      Object.values(this.schemas)
        .map(s => s.edFeature.feature)
        .filter(f => f !== undefined)
        .forEach(feature => {
          if (
            feature.codename_iris &&
            this.$route.query[feature.codename_iris]
          ) {
            if (feature.values_type_id) {
              const listValue = feature.values_type.values.find(
                e => e.description == this.$route.query[feature.codename_iris]
              )
              model['' + feature.id] = _.get(listValue, 'id', null)
            } else {
              model['' + feature.id] = this.$route.query[feature.codename_iris]
            }
          } else if (this.auto && Feature.hasAuto(feature)) {
            model[feature.id] = Feature.getAuto(feature)
          }
        })
    },
    valueChanged() {
      this.$emit('input', this.getValue())
    },
    validated(isValid, formErrors, formGenerator) {
      this.checkRequired()
      this.$emit(
        'validated',
        isValid && this.hasAllRequired && !this.error,
        formErrors,
        formGenerator
      )
    },
    checkRequired() {
      this.hasAllRequired = this.hasAllRequiredFields()
    },
    hasAllRequiredFields() {
      if (!this.schemas) {
        return true
      }
      for (let field in this.schemas) {
        if (this.schemas[field].required && !this.model[field]) {
          return false
        }
      }
      return true
    },
    /**
     * Maps the model values back to a Value list.
     *
     * @example { 1: 20 } maps to [{ feature: 1, value: 20 }]
     */
    getValue() {
      return Object.keys(this.schemas)
        .map(feature_id => {
          return {
            feature: feature_id,
            value: this.model[feature_id] || '',
            isSpecial: this.schemas[feature_id].edFeature.feature.is_special,
            is_theme_feature: true,
          }
        })
        .concat(
          this.missingValues.map(value => {
            return {
              ...value,
              is_theme_feature: false,
            }
          })
        )
    },
    ...mapActions('features', { loadMasks: 'retrieveMasks' }),
  },
}
</script>

<style>
.record-card-attributes .vue-form-generator .form-group {
  padding-bottom: 5px;
  margin-bottom: 5px;
}
.record-card-attributes {
  min-height: 230px;
}
</style>
