var _ = require('lodash')

/**
 * The form definition class allows to specify a form by defining its fields (VueFormGenerator schema) and its layout separately.
 * Since layout and field specification are independent, many forms with different fields can be created by using the same data schema,
 * following a model driven approach.
 *
 * Also, this separtion allows to have a central definition of the model and then convert it to proper VueFormGenerator field schemas.
 */
export default class FormDefinition {
  constructor(fields, layout) {
    this.fields = fields
    this._setModelOnFields()
    this.setAllUid()
    this.layout = layout
  }

  /**
   * @return {Object} FormGenerator schema represented by this formDefinition.
   */
  getFormSchema() {
    for (const field of this.getTranslatedFields()) {
      this._setTranslatableLayout(this.layout, field.model, field.languages)
    }
    return this.constructLayout(this.layout).layout
  }

  getTranslatedFields() {
    return Object.values(this.fields).filter(val => val.translated)
  }

  /**
   * @return {FormDefinition} Returns a deep copy of this form definition.
   */
  clone() {
    return new FormDefinition(
      _.cloneDeep(this.fields),
      _.cloneDeep(this.layout)
    )
  }

  /**
   * @return {Array} A list of all the form field that will be used in the form.
   */
  getActiveFields() {
    return this.constructLayout(this.layout).activeFields
  }

  /**
   * Finds a layout object by its name. You only can find named layout, in other words,
   * those which have a layout_name attribute.
   * @param {*} name
   * @return {Object|null} The object with the layout name passed, null if it does not exists.
   */
  getLayoutByName(name) {
    return this._findLayoutByName(this.layout, name)
  }

  /**
   * Returns a valid empty model for the current field definition.
   */
  getEmptyModel() {
    let emptyModel = {}
    for (let field in this.fields) {
      emptyModel[field] = null
    }
    return emptyModel
  }

  /**
   * Overrides the field definition by assigning the override object to the indicated field.
   * This method is useful for adapting a form dynamically.
   * @param {String} field Field name being overriden
   * @param {Object} overrides Schema overrides for the object.
   *  Ensure it includes a model property, as _setModelOnFields won't be run on this.
   * @example definition.define('myfield', {required: true})
   */
  define(field, overrides) {
    this.fields[field] = {
      ...this.fields[field],
      ...overrides,
    }
  }

  /**
   * The formDefinition defines a form by separting the field definition from the layout part,
   * this method generates a valid schema object for the form generator, by combining the fields
   * and the layout..
   * @param {*} layout
   * @param {*} activeFields
   */
  constructLayout(layout, activeFields = []) {
    let newLayout = {}
    let self = this
    for (let key in layout) {
      if (key != 'fields' && key != 'groups' && key != 'layout_name') {
        newLayout[key] = layout[key]
        activeFields.push(key)
      }
    }
    if (layout.fields) {
      newLayout.fields = layout.fields.map(field => {
        if (self.fields[field] == null) {
          throw Error(
            'FormSchema error: Invalid field "' +
              field +
              '" is present in layout but is not defined in fields.'
          )
        }
        activeFields.push(field)
        return {
          ...self.fields[field],
          ...{ validator: this.adjustValidator(self.fields[field]) },
        }
      })
    }
    if (layout.groups) {
      newLayout.groups = layout.groups.map(
        group => this.constructLayout(group, activeFields).layout
      )
    }
    return {
      layout: newLayout,
      activeFields: activeFields,
    }
  }

  _findLayoutByName(layout, name) {
    if (layout.layout_name == name) {
      return layout
    } else if (layout.groups) {
      let layout_result = null
      for (let group of layout.groups) {
        layout_result = this._findLayoutByName(group, name)
        if (layout_result) {
          return layout_result
        }
      }
    }
    return null
  }

  /**
   * Applies locale to validators.
   * @param {Object} field schema
   * @return {Array} List of translated validators
   */
  adjustValidator(field) {
    if (!field.validator) {
      return null
    }
    const validators = Array.isArray(field.validator)
      ? field.validator
      : [field.validator]
    return validators.map(validator => {
      if (validator.locale != null) {
        return validator.locale()
      }
      return validator
    })
  }
  /**
   * Sets the uid field automatically.
   */
  setAllUid() {
    for (let field in this.fields) {
      if (this.fields[field].uid === undefined) {
        this.fields[field].uid = field
      }
    }
  }
  /**
   * Sets the model and id attributes for each form_schema field, by defaults sets its field key.
   * For example the spec {field_a: {}} will become {field_a: {model: 'field_a', id: 'field_a'}}.
   */
  _setModelOnFields() {
    const keyDefaultProps = ['id', 'model']
    const self = this
    keyDefaultProps.forEach(function(keyDefaultProp) {
      for (let fieldKey in self.fields) {
        if (!self.fields[fieldKey][keyDefaultProp]) {
          self.fields[fieldKey][keyDefaultProp] = fieldKey
        }
      }
    })
  }
  /**
   * Generates translation fields for every valid language registered.
   */
  translatable(vm, fields) {
    for (const field of fields) {
      let translatedFields = []
      for (const lang of vm.$irisConfig.LANGUAGES) {
        const newField = `${field}_${lang}`
        this.define(newField, {
          ...this.fields[field],
          model: newField,
          id: newField,
          translates: field,
          label: `${this.fields[field].label} ${lang.toUpperCase()}`,
        })
        translatedFields.push(newField)
      }
      this.define(field, {
        translated: true,
        languages: translatedFields,
      })
      console.log(this, field)
    }
    return this
  }
  /**
   * Finds and creates the translation fields for a given layout.
   *
   * @param {*} layout
   * @param {*} field
   */
  _setTranslatableLayout(layout, field, translated) {
    if (Array.isArray(layout)) {
      return layout.reduce((acc, value) => {
        return acc.concat(value == field ? translated : [value])
      }, [])
    } else if (layout.fields) {
      layout.fields = this._setTranslatableLayout(
        layout.fields,
        field,
        translated
      )
    }
    if (layout.groups) {
      for (const g of layout.groups) {
        this._setTranslatableLayout(g, field, translated)
      }
    }
  }
}
