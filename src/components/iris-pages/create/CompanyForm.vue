<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import VueFormGenerator from 'vue-form-generator'
import SchemaForm from '~/components/pages/form/schemaForm'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import getLanguages from '~/assets/js/lang/languages.js'
import Permissions from '~/assets/js/iris2/Permissions.js'

let social_entity_form_definition = vm => {
  const srLabel = vm.$t('social_reason').toLowerCase()
  const cifLabel = vm.$t('cif')
  const contactLabel = vm.$t('contact').toLowerCase()
  return new FormDefinition(
    {
      social_reason: {
        type: 'input',
        inputType: 'text',
        maxlength: 60,
        min: 2,
        id: 'social_reason',
        label: vm.$t('social_reason'),
        placeholder: vm.$t('social_reason'),
        model: 'social_reason',
        required: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string.locale(),
      },
      cif: {
        type: 'input',
        inputType: 'text',
        maxlength: 15,
        min: 9,
        id: 'cif',
        label: vm.$t('cif'),
        placeholder: vm.$t('cif'),
        model: 'cif',
        required: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string.locale(),
      },
      contact: {
        type: 'input',
        inputType: 'text',
        maxlength: 120,
        min: 3,
        id: 'contact',
        label: vm.$t('contact'),
        placeholder: vm.$t('name'),
        model: 'contact',
        required: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string.locale(),
      },
      language: {
        type: 'select',
        values: getLanguages(vm).map(lang => ({
          id: lang,
          name: vm.$t(lang),
        })),
        selectOptions: {
          noneSelectedText: vm.$t('record_card_select_lang'),
        },
        id: 'language',
        label: vm.$t('language'),
        model: 'language',
        required: true,
        styleClasses: 'col-6 col-md-4',
      },
      district: {
        component: VuexSelect,
        storeModule: 'masters',
        storeAction: 'retrieveDistricts',
        storeAttribute: 'districts',
        optionLabelAttribute: 'name',
        valueAttribute: 'id',
        model: 'district',
        id: 'district',
        label: vm.$t('district'),
        styleClasses: 'col-6 col-md-4',
      },
      flag_ca: {
        type: 'checkbox',
        label: vm.$t('authorize_data'),
        styleClasses: 'col-12',
      },
      blocked: {
        type: 'checkbox',
        label: vm.$t('applicant_block'),
        styleClasses: 'col-12',
      },
    },
    {
      groups: [
        {
          fields: ['social_reason', 'cif', 'district'],
        },
        {
          fields: ['contact', 'language', 'flag_ca'],
        },
      ],
    }
  )
}
export default {
  extends: SchemaForm,
  props: {
    formType: {
      type: String,
      default: 'create',
    },
    url: {
      type: String,
      default: '/api/record_cards/applicants/',
    },
    title: {
      type: String,
      default: 'Crear agrupació',
    },
    definition: {
      type: Object,
      default: () => social_entity_form_definition,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    canAdminApplicants() {
      return this.hasPagePermission(Permissions.CITIZEN.DELETE)
    },
  },
  watch: {
    canAdminApplicants: {
      handler() {
        if (this.canAdminApplicants) {
          this.schemaDef.layout.groups[2] = { fields: ['blocked'] }
        } else {
          this.schemaDef.layout.groups[2] = { fields: [] }
        }
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * Disable URL initial data, all data must be introduced manually.
     */
    getUrlInitial() {
      return {}
    },
    adaptSchema(schemaDef) {
      if (this.formType === 'update') {
        schemaDef.fields.cif.disabled = true
      }
    },
    getSaveData(model) {
      return {
        social_entity: {
          ...model,
          blocked: this.canAdminApplicants ? model.blocked : undefined,
        },
      }
    },
    processExternalErrors(errors) {
      return SchemaForm.methods.processExternalErrors.apply(this, [
        errors.social_entity,
      ])
    },
  },
}
</script>
