<script>
import EditWithSublist from '~/components/pages/form/EditWithSublist.vue'
import ElementForm from './add.vue'
import DetailList from '../detail/index.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  name: 'ElementUpdate',
  components: {
    DetailList: DetailList,
    ElementForm: ElementForm,
  },
  extends: EditWithSublist,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/elements/',
    },
    relatedFilterAttrName: {
      type: String,
      default: 'element_id',
    },
    title: {
      type: String,
      default: "Edició d'element",
    },
    formComponent: {
      type: [Object, String],
      default: () => ElementForm,
    },
    listComponents: {
      type: Array,
      default: () => ['DetailList'],
    },
  },
  methods: {
    listQueryFilters(pkParams, model) {
      let params = {
        element_id: pkParams[0],
      }
      if (model.area_id) {
        params['area_id'] = model.area_id
      }
      return Object.assign(params, this.listFilters)
    },
  },
}
</script>
