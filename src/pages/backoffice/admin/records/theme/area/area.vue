<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

function getFormDefinition(vm) {
  return new FormDefinition(
    {
      description: {
        type: 'input',
        inputType: 'text',
        maxlength: 40,
        min: 3,
        label: vm.$t('description'),
        placeholder: vm.$t('description'),
        styleClasses: 'col-6 col-md-4',
        required: true,
        validator: VueFormGenerator.validators.string.locale({
          fieldIsRequired: vm.$t('theme_description_mandatory'),
          textTooSmall: vm.$t('theme_description_min_length'),
        }),
      },
      IconName: {
        type: 'input',
        inputType: 'text',
        maxlength: 50,
        min: 3,
        id: 'icon_name',
        label: vm.$t('theme_icon'),
        placeholder: vm.$t('theme_icon'),
        model: 'icon_name',
        styleClasses: 'col-6 col-md-4',
        required: false,
        validator: VueFormGenerator.validators.string,
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: 'Descripcions',
          fields: ['description', 'IconName'],
        },
      ],
    }
  ).translatable(vm, ['description'])
}

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'AreaForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/areas/',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-records-theme-area-area',
    },
    title: {
      type: String,
      default: 'Crear Àrea',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-theme',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-theme',
    },
    definition: {
      type: Function,
      default: getFormDefinition,
      required: false,
    },
    addElementUrl: {
      type: Object,
      default: () => {
        return {
          name: 'backoffice-admin-records-theme-element-add',
        }
      },
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('area_save_success_title'),
      actionButtons: this.getDefaultButtons().concat([
        {
          name: 'save_and_add_element',
          text: this.$t('form_save_and_add_element'),
          click: this.saveAndAddElement,
          icon: 'plus',
          classes: 'btn-primary',
        },
      ]),
    }
  },
  methods: {
    goToAddElements(area) {
      const route = Object.assign({}, this.addElementUrl, {
        query: {
          area_id: area.id,
        },
      })
      this.$router.replace(this.localePath(route))
    },
    saveAndAddElement(event) {
      this.submit(event, result => {
        this.goToAddElements(result.data)
      })
    },
  },
}
</script>
