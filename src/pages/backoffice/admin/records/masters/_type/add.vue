<script>
import MasterAdd from '~/pages/backoffice/admin/masters/_type/addMultDesc'

export default {
  extends: MasterAdd,
  props: {
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-masters-type',
    },
  },
}
</script>
