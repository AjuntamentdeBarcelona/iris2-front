<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import RecordTypesReadonly from './fields/RecordTypesReadonly.vue'
import TemplateTextEditor from './fields/TemplateTextEditor.vue'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset.vue'

function getTemplate(vm, uid, size) {
  return {
    uid: uid,
    component: TemplateTextEditor,
    maxlength: size,
    label: '',
    styleClasses: 'col-12',
    required: false,
    min: 10,
    validator: VueFormGenerator.validators.string,
  }
}

export const formDefinition = vm =>
  new FormDefinition(
    {
      description: {
        type: 'input',
        inputType: 'text',
        maxlength: 40,
        min: 3,
        id: 'description',
        label: vm.$t('description'),
        placeholder: vm.$t('description'),
        required: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string.locale(),
        styleClasses: 'col-12 col-xl-4',
      },
      record_types: {
        component: RecordTypesReadonly,
        label: vm.$t('template_record_type'),
        styleClasses: 'col-6 col-xl-4',
      },
      response_type: {
        type: 'readonly',
        label: vm.$t('template_answer_type'),
        styleClasses: 'col-6 col-xl-4',
        getReadValue(value) {
          if (value) {
            return value.description
          }
          return '-'
        },
      },
      write_medium_catalan: getTemplate(vm, 'write_medium_catalan', 1000),
      write_medium_spanish: getTemplate(vm, 'write_medium_spanish', 1000),
      write_medium_english: getTemplate(vm, 'write_medium_english', 1000),
      sms_medium_catalan: {
        ...getTemplate(vm, 'write_medium_catalan', 360),
        type: 'textarea',
      },
      sms_medium_spanish: {
        ...getTemplate(vm, 'sms_medium_spanish', 360),
        type: 'textarea',
      },
      sms_medium_english: {
        ...getTemplate(vm, 'sms_medium_spanish', 360),
        type: 'textarea',
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: ['description', 'record_types', 'response_type'],
        },
        {
          groups: [
            {
              legend: vm.$t('templates'),
              component: TabbedFieldset,
              class: 'col-12',
              groups: [
                {
                  title: vm.$t('template_large'),
                  component: TabbedFieldset,
                  groups: [
                    {
                      title: vm.$t('catalan'),
                      fields: ['write_medium_catalan'],
                    },
                    {
                      title: vm.$t('spanish'),
                      fields: ['write_medium_spanish'],
                    },
                    {
                      title: vm.$t('english'),
                      fields: ['write_medium_english'],
                    },
                  ],
                },
                {
                  title: vm.$t('template_small'),
                  component: TabbedFieldset,
                  class: 'SMS',
                  groups: [
                    {
                      title: vm.$t('catalan'),
                      fields: ['sms_medium_catalan'],
                    },
                    {
                      title: vm.$t('spanish'),
                      fields: ['sms_medium_spanish'],
                    },
                    {
                      title: vm.$t('english'),
                      fields: ['sms_medium_english'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  )

/**
 * Template creation form.
 */
export default {
  name: 'TemplateForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/templates/templates/',
    },
    addNewUrl: {
      type: String,
      required: false,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-templates',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-templates',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    recordType: {
      type: Object,
      required: false,
      default: null,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
    answerType: {
      type: Object,
      required: false,
      default: null,
    },
    recordTypeEditable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  mounted() {
    this.afterUpdate(this.schemaDef)
  },
  methods: {
    adaptSchema(schemaDef) {
      if (!this.recordTypeEditable) {
        schemaDef.fields.record_types.disabled = true
      }
    },
    afterUpdate() {
      this.adjustRequired(this.schemaDef)
    },
    applyInitialTransformation(initial) {
      if (this.recordType) {
        initial.record_types = [
          {
            record_type: this.recordType.id,
            description: this.recordType.description,
          },
        ]
      }
      if (this.answerType) {
        initial.response_type = this.answerType
      }
      return initial
    },
    getSaveData(model) {
      return {
        response_type_id: model.response_type.id,
      }
    },
    goBack() {
      this.$emit('exit')
    },
    adjustRequired(schemaDef) {
      if (this.model.write_medium_catalan || this.model.write_medium_spanish) {
        schemaDef.fields['write_medium_catalan'].required = true
        schemaDef.fields['write_medium_spanish'].required = true
      }
      if (this.model.sms_medium_catalan || this.model.sms_medium_spanish) {
        schemaDef.fields['sms_medium_spanish'].required = true
        schemaDef.fields['sms_medium_catalan'].required = true
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
