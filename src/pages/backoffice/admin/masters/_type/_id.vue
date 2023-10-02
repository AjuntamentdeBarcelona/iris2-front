<script>
import Edit from '~/components/pages/form/Edit'
import SimpleMasterAddMultDesc from './addMultDesc'
import SimpleMasterMixin from '~/pages/backoffice/admin/masters/SimpleMasterMixin'

export default {
  name: 'SimpleMasterUpdate',
  extends: Edit,
  mixins: [SimpleMasterMixin],
  props: {
    url: {
      type: String,
      default: '/api/masters/',
    },
    successUrl: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      dataFormComponent: SimpleMasterAddMultDesc,
    }
  },
  computed: {
    getUrl() {
      return (this.getResourceUrl() + '/' + this.getPkPath()).replace('//', '/')
    },
  },
}
</script>
