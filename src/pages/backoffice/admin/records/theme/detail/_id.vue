<script>
import Edit from '~/components/pages/form/Edit.vue'
import DetailEditForm from '~/components/iris-pages/admin/DetailEditForm.vue'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

export default {
  name: 'DetailUpdate',
  components: {
    DetailEditForm: DetailEditForm,
  },
  extends: Edit,
  mixins: [AdminMixin],
  props: {
    title: {
      type: String,
      default: 'Configuració de temàtica',
    },
    url: {
      type: String,
      default: '/api/theme/details/',
    },
    formComponent: {
      type: [Object, String],
      default: () => DetailEditForm,
    },
    emptyLoadingDef: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
}
</script>
