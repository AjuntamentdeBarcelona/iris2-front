<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'
import { mapActions } from 'vuex'

const formDefinition = vm =>
  new FormDefinition(
    {
      description: {
        type: 'input',
        inputType: 'text',
        maxlength: 80,
        min: 3,
        id: 'description',
        label: vm.$t('description'),
        placeholder: vm.$t('description'),
        required: true,
        styleClasses: 'col-12',
        validator: VueFormGenerator.validators.string.locale(),
      },
      permissions: {
        type: 'm2m-select',
        label: vm.$t('profile_permissions'),
        styleClasses: 'col-12',
        selectedOptionsSorting: compareFnByDescriptionAsc,
        allOptionsUrl: '/api/profiles/permissions/',
        modelAttribute: 'permission',
        labelKeySelect1: vm.$t('profile_all_permissions'),
        labelKeySelect2: vm.$t('profile_selected_permissions'),
      },
    },
    {
      fields: [],
      class: 'row',
      groups: [
        {
          legend: vm.$t('configuration'),
          fields: ['description', 'permissions'],
        },
      ],
    }
  )

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'AreaForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/profiles/profiles/',
    },
    addNewUrl: {
      type: String,
      default: 'backoffice-admin-access-profiles-add',
    },
    title: {
      type: String,
      default: 'profile_create',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-profiles',
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-access-profiles',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('profile_save_success_title'),
    }
  },
  methods: {
    afterSave() {
      this.loadGroups(true)
    },
    ...mapActions('groups', ['loadGroups']),
  },
}
</script>
