<script>
import Edit from '~/components/pages/form/Edit'
import Types from './types'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'

export default {
  name: 'ApplicantTypeUpdate',
  extends: Edit,
  mixins: [AdminMixin],
  layout: 'Masters',
  props: {
    title: {
      type: String,
      default: 'Edició de tipus de sol·licitant',
    },
    url: {
      type: String,
      default: '/api/masters/applicant_types/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-applicant-types',
    },
    method: {
      type: String,
      default: 'put',
    },
    formComponent: {
      type: [Object, String],
      default: () => Types,
    },
  },
}
</script>
