<script>
import Edit from '~/components/pages/form/Edit'
import CompanyForm from '~/components/iris-pages/create/CompanyForm'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'CompanyUpdate',
  extends: Edit,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'Edició de entitat social',
    },
    url: {
      type: String,
      default: '/api/record_cards/applicants/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-applicant',
    },
    method: {
      type: String,
      default: 'put',
    },
    formComponent: {
      type: [Object, String],
      default: () => CompanyForm,
    },
    formProps: {
      type: Object,
      default: () => ({
        backButton: true,
        formType: 'update',
      }),
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN_USERS,
    },
  },
  methods: {
    setFormData() {
      this.formData = {
        ...this.model.social_entity,
        ...this.getFormExtraParams(),
        flag_ca: this.model.flag_ca,
      }
    },
  },
}
</script>
