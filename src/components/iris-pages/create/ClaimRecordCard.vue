<script>
import MultiRecordCard from '~/components/iris-pages/create/MultiRecordCard.vue'
import Claim from '~/assets/js/iris2/model/Claim.js'
import { RecordCardSchemaForm } from '~/components/iris-pages/create/AddRecordCard.vue'
import { NONE } from '~/components/iris-pages/records/AnswerConfig.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import RecordThemeLabel from '~/components/iris-pages/records/RecordThemeLabel.vue'
import moment from 'moment'
import Permissions from '~/assets/js/iris2/Permissions.js'
import ApplicantData from '~/components/iris-pages/records/ApplicantData.vue'

/**
 * Custom form component for claiming.
 */
let ClaimRecordCardSchemaForm = {
  name: 'ClaimRecordCardSchemaForm',
  extends: RecordCardSchemaForm,
  props: {
    title: {
      type: String,
      default: '',
    },
    method: {
      type: String,
      default: 'post',
    },
  },
  methods: {
    adaptSchema(schemaDef) {
      this.setClaimRequiredFields(schemaDef)
      schemaDef.define('element_detail_id', { component: RecordThemeLabel })
    },
    afterUpdate() {},
    /**
     * Adapt schema for adjusting the mandatory fields accordint to the Claim.CLAIM_EDITABLE_FIELDS
     */
    setClaimRequiredFields(schemaDef) {
      // Fields that will be replaced with simple input display
      const readonlyComp = [
        'applicant_type_id',
        'input_channel_id',
        'support_id',
      ]
      for (let field in schemaDef.fields) {
        schemaDef.fields[field].readonly = true
        if (readonlyComp.indexOf(field) >= 0) {
          // Change schema for using a simple input
          const modelField =
            field == 'applicant_type_id' ? 'applicant_type' : field
          schemaDef.fields[field] = {
            ...schemaDef.fields[field],
            type: 'readonly',
            styleClasses: 'col-12',
            tag: 'input',
            valueClasses: 'form-control',
            getReadValue(value, model) {
              if (!model[modelField]) {
                return '-'
              }
              return model[modelField].description
            },
          }
        }
      }
      for (let field of Claim.CLAIM_EDITABLE_FIELDS) {
        schemaDef.fields[field].readonly = false
        schemaDef.fields[field].disabled = false
      }
    },
    getDefaultButtons() {
      let buttons = [
        {
          name: 'save',
          text: this.$t('record_card_claim_save'),
          click: this.submit,
          icon: 'save',
          classes: 'btn-primary order-3',
        },
      ]

      if (this.backButton) {
        buttons.push({
          name: 'exit',
          text: this.$t('form_back_without_changes'),
          click: this.goBack,
          icon: 'backward',
          classes: 'btn-light mr-auto order-1',
        })
      }
      return buttons
    },
  },
}

/**
 * Component for creating a Claim of a record card. The user must see all the fields of the original record, like the
 * normal create version of this page, but only some fields will be editable (see the Claim.CLAIM_EDITABLE_FIELDS constant).
 * In consequence, the schema must be adjusted according to that variable.
 */
export default {
  name: 'ClaimRecordCard',
  extends: MultiRecordCard,
  props: {
    recordId: {
      type: String,
      required: true,
    },
    successUrl: {
      type: String,
      default: 'backoffice-records-id',
      required: true,
    },
    formComponent: {
      type: [Object, String],
      default() {
        return ClaimRecordCardSchemaForm
      },
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.RECORD.CLAIM,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('record_card_claim_success_title'),
    }
  },
  computed: {
    mustShowCreateNew() {
      return false
    },
    alertIcon() {
      return 'warning'
    },
    editPermission() {
      if (this.originalRecordFrom) {
        return Permissions.RECORD.CLAIM
      }
      return this.permission
    },
    saveUrl() {
      if (!this.originalRecord) {
        return ''
      }
      return (this.url + this.originalRecord.id + '/claim/').replace('//', '/')
    },
    /**
     * Looks for the RecordCard ID being duplicated, if there isn't, the normal create form is used.
     */
    originalRecordFrom() {
      return this.recordId
    },
    pageTitle() {
      if (this.originalRecord) {
        return (
          this.$t('record_card_claim_create') +
          ' #' +
          this.originalRecord.normalized_record_id
        )
      }
      return this.$t('record_card_claim_create')
    },
  },
  methods: {
    isEdit() {
      return true
    },
    afterLoad(model) {
      if (
        model.record_state_id != RecordState.CLOSED.id &&
        model.record_state_id != RecordState.CANCELED.id &&
        model.record_state_id != RecordState.EXTERNAL_PROCESSING.id
      ) {
        this.notFound = this.$t('record_card_claim_invalid_state')
      } else {
        this.setOriginalRecordState(model)
      }
    },
    saved(response, sentObj, extraOptions) {
      this.showReference(response.data)
    },
    /**
     * On claim we must see all the fields, but all of them will be readonly.
     */
    setOriginalRecordState(model) {
      if (this.originalRecordFrom) {
        this.originalRecord = model
        let editModel = {
          description: model.description,
          element_detail_id: model.element_detail,
          input_channel_id: model.input_channel,
          support_id: { ...model.support, support: model.support_id },
          applicant: model.request.applicant,
          applicant_id: model.request.applicant,
          applicant_type_id: model.applicant_type.id,
          applicant_type: model.applicant_type,
          communication_media: _.get(model, 'communication_media', null),
          communication_media_id: _.get(model, 'communication_media.id', null),
          communication_media_date: model.communication_media_date
            ? moment(model.communication_media_date, 'YYYY-MM-DD').format(
                'DD-MM-YYYY'
              )
            : null,
          register_code:
            model.registers && model.registers.length > 0
              ? model.registers[0]
              : undefined,
          recordcardresponse:
            model.recordcardresponse != null
              ? model.recordcardresponse
              : { response_channel: NONE },
          ...(model.ubication ? { ubication: model.ubication } : {}),
          features: [
            ...this.mapFeatures(model.features),
            ...this.mapFeatures(model.special_features),
          ],
        }
        this.model = { ...editModel, ...this.getFormExtraParams() }
        this.loadDetail(model.element_detail.id)
        this.newApplicant(editModel.applicant_id)
        this.definition.fields.applicant_id.component = ApplicantData
        if (model.applicant_type) {
          this.newApplicantType(model.applicant_type)
        }
        this.setSourceReadonly(model, editModel)
      } else {
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
    getSuccessUrl(recordCard) {
      return this.localePath({
        name: this.successUrl,
        params: { id: recordCard.normalized_record_id },
        query: {
          lastCreated: recordCard.normalized_record_id,
        },
      })
    },
  },
}
</script>
