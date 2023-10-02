import { pasCamelToKebab } from '~/assets/js/utils'

/**
 * Implements new behaviour.
 * Currently, incoporates component's names among field row classes
 */
export default {
  methods: {
    getComponentFieldRowClasses(field) {
      return {
        ...this.getFieldRowClasses(field),
        ...this.getComponentTypeClass(field),
      }
    },
    getComponentTypeClass(field) {
      if (field && field.component && !field.hasOwnProperty('type')) {
        const componentFieldType = this.getComponentFieldType(field)

        if (componentFieldType) {
          return { [`field-${componentFieldType}`]: true }
        }
      }
      return {}
    },
    getComponentFieldType(field) {
      const componentName = field.component.name

      if (componentName) {
        const componentType = pasCamelToKebab(componentName)
          .replace('field-', '')
          .replace('-field', '')

        return componentType
      } else {
        return ''
      }
    },
  },
}
