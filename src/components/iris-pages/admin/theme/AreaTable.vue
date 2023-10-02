<script>
import AreaTable from '~/pages/backoffice/admin/records/theme/index.vue'

/**
 * Order area table
 */
export default {
  name: 'AreaList',
  extends: AreaTable,
  props: {
    title: {
      type: String,
      default: 'theme_area_order',
    },
    enableSaveOrdering: {
      type: Boolean,
      default: false,
    },
    enableDowloadExcel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detailUrl: null,
      addUrl: null,
      options: {
        filterable: false,
        sortable: [],
      },
    }
  },
}
</script>
