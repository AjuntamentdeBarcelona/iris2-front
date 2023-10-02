<script>
import AddRecordCard from '~/components/iris-pages/create/AddRecordCard.vue'
import Edit from '~/components/pages/form/Edit.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { NONE } from '~/components/iris-pages/records/AnswerConfig.vue'
import { mapActions } from 'vuex'
import {
  TAB_LAYOUT_NAME,
  DETAIL_LAYOUT,
} from '~/components/iris-pages/create/AddRecordCard.vue'

export default {
  name: 'RecordCardEdit',
  extends: AddRecordCard,
  props: {
    title: {
      type: String,
      default: 'Modificar fitxa',
    },
    method: {
      type: String,
      default: 'patch',
    },
    successUrl: {
      type: String,
      default: 'backoffice-records-id',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.RECORD.UPDATE,
    },
  },
  data() {
    return {
      originalModel: {},
      successMessageTitle: this.$t('record_card_edit_record_card_success'),
      saveButtonText: this.$t('record_card_edit_record_card_action'),
    }
  },
  computed: {
    saveUrl() {
      return this.url + this.getPkPath() + '/'
    },
    pageTitle() {
      if (this.originalModel) {
        return this.title + ' #' + this.originalModel.normalized_record_id
      }
      return this.title
    },
    backUrlPath() {
      return {
        ...this.$route,
        name: 'backoffice-records-id',
      }
    },
  },
  methods: {
    ...mapActions('create', ['loadDetail', 'newApplicantType']),
    getRequestUrl(obj) {
      return this.getUrl
    },
    /**
     * If the multirecordFrom param is present, it must load the instance.
     * Otherwise, will work as normal add view.
     */
    loadInstance() {
      if (this.getPkPath()) {
        this.loading++
        return this.$axios
          .get(this.getUrl + '/')
          .then(res => {
            this.model = res.data
            this.afterLoad(this.model)
          })
          .catch(e => {
            console.log(e)
            this.notFound = this.$t('multirecord_original_not_found')
          })
          .then(() => {
            this.loading--
          })
      } else {
        return new Promise((resolve, reject) => {
          this.model = {}
          resolve()
        })
      }
    },
    /**
     * Override getPkPath for loading the record.
     */
    getPkPath() {
      return this.$route.params.id
    },
    isEdit() {
      return true
    },
    /**
     * Adapt the loaded model to an editable version with the schema.
     */
    afterLoad(model) {
      this.originalModel = { ...model }
      this.setDefinition(model)
      let editModel = {
        actions: model.actions,
        responsible_profile: model.responsible_profile,
        record_state: model.record_state,
        element_detail_id: model.element_detail,
        description: model.description,
        input_channel_id: {
          ...model.input_channel,
          applicant_types: [model.applicant_type],
        },
        applicant_id: model.request.applicant,
        applicant: model.request.applicant,
        applicant_type_id: model.applicant_type.id,
        applicant_type: model.applicant_type,
        ...(model.ubication ? { ubication: model.ubication } : {}),
        recordcardresponse:
          model.recordcardresponse != null
            ? model.recordcardresponse
            : { response_channel: NONE },
        support_id: { ...model.support, support: model.support_id },
        features: [
          ...this.mapFeatures(model.features),
          ...this.mapFeatures(model.special_features),
        ],
      }
      if (model.element_detail) {
        this.loadDetail(model.element_detail.id)
      }
      this.newApplicantType(model.applicant_type)
      this.model = this.extraModelChanges(editModel)
    },
    /**
     * Hook method for modify model on change.
     */
    extraModelChanges(model) {
      return model
    },
    mapFeatures(features) {
      return features.map(value => {
        return {
          feature: value.feature.id,
          value: value.value,
          order: value.order,
        }
      })
    },
    getSuccessUrl(recordCard) {
      return this.localePath({
        name: this.successUrl,
        params: { id: this.originalModel.normalized_record_id },
        query: { lastCreated: this.originalModel.normalized_record_id },
      })
    },
  },
}
</script>
