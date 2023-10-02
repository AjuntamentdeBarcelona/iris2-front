<script>
import { RecordCardSchemaForm } from '~/components/iris-pages/create/AddRecordCard.vue'

/**
 * Override parents layout adjustment methods, since its controlled by the wizard and some capabilities are removed.
 */
export default {
  extends: RecordCardSchemaForm,
  methods: {
    adjustSupportLayout() {},
    adjustChannelLayout() {},
    getDefaultButtons() {
      return []
    },
  },
}
</script>
