<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import detailFormDefinition from '~/assets/js/iris2/forms/detailForm.js'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'

/**
 * Vue Component for editing objects in forms automatically generated in base of a FormDefinition object.
 * By default, this component saves the data by sending it to an endpoint via HTTP and, if success, redirects
 * to a given URL. However, it also provides many overridable methods in order to customize the flow or its actions.
 */
export default {
  name: 'AddDetailPage',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/theme/details/',
    },
    title: {
      type: String,
      default: 'Crear detall',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-theme-detail',
    },
    definition: {
      type: Function,
      default: detailFormDefinition,
      required: false,
    },
    backUrl: {
      type: String,
      default: 'backoffice-admin-records-theme-element-id',
    },
    initialReadonly: {
      type: Array,
      required: false,
      default: () => ['area_id', 'element_id'],
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('detall_save_success_title'),
    }
  },
  methods: {
    adaptSchema(schemaDef, initial) {
      schemaDef.fields.process.styleClasses = 'col-12 col-lg-4'
      schemaDef.fields.record_type_id.styleClasses = 'col-12 col-lg-4'
    },
    getSuccessUrl(newObj) {
      const elementId =
        this.$route.query.element_id || this.initialModel.element_id
      if (elementId) {
        return this.localePath({
          name: 'backoffice-admin-records-theme-element-id',
          params: { id: elementId },
        })
      } else {
        return this.localePath({
          name: this.successUrl,
          query: { id: newObj.id },
        })
      }
    },
    goBack(event) {
      if (this.initialModel.element_id != null) {
        this.$router.push(
          this.localePath({
            name: this.backUrl,
            params: {
              id: this.initialModel.element_id,
            },
          })
        )
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>
