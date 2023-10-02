<script>
import RecordCardEdit from '~/components/iris-pages/create/RecordCardEdit.vue'
import MultiRecordFormField from '~/components/iris-pages/records/multirecord/MultiRecordFormField.vue'
import {
  TAB_LAYOUT_NAME,
  SUPPORT_LAYOUT,
} from '~/components/iris-pages/create/AddRecordCard.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { RecordCardSchemaForm } from '~/components/iris-pages/create/AddRecordCard.vue'
import { NONE } from '~/components/iris-pages/records/AnswerConfig.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import { mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'

let MultiRecordCardSchemaForm = {
  name: 'MultiRecordCardSchemaForm',
  extends: RecordCardSchemaForm,
  props: {
    title: {
      type: String,
      default: 'Alta amb multifitxa',
    },
    method: {
      type: String,
      default: 'post',
    },
  },
  computed: {
    canAddMultirecord() {
      return this.hasPagePermission(Permissions.RECORD.MULTIRECORD)
    },
  },
  watch: {
    canAddMultirecord: {
      handler() {
        this.actionButtons = this.getDefaultButtons()
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * Handler called when the object is saved. By default it redirects to a success url, replacing the
     * current state.
     */
    onSuccess(response, sentObj) {
      if (this.successUrl) {
        this.$router.replace(this.getSuccessUrl(response.data))
      }
      this.$emit('form-saved', response, sentObj, {
        isMultirecord: this.multirecord,
      })
      this.multirecord = false
    },
    saveAndMultirecord(event) {
      this.multirecord = true
      this.submit(event)
    },
    getDefaultButtons() {
      let buttons = [
        {
          name: 'save',
          text: this.$t('form_save'),
          click: this.submit,
          icon: 'save',
          classes: 'btn-primary order-3 ',
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
      if (this.canAddMultirecord) {
        return [
          {
            name: 'save_and_multirecord',
            text: this.$t('multirecord_add'),
            click: this.saveAndMultirecord,
            icon: 'multifitxa',
            classes: 'btn-outline-secondary mx-2 order-3 ',
          },
          ...buttons,
        ]
      }
      return buttons
    },
  },
}

/**
 * Component for creating easily records from another record (recordFrom) and mantain a
 * relationship between them.
 *
 * The implementation is implimented as an edition to the recordFrom that is saved as a
 * new record, reather than an edition. For doing that, the Edit component is extended
 * customizing its metho behaviour.
 *
 * In addition, when the param is passed, the schema is adapted sligthly for adding a new
 * tab which will contain all the related records.
 */
export default {
  name: 'MultiRecordCard',
  extends: RecordCardEdit,
  props: {
    formComponent: {
      type: [Object, String],
      default() {
        return MultiRecordCardSchemaForm
      },
    },
    method: {
      type: String,
      default: 'post',
    },
    pkUrl: {
      type: String,
      default: 'api/record_cards/record_cards/retrieve/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-create',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.RECORD.CREATE,
    },
  },
  data() {
    return {
      redirectMultirecord: false,
      successMessageTitle: this.$t('record_card_save_success_title'),
      saveButtonText: this.$t('form_save'),
      originalRecord: null,
    }
  },
  computed: {
    backUrlPath() {
      return ''
    },
    continueText() {
      return this.$t(
        this.redirectMultirecord ? 'multirecord_continue' : 'close_and_continue'
      )
    },
    mustShowCreateNew() {
      return this.redirectMultirecord ? false : this.showCreateNew
    },
    originalRecordFrom() {
      return this.$route.query.multirecordFrom
        ? this.$route.query.multirecordFrom
        : null
    },
    editPermission() {
      if (this.originalRecordFrom) {
        return Permissions.RECORD.MULTIRECORD
      }
      return this.permission
    },
    getUrl() {
      if (!isNaN(this.getPkPath())) {
        return this.pkUrl + this.getPkPath()
      }
      return this.url + this.getPkPath()
    },
    /**
     * Save url must be the add url always.
     */
    saveUrl() {
      return this.url
    },
    pageTitle() {
      if (this.originalRecord) {
        return (
          this.$t('record_card_multirecord_creation') +
          ' #' +
          this.originalRecord.normalized_record_id
        )
      }
      return this.$t('record_card_create')
    },
  },
  watch: {
    originalRecordFrom() {
      if (this.originalRecordFrom) {
        this.loadInstance()
        this.loadConfigParams()
      } else {
        // Simulate loading and reset record state
        this.loading++
        this.setOriginalRecordState()
        this.loadConfigParams()
        this.$nextTick(() => {
          this.loading--
        })
      }
    },
  },
  methods: {
    ...mapMutations('create', ['setCopyFilesFrom']),
    ...mapActions('create', ['newApplicant']),
    isEdit() {
      return false
    },
    afterLoad(model) {
      if (model.record_state_id == RecordState.CLOSED.id) {
        this.notFound = this.$t('multirecord_no_from_closed')
      } else {
        this.setOriginalRecordState(model)
      }
    },
    setDefinition(model) {
      this.setOriginalRecordState(model)
    },
    /**
     * Convertst he original record received from the server into a valid
     * editable model for the AddRecordForm.
     */
    setOriginalRecordState(model) {
      if (this.originalRecordFrom) {
        // Set initial data from original record
        this.setCopyFilesFrom(model)
        this.originalRecord = model
        let editModel = {
          description: model.description,
          input_channel_id: model.input_channel.id,
          support_id: { ...model.support, support: model.support_id },
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
          applicant_id: model.request.applicant,
          applicant_type_id: model.applicant_type,
          applicant_type: model.applicant_type,
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
        if (model.applicant_type) {
          this.newApplicantType(model.applicant_type)
        }
        this.newApplicant(editModel.applicant_id)
        this.definition.fields.recordcardresponse.visited = true
        this.definition.fields.multirecords = {
          component: MultiRecordFormField,
        }

        this.setSourceReadonly(model, editModel)
        this.definition.define('input_channel_id', {
          url:
            this.definition.fields.input_channel_id.url +
            '?multirecord=' +
            this.originalRecordFrom,
        })

        const MULTIRECORD_LAYOUT = 'MULTIRECORD'
        const multirecordLayout = this.definition.getLayoutByName(
          MULTIRECORD_LAYOUT
        )
        if (!multirecordLayout) {
          const tabLayout = this.definition.getLayoutByName(TAB_LAYOUT_NAME)
          tabLayout.groups = [
            {
              layout_name: MULTIRECORD_LAYOUT,
              tabId: 'rc_create_multirecord',
              class: 'col-12',
              title: this.$t('multirecord'),
              fields: ['multirecords'],
            },
            ...tabLayout.groups,
          ]
        }
      } else {
        this.setCopyFilesFrom(null)
        this.model = {}
        this.originalRecord = null
        this.definition = this.originalDefinition.clone()
      }
    },
    saved(response, sentObj, extraOptions) {
      this.resetCreateState()
      this.redirectMultirecord = extraOptions.isMultirecord
      this.showReference(response.data)
    },
    /**
     * Override getPkPath for loading the multirecordFrom record.
     */
    getPkPath() {
      return this.originalRecordFrom
    },
    /**
     * Pass the multirecord from param when necessary
     */
    getFormExtraParams() {
      return this.originalRecord
        ? { multirecord_from: this.originalRecord.id }
        : {}
    },
    getSuccessUrl(recordCard) {
      if (this.$route.query.backTo) {
        return this.$route.query.backTo
      }
      const path = this.hasCreatePermission
        ? this.successUrl
        : 'backoffice-records-id'
      return this.localePath({
        name: path,
        params: {
          id: this.originalRecordFrom
            ? this.originalRecordFrom
            : recordCard.normalized_record_id,
        },
        query: {
          lastCreated: recordCard.normalized_record_id,
          ...(this.redirectMultirecord
            ? {
                multirecordFrom: recordCard.multirecord_from
                  ? recordCard.multirecord_from
                  : recordCard.normalized_record_id,
              }
            : {}),
        },
      })
    },
    setSourceReadonly(model, editModel) {
      this.definition.fields.input_channel_id.readonly = true
      this.definition.fields.support_id.readonly = true
      this.definition.fields.communication_media_id.readonly = true
      this.definition.fields.communication_media_date.readonly = true
      this.definition.define('communication_media', {
        label: this.definition.fields.communication_media_id.label,
      })
      for (const field of ['applicant_type_id', 'communication_media']) {
        this.definition.define(field, {
          type: 'readonly',
          styleClasses: 'col-12',
          tag: 'input',
          valueClasses: 'form-control',
          getReadValue(value, model) {
            if (!value) {
              return '-'
            }
            return value.description
          },
          getSaveValue(value) {
            return value ? value.id : null
          },
        })
      }

      const support = this.definition.getLayoutByName(SUPPORT_LAYOUT)
      support.fields = [
        ...support.fields,
        ...(model.communication_media &&
        !support.fields.includes('communication_media')
          ? ['communication_media', 'communication_media_date']
          : []),
        ...(editModel.register_code && !support.fields.includes('register_code')
          ? ['register_code']
          : []),
      ]
    },
  },
}
</script>
