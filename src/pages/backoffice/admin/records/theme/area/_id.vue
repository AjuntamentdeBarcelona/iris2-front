<script>
import EditWithSublist from '~/components/pages/form/EditWithSublist.vue'
import AreaForm from './area.vue'
import ElementList from '../element/index.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  name: 'AreaUpdate',
  components: {
    ElementList: ElementList,
    AreaForm: AreaForm,
  },
  extends: EditWithSublist,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/areas/',
    },
    relatedFilterAttrName: {
      type: String,
      default: 'area_id',
    },
    title: {
      type: String,
      default: "Edició d'àrea",
    },
    formComponent: {
      type: [Object, String],
      default: () => AreaForm,
    },
    listComponents: {
      type: Array,
      default: () => ['ElementList'],
    },
    successUrl: {
      type: String,
      required: false,
      default: 'backoffice-admin-records-theme',
    },
  },
}
</script>
