<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import RecordTypesReadonly from './fields/RecordTypesReadonly.vue'
import TemplateTextEditor from './fields/TemplateTextEditor.vue'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset.vue'
import { formDefinition } from '~/components/iris-pages/templates/TemplateForm.vue'

/**
 * Template creation form.
 */
export default {
  name: 'GroupTemplateForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/templates/group/save-for-record/',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    method: {
      type: String,
      default: 'PUT',
    },
    record: {
      type: Object,
      required: true,
    },
    template: {
      type: Object,
      required: false,
      default: null,
    },
    textAttribute: {
      type: String,
      required: true,
    },
  },
  methods: {
    adaptSchema(definition) {
      definition.fields.text = {
        ...definition.fields[this.textAttribute],
        model: 'text',
      }
      definition.layout = {
        groups: [
          {
            fields: ['description', 'text'],
          },
        ],
      }
    },
    getInitialUrl() {
      return {}
    },
    getRequestUrl() {
      if (this.template) {
        return (
          '/api/templates/group/update-for-record/' +
          this.record.id +
          '/' +
          this.template.id +
          '/'
        )
      } else {
        return this.url + this.record.id + '/'
      }
    },
  },
}
</script>

<style>
.template-add .footer-buttons {
  margin-top: 20px;
}
</style>
