<script>
import Alert from '~/components/pages/detail/Alert.vue'

export default {
  name: 'BlockedAlert',
  extends: Alert,
  props: {
    user: {
      type: String,
      required: true,
    },
    canAddComments: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    alertMessage() {
      return this.$t('record_card_blocked_message').replace('{user}', this.user)
    },
    nonModalMessage() {
      return this.$t('record_card_blocked_by').replace('{user}', this.user)
    },
  },
}
</script>
