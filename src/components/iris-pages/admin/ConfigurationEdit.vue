<script>
import EditInferredSchema from '~/components/pages/form/EditInferredSchema.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import schemaForm from '~/components/pages/form/schemaForm.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'
import ConfigSchema from '~/assets/js/iris2/model/ConfigSchema.js'

/**
 * The configuration page needs a custom schemaForm in order to override
 * the way the data for saving is got. The configuration params are edited
 * as { results: [/ many config params /] }, but the endpoint for saving requires
 * a plain array of objects for saving: [/many config params/]
 */
let ConfigurationForm = {
  extends: schemaForm,
  methods: {
    constructSaveData(model) {
      return Object.values(model.results)
    },
    getDefaultButtons() {
      return [
        {
          name: 'save',
          text: this.$t('form_save'),
          click: this.submit,
          icon: 'save',
          classes: 'btn-primary mr-2',
        },
        {
          name: 'exit',
          text: this.$t('form_back_without_changes'),
          click: this.goBack,
          icon: 'backward',
          classes: 'order-1 mr-auto btn-light',
        },
      ]
    },
    /**
     * Process the errors in order to adapt them to the form schema,
     * this is the inverse process of getSaveData applied to errors.
     */
    processExternalErrors(errors) {
      return schemaForm.methods.processExternalErrors.apply(this, [
        {
          results: [errors],
        },
      ])
    },
  },
}

/**
 * Presents a form for editing the different system configuration parameters.
 * Each parameter has the form of:
 *
 * So, each parameter must be edited as a separate
 */
export default {
  name: 'SystemConfiguration',
  extends: EditInferredSchema,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'navigation_configuration',
    },
    url: {
      type: [String, Object],
      default: () => 'api/masters/parameters/',
      required: false,
    },
    method: {
      type: String,
      default: 'post',
    },
    formComponent: {
      type: [Object, String],
      default: () => ConfigurationForm,
      required: false,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-configuration',
    },
  },
  computed: {
    saveUrl() {
      return 'api/masters/parameters/update/'
    },
  },
  methods: {
    pkRefresh() {
      return
    },
    /**
     * Given an array of configurations returns a FormDefinition for editing them
     * with form generator component.
     *
     * @return FormDefinition
     */
    getInferredSchema(configurations) {
      const uidField = 'id'
      const schemas = {}
      configurations.results.forEach(config => {
        schemas[config[uidField]] = {
          fields: [
            {
              ...this.getConfigSchema(config),
              model: 'valor',
              label: 'Valor',
              styleClasses: 'value',
            },
            {
              type: 'textArea',
              model: 'description',
              label: 'Descripció',
              help: config.original_description || '',
              styleClasses: 'description',
              rows: 3,
            },
          ],
        }
      })
      return new FormDefinition(
        {
          results: {
            type: 'multiform',
            multischema: schemas,
            inlineIdName: uidField,
            draggable: false,
            labelField: 'name',
            canDelete: false,
            styleClasses: 'col-12 configuration',
            hideGroupErrors: true,
          },
        },
        {
          groups: [{ fields: ['results'] }],
        }
      )
    },
    /**
     * Creates the schema for editing a config field.
     */
    getConfigSchema(config) {
      try {
        return ConfigSchema.getSchema(config)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>


<style lang="scss">
.configuration td:first-child {
  width: 25%;
  padding: 10px;
  font-weight: bold;
}
.configuration .value.field-textArea textarea,
.configuration .description.field-textArea textarea {
  height: inherit;
}
// .configuration .value.field-textArea textarea {
//   min-height: 160px;
// }
.configuration td:nth-child(2) {
  width: 30%;
}
.configuration td:nth-child(3) {
  width: 40%;
}

.configuration .loading-form {
  min-height: 500px;
}
</style>
