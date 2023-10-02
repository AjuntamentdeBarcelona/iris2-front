<script>
import Edit from '~/components/pages/form/Edit'
import FeatureForm from './add.vue'

export default {
  name: 'FeaturesUpdate',
  extends: Edit,
  props: {
    url: {
      type: String,
      default: '/api/features/features/',
    },
    formComponent: {
      type: [Object, String],
      default: () => FeatureForm,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-attributes',
    },
  },
}
</script>
