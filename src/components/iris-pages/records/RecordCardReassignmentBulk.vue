<script>
import RecordCardReassignment from '~/components/iris-pages/records/RecordCardReassignment'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'

export default {
  name: 'RecordCardReassignmentBulk',
  extends: RecordCardReassignment,
  props: {
    propModel: {
      type: Object,
      default: () => ({ id: 0 }),
    },
    saveOnSubmit: {
      type: Boolean,
      default: false,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getDefaultButtons() {
      let buttons = [
        {
          name: 'save',
          text: this.$t('record_card_reassignment_reassign'),
          click: this.submit,
          icon: 'exchange-alt',
          classes: 'btn-primary ml-auto',
        },
      ]
      return buttons
    },
    adaptSchema(schemaDef) {
      schemaDef.fields.allow_multiderivation.disabled = false

      schemaDef.fields.next_responsible_profile.url = `/api/record_cards/record_cards/${
        this.propModel.id
      }/reasignations/`

      schemaDef.fields.next_responsible_profile.processAjaxResult = response => {
        return Array.isArray(response.data)
          ? response.data.slice().sort(compareFnByDescriptionAsc)
          : []
      }
    },
  },
}
</script>
