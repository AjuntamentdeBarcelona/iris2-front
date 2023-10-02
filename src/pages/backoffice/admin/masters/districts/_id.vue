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
      default: 'Edició de nom de districte',
    },
    url: {
      type: String,
      default: '/api/masters/districts/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-masters-districts',
    },
    method: {
      type: String,
      default: 'patch',
    },
    formComponent: {
      type: [Object, String],
      default: () => Types,
    },
  },
}
</script>
