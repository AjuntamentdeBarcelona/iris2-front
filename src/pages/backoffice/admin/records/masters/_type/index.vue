<script>
import MasterList from '~/pages/backoffice/admin/masters/_type/index'

export default {
  name: 'ThemeGroupList',
  extends: MasterList,
  data() {
    return {
      detailUrl: {
        name: 'backoffice-admin-records-masters-type-id',
        params: {
          type: this.getType(),
        },
      },
      addUrl: {
        name: 'backoffice-admin-records-masters-type-add',
        params: {
          type: this.getType(),
        },
      },
    }
  },
}
</script>
