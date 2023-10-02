<script>
import MultiRecordCard from '~/components/iris-pages/create/MultiRecordCard.vue'
// import { NONE } from '~/components/iris-pages/records/AnswerConfig.vue'
import { get } from 'lodash'
import moment from 'moment'

/**
 * Duplicate record card is an special version of AddRecordCard and MultiRecordCard on which all the fields
 * from another card less the comment are reused. The creation form is preloaded with those fields, in order to
 * create the new record, typically for creating many records from the same applicant or divide a request in many
 * concret records.
 */
export default {
  name: 'DuplicateRecordCard',
  extends: MultiRecordCard,
  props: {
    recordId: {
      type: String,
      required: true,
    },
  },
  computed: {
    /**
     * Looks for the RecordCard ID being duplicated, if there isn't, the normal create form is used.
     */
    originalRecordFrom() {
      return this.recordId
    },
    pageTitle() {
      if (this.originalRecord) {
        return (
          this.$t('record_card_create_duplicate') +
          ' #' +
          this.originalRecord.normalized_record_id
        )
      }
      return this.$t('record_card_create')
    },
    editPermission() {
      return this.permission
    },
  },
  methods: {
    /**
     * On duplication we copy all the fields except the description.
     */
    setOriginalRecordState(model) {
      if (this.originalRecordFrom) {
        this.originalRecord = model
        let editModel = {
          description: model.description,
          element_detail_id: model.element_detail,
          input_channel_id: model.input_channel.id,
          support_id: {
            ...model.support,
            support: model.support_id,
            communication_media_required:
              get(model, 'communication_media.id', null) != null,
            register_required: model.registers.length > 0,
          },
          communication_media_id: get(model, 'communication_media.id', null),
          communication_media_date: model.communication_media_date
            ? moment(model.communication_media_date, 'YYYY-MM-DD').format(
                'DD-MM-YYYY'
              )
            : null,
          register_code:
            model.registers && model.registers.length > 0
              ? model.registers[0]
              : undefined,
          applicant_id: null,
          features: [
            ...this.mapFeatures(model.features),
            ...this.mapFeatures(model.special_features),
          ],
          applicant_type: model.applicant_type,
          // recordcardresponse:
          //   model.recordcardresponse != null
          //     ? model.recordcardresponse
          //     : { response_channel: NONE },
          ...(model.ubication ? { ubication: model.ubication } : {}),
        }

        if (model.applicant_type) {
          this.newApplicantType(model.applicant_type)
        }
        this.loadDetail(model.element_detail_id)

        this.model = { ...editModel, ...this.getFormExtraParams() }
      } else {
        this.setCopyFilesFrom(null)
        this.model = {}
        this.definition = this.originalDefinition.clone()
      }
    },
    /**
     * Pass the multirecord from param when necessary
     */
    getFormExtraParams() {
      return {}
    },
  },
}
</script>
