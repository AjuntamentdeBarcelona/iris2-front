import VueFormGenerator from 'vue-form-generator'

export default {
  SIMPLE_MASTER_DESCRIPTION: {
    type: 'input',
    inputType: 'text',
    maxlength: 40,
    min: 3,
    id: 'description',
    label: 'Descripció',
    required: true,
    styleClasses: 'col-6 col-md-4',
    validator: VueFormGenerator.validators.string,
  },

  /**
   * @param {*} maxLength Max length of the field.
   * @param {Array, null} langs List of languages for generate fields.
   * @param {String} label Label for the given field.
   * @param {String} baseFieldName Model attribute for the fields. If the value is description, then a field description_{lang} will be generated for each lang
   * @returns { Object } Object with a description schema for each lang given by parameter.
   */
  getDescription: function(
    maxLength,
    langs,
    label,
    baseFieldName = 'description',
    overrides = {}
  ) {
    let schemas = {}
    if (langs) {
      for (let lang of langs) {
        schemas[`${baseFieldName}_${lang.toLowerCase()}`] = {
          ...this.SIMPLE_MASTER_DESCRIPTION,
          label: label + ` (${lang.toUpperCase()})`,
          id: baseFieldName + `_${lang.toUpperCase()}`,
          maxlength: maxLength,
          ...overrides,
        }
      }
    } else {
      schemas[baseFieldName] = {
        ...this.SIMPLE_MASTER_DESCRIPTION,
        label: label,
        id: baseFieldName,
        maxlength: maxLength,
        ...overrides,
      }
    }
    return schemas
  },
}
