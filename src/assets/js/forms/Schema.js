/**
 * Retrieves the complete list of fields of a schema,
 * following its hierarchy.
 */
export function getFieldsFromSchema(schema) {
  let fields = []
  if (Array.isArray(schema)) {
    fields = fields.concat(schema)
  } else {
    if (schema.fields) {
      fields = fields.concat(schema.fields)
    }
    if (schema.groups) {
      for (let group of schema.groups) {
        fields = fields.concat(getFieldsFromSchema(group))
      }
    }
  }
  return fields
}
