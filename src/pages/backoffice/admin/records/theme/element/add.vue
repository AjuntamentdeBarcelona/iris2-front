<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

function getFormDefinition(vm) {
  return new FormDefinition(
    {
      area_id: {
        type: 'autocomplete',
        inputType: 'number',
        label: 'Àrea',
        optionLabelAttribute: 'description',
        url: '/api/theme/areas/',
        valueAttribute: 'id',
        values: [],
        isRestful: true,
        getInitialOption: function(model) {
          return model.area
        },
      },
      description: {
        type: 'input',
        inputType: 'text',
        maxlength: 40,
        min: 3,
        label: `${vm.$t('description')}`,
        placeholder: vm.$t('description'),
        styleClasses: 'col-6 col-md-4',
        required: true,
        validator: VueFormGenerator.validators.string.locale({
          fieldIsRequired: this.$t('theme_description_mandatory'),
          textTooSmall: this.$t('theme_description_min_length'),
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
      is_favorite: {
        type: 'checkbox',
        default: false,
        styleClasses: 'col-12 col-lg-4',
        label: vm.$t('theme_element_favourite_label'),
      },
    },
    {
      fields: ['area_id'],
      class: 'row',
      groups: [
        {
          legend: 'Descripcions',
          fields: ['description', 'IconName', 'is_favorite'],
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
  name: 'ElementForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/elements/',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-records-theme-element-add',
    },
    title: {
      type: String,
      default: 'Crear element',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-theme-element',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-theme-area-id',
    },
    definition: {
      type: Function,
      default: getFormDefinition,
      required: false,
    },
    addDetailUrl: {
      type: Object,
      default: () => {
        return {
          name: 'backoffice-admin-records-theme-detail-add',
        }
      },
    },
    initialReadonly: {
      type: Array,
      required: false,
      default: () => ['area_id'],
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('element_save_success_title'),
      actionButtons: this.getDefaultButtons().concat([
        {
          name: 'save_and_add_detail',
          text: this.$t('form_save_and_add_detail'),
          click: this.saveAndAddDetail,
          icon: 'plus',
          classes: 'btn-primary',
        },
      ]),
    }
  },
  methods: {
    adaptSchema(schemaDef) {
      if (this.$route.params.id) {
        schemaDef.fields.area_id.readonly = true
      }
    },
    getSuccessUrl(newObj) {
      const areaId = this.getAreaId()
      if (areaId) {
        return this.localePath({
          name: 'backoffice-admin-records-theme-area-id',
          params: { id: areaId },
        })
      } else {
        return this.localePath({
          name: this.successUrl,
          query: { id: newObj.id },
        })
      }
    },
    getAreaId() {
      return [
        this.model.area_id,
        this.initialModel.area_id,
        this.$route.query.area_id,
      ].find(val => val != null)
    },
    goToAddDetails(element) {
      const route = Object.assign({}, this.addDetailUrl, {
        query: {
          element_id: element.id,
          area_id: element.area_id,
        },
      })
      this.$router.push(this.localePath(route))
    },
    saveAndAddDetail(event) {
      this.submit(event, result => {
        this.goToAddDetails(result.data)
      })
    },
    /**
     * Go back to area URL
     */
    goBack(event) {
      if (this.initialModel.area_id) {
        this.$router.push(
          this.localePath({
            name: this.backUrl,
            params: {
              id: this.initialModel.area_id,
            },
          })
        )
      } else {
        this.$router.go(-1)
      }
    },
    /**
     * On Updates the user must be redirected to the add url.
     */
    goToAddAnother() {
      this.$router.replace(
        this.localePath(
          Object.assign(
            { name: this.addNewUrl },
            {
              query: {
                area_id: this.model.area_id,
              },
            }
          )
        )
      )
    },
  },
}
</script>
