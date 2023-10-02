<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'
import { treeToPlain } from '~/pages/backoffice/admin/access/groups/group.vue'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'
import Permissions from '~/assets/js/iris2/Permissions.js'

const formDefinition = vm =>
  new FormDefinition(
    {
      username: {
        type: 'input',
        inputType: 'text',
        max: 32,
        required: true,
        label: vm.$t('users_username'),
        placeholder: vm.$t('users_username'),
        styleClasses: 'col-lg-4',
        readonly: false,
        validator: validators.string,
      },
      groups: {
        type: 'm2m-select',
        label: vm.$t('users_groups'),
        styleClasses: 'col-12',
        allOptionsUrl: '/api/profiles/groups/tree/',
        modelAttribute: 'group',
        processApiData: treeToPlain,
        selectedOptionsSorting: compareFnByDescriptionAsc,
        labelKeySelect1: 'groups_all_groups',
        labelKeySelect2: 'groups_user_selected_groups',
      },
      profiles: {
        type: 'm2m-select',
        label: vm.$t('navigation_profiles'),
        styleClasses: 'col-12',
        allOptionsUrl: '/api/profiles/profiles/',
        modelAttribute: 'profile',
      },
    },
    {
      groups: [
        {
          class: 'col',
          fields: ['username', 'groups', 'profiles'],
        },
      ],
    }
  )

export default {
  name: 'UserForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/profiles/users/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-users',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN_USER,
    },
  },
  created() {
    if (this.isNewModel) {
      this.defaultModel()
    }
  },
  methods: {
    adaptSchema(schemaDef) {
      if (!this.isNewModel) {
        schemaDef.fields.username.readonly = true
      }
      return schemaDef
    },
    getSaveData(model) {
      return {
        ...model,
        group_id: undefined,
      }
    },
  },
}
</script>
