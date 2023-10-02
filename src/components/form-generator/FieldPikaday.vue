<template>
  <field-pikaday
    ref="picker"
    :vfg="vfg"
    :model="model"
    :schema="internalSchema"
    :form-options="formOptions"
    :disabled="disabled"
    @model-updated="modelUpdated"
  />
</template>

<script>
import { abstractField } from 'vue-form-generator'
import VueFormGenerator from 'vue-form-generator'
import _ from 'lodash'
import fecha from 'fecha'

export const formatValueToModel = function(value) {
  if (value != null) {
    let m = fecha.parse(value, this.getDateFormat())
    if (m) {
      if (this.schema.format) {
        value = fecha.format(m, this.schema.format)
      } else {
        value = m.valueOf()
      }
    } else {
      value = null
    }
  }

  return value
}

/**
 * Wrapper for vue-form-generator's built-in pikaday field
 * Schema is pre adapted to: 1º incorporate i18n by default and 2º set the first week day on mondays
 * formatValueToModel has been adapted to fix a bug where values not correctly parsed by fecha result on value's value
 *  being false, which causes an error when this is passed to fecha's formatting function
 *
 * As a reminder, there're two schema options to be aware of:
 *  1º schema.format The format on the model
 *  2º schema.pikadayOptions.format The format on the field
 */
export default {
  name: 'FieldPikaday',
  components: {
    'field-pikaday':
      VueFormGenerator.component.components.formGroup.components.fieldPikaday,
  },
  mixins: [abstractField],
  inheritAttrs: false,
  data() {
    return {
      pikadayOptions: {
        firstDay: 1,
        i18n: {
          previousMonth: this.$t('pikaday_previous_month'),
          nextMonth: this.$t('pikaday_next_month'),
          months: [
            this.$t('pikaday_january'),
            this.$t('pikaday_february'),
            this.$t('pikaday_march'),
            this.$t('pikaday_april'),
            this.$t('pikaday_may'),
            this.$t('pikaday_june'),
            this.$t('pikaday_july'),
            this.$t('pikaday_august'),
            this.$t('pikaday_september'),
            this.$t('pikaday_october'),
            this.$t('pikaday_november'),
            this.$t('pikaday_december'),
          ],
          weekdays: [
            this.$t('pikaday_sunday'),
            this.$t('pikaday_monday'),
            this.$t('pikaday_tuesday'),
            this.$t('pikaday_wednesday'),
            this.$t('pikaday_thursday'),
            this.$t('pikaday_friday'),
            this.$t('pikaday_saturday'),
          ],
          weekdaysShort: [
            this.$t('pikaday_sun'),
            this.$t('pikaday_mon'),
            this.$t('pikaday_tue'),
            this.$t('pikaday_wed'),
            this.$t('pikaday_thu'),
            this.$t('pikaday_fri'),
            this.$t('pikaday_sat'),
          ],
        },
      },
    }
  },
  computed: {
    internalSchema() {
      return _.merge({ pikadayOptions: this.pikadayOptions }, this.schema)
    },
  },
  mounted() {
    const pickerComponent = _.get(this, '$refs.picker')
    if (pickerComponent) {
      // Picker method reassigned to one that doesn't break on input value deletion (values that can't be parsed)
      pickerComponent.formatValueToModel = formatValueToModel
    }
  },
  methods: {
    modelUpdated(newValue, schemaModel) {
      this.$emit('model-updated', newValue, this.internalSchema.model)
    },
  },
}
</script>
