import { Mask, getMasks } from './Masks.js'
import { validators } from 'vue-form-generator'
import moment from 'moment'

export default {
  MAX_ACCEPTED_VALUE: 2048,
  AUTOVALUES: {
    maskCache: getMasks(),
    auto_date(feature) {
      try {
        console.log(this.maskCache, feature)
        return moment().format(this.maskCache[feature.mask_id].autoformat)
      } catch {
        return null
      }
    },
  },
  hasAuto(feature) {
    return this.AUTOVALUES[feature.codename_iris] != null
  },
  getAuto(feature) {
    return this.AUTOVALUES[feature.codename_iris](feature)
  },
  /**
   * Returns a VueFormGenerator Schema for an ElementDetail feature.
   * The element detail feature is an object with two fields the feature itself
   * and a field that mark them as mandatory.
   * @param {Object} edFeature
   * @param {Object} trans Object with a $t property for translating strings
   * @param {function} trans.$t Function for translating the string
   * @param {Array} masks List of the known masks
   */
  schemaFromEDFeature(edFeature, masks, trans) {
    trans = trans || { $t: value => value }
    masks = masks || getMasks()
    let maskSchema = {}
    if (edFeature.feature.mask) {
      const mask = edFeature.feature.mask
        ? masks[edFeature.feature.mask.id]
        : null
      maskSchema = mask ? Mask.toFormGeneratorSchema(mask, trans) : {}
      maskSchema.placeholder = edFeature.feature.mask.description || '-'
    }
    return {
      ...maskSchema,
      ...this.schemaFromFeature(
        edFeature.feature,
        edFeature.is_mandatory,
        trans
      ),
    }
  },
  /**
   * Returns the VueFormGenerator schema for a feture.
   * @param {Object} feature
   * @param {Boolean} forceRequired
   * @return {Object} VueFormGenerator schema
   */
  schemaFromFeature(feature, forceRequired, trans) {
    const required = feature.is_special || forceRequired,
      schema = {
        label: feature.description,
        required: required,
        hint: feature.explanatory_text,
      }
    if (feature.values_type != null) {
      return {
        ...schema,
        type: 'select',
        values: feature.values_type.values,
        selectOptions: {
          name: 'description', // Label for the option
          value: 'id', // Retrieve the option value from the id attr
          noneSelectedText: trans.$t('form_select_none_selected'),
        },
        validator: validators.integer.locale({
          fieldIsRequired: trans.$t('mask_field_is_required'),
        }),
      }
    } else {
      return {
        type: 'input',
        inputType: 'text',
        max: this.MAX_ACCEPTED_VALUE,
        ...schema,
      }
    }
  },
  /**
   * The feature value label can be got from a value_list or from an attribute,
   * according to the feature definition. This function returns the readable value
   * of a feature.
   * @param {*} value Feature value
   * @param {*} feature Feature object
   * @return {*} Returns the label for the value
   */
  labelForValue(value, feature) {
    if (feature.values_type != null) {
      const options = feature.values_type.values
        .filter(option => value == option.id)
        .map(option => option.description)
      if (options.length) {
        return options[0]
      }
    }
    return value
  },
}
