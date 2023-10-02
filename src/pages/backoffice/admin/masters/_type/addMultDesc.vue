<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaUtils from '~/assets/js/iris2/forms/SchemaUtils.js'
import SimpleMasterMixin from '~/pages/backoffice/admin/masters/SimpleMasterMixin.js'
import { schema, validators } from 'vue-form-generator'
import _ from 'lodash'

function getSimpleMasterDefinition(vm) {
  let descriptions = SchemaUtils.getDescription(
    40,
    null,
    vm.$t('description'),
    'description',
    {
      placeholder: vm.$t('description'),
      styleClasses: 'col-12 col-lg-8',
    }
  )
  return new FormDefinition(
    {
      ...descriptions,
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: Object.keys(descriptions),
        },
      ],
    }
  )
}

function getExtraFieldsDefinition(vm, type) {
  const extraFields = {
    theme_groups: {
      position: {
        type: 'input',
        inputType: 'number',
        label: vm.$t('position'),
        min: 0,
        max: 32767,
        required: true,
        styleClasses: 'col',
        validator: validators.number,
      },
    },
    'resolution-types': {
      order: {
        type: 'input',
        inputType: 'number',
        label: vm.$t('order'),
        min: 0,
        max: 2147483647,
        default: 100,
        required: true,
        styleClasses: 'col-12 col-lg-4',
        validator: validators.number,
      },
    },
  }
  return extraFields[type] || {}
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  extends: SchemaForm,
  mixins: [SimpleMasterMixin],
  layout: 'Masters',
  props: {
    successUrl: {
      type: String,
      default: 'backoffice-admin-masters-type',
    },
    definition: {
      type: Function,
      default: getSimpleMasterDefinition,
      required: false,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('profile_save_success_title'),
    }
  },
  computed: {
    /**
     * @returns Page title as i18n key. The type will be transformed to lower case, and the "-" will be replaced with undescores.
     */
    pageTitle() {
      if (this.isNewModel) {
        return this.$t(this.getType().replace('-', '_') + '_add')
      } else {
        return this.$t(this.getType().replace('-', '_') + '_edit')
      }
    },
  },
  created() {
    if (this.isNewModel) {
      this.model = schema.createDefaultObject(this.schemaDef)
    }
  },
  methods: {
    addRouterUrlParams(urlName) {
      return {
        name: urlName,
        params: {
          type: this.getType(),
        },
      }
    },
    getSuccessUrl(newObj) {
      return this.localePath({
        name: this.successUrl,
        params: {
          type: this.getType(),
        },
        query: { id: newObj.id },
      })
    },
    getInitialDefinition() {
      let definition = null
      if (_.isFunction(this.definition)) {
        definition = this.definition(this)
        if (this.isLongDescription()) {
          definition.fields.description.maxlength = 100
        }
      } else {
        definition = this.definition
      }

      definition.fields = {
        ...definition.fields,
        ...getExtraFieldsDefinition(this, this.getType()),
      }

      definition.layout.groups[0].fields = definition.layout.groups[0].fields.concat(
        Object.keys(getExtraFieldsDefinition(this, this.getType()))
      )
      return definition
    },
  },
}
</script>
