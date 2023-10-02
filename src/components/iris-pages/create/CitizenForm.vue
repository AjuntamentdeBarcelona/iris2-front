<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import VueFormGenerator from 'vue-form-generator'
import SchemaForm from '~/components/pages/form/schemaForm'
import VuexSelect from '~/components/form-generator/masters/VuexSelect.vue'
import Applicant from '~/assets/js/iris2/model/Applicant.js'
import { mapState } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'
import Crm from '~/assets/js/iris2/model/Crm.js'
import getLanguages from '~/assets/js/lang/languages.js'

let citizen_form_definition = vm => {
  const birthYearLabel = vm.$t('birth_year').toLowerCase()
  const yearValidator = VueFormGenerator.validators.integer.locale({
    fieldIsRequired: `El ${birthYearLabel} és un camp obligatori.`,
    numberTooSmall: `El ${birthYearLabel} ha de ser superior a {0}.`,
    numberTooBig: `El ${birthYearLabel} ha de ser inferior a {0}.`,
  })
  return new FormDefinition(
    {
      name: {
        type: 'input',
        inputType: 'text',
        maxlength: 60,
        min: 2,
        id: 'name',
        label: vm.$t('name'),
        placeholder: vm.$t('name'),
        model: 'name',
        required: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string,
      },
      first_surname: {
        type: 'input',
        inputType: 'text',
        maxlength: 60,
        min: 2,
        id: 'first_surname',
        label: vm.$t('first_surname'),
        placeholder: vm.$t('first_surname'),
        model: 'first_surname',
        required: true,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string,
      },
      second_surname: {
        type: 'input',
        inputType: 'text',
        maxlength: 60,
        min: 2,
        id: 'second_surname',
        label: vm.$t('second_surname'),
        placeholder: vm.$t('second_surname'),
        model: 'second_surname',
        required: false,
        styleClasses: 'col-6 col-md-4',
        validator: VueFormGenerator.validators.string,
      },
      dni: {
        type: 'id',
        model: 'dni',
        id: 'dni',
        label: vm.$t('identity_card'),
        required: true,
        styleClasses: 'col-12 col-md-8',
      },
      birth_year: {
        type: 'input',
        inputType: 'number',
        min: 1900,
        id: 'birth_year',
        label: vm.$t('birth_year'),
        placeholder: vm.$t('year'),
        model: 'birth_year',
        required: false,
        styleClasses: 'col-6 col-md-4',
        validator: function(value, field, model) {
          if (value === '' || isNaN(value)) {
            return true
          }
          return yearValidator(value, field, model)
        },
      },
      /*sex: {
        type: 'select',
        values: [
          { id: Applicant.MALE, name: Ca.male },
          { id: Applicant.FEMALE, name: Ca.female },
          { id: Applicant.NO_INTRODUCE_SEX, name: '-' },
        ],
        selectOptions: {
          hideNoneSelectedText: true,
        },
        id: 'sex',
        label: Ca.sex,
        model: 'sex',
        required: false,
        styleClasses: 'col-6 col-md-4',
      },*/
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
        required: true,
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
          fields: ['name', 'first_surname', 'second_surname'],
        },
        {
          fields: ['dni', 'birth_year'],
        },
        {
          fields: ['district', 'language', 'flag_ca'],
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
      default: 'Crear ciutadà',
    },
    definition: {
      type: Object,
      default: () => citizen_form_definition,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: String,
      default: Permissions.CITIZEN.CREATE,
    },
  },
  computed: {
    canAdminApplicants() {
      return this.hasPagePermission(Permissions.CITIZEN.DELETE)
    },
    ...mapState('create', ['initialIsRegister', 'initialApplicantDoc']),
  },
  watch: {
    canAdminApplicants: {
      handler() {
        if (this.canAdminApplicants) {
          this.schemaDef.layout.groups[3] = { fields: ['blocked'] }
        } else {
          this.schemaDef.layout.groups[3] = { fields: [] }
        }
      },
      immediate: true,
    },
    initialIsRegister: {
      immediate: true,
      handler() {
        this.adjustRegister()
      },
    },
  },
  methods: {
    /**
     * Set default sex
     */
    applyInitialTransformation(initial) {
      // initial.sex = initial.sex || Applicant.NO_INTRODUCE_SEX
      return initial
    },
    /**
     * Disable URL initial data, all data must be introduced manually.
     */
    getUrlInitial() {
      return {}
    },
    adaptSchema(schemaDef) {
      schemaDef.fields.birth_year.max = new Date().getFullYear()
      if (this.formType === 'update') {
        schemaDef.fields.dni.disabled = true
      }
    },
    afterUpdate() {
      this.adjustRegister()
    },
    getSaveData(model) {
      return {
        citizen: {
          ...model,
          sex: Applicant.NO_INTRODUCE_SEX,
          blocked: this.canAdminApplicants ? model.blocked : undefined,
          birth_year: isNaN(model.birth_year) ? undefined : model.birth_year,
        },
      }
    },
    adjustRegister() {
      if (
        (this.initialIsRegister || Crm.isCRMCreation(this.$route.query)) &&
        this.model.dni == this.initialApplicantDoc
      ) {
        this.schemaDef.define('district', { required: false })
        this.schemaDef.define('language', { required: false })
      } else if (
        this.schemaDef.fields.district.required ||
        this.schemaDef.fields.language.required
      ) {
        this.schemaDef.define('district', { required: true })
        this.schemaDef.define('language', { required: true })
      }
    },
    processExternalErrors(errors) {
      return SchemaForm.methods.processExternalErrors.apply(this, [
        errors.citizen,
      ])
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ {
  .form-group {
    padding-bottom: 0;
  }
}
</style>
