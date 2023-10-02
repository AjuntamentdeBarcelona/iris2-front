<script>
import RecordCardEdit from '~/components/iris-pages/create/RecordCardEdit.vue'
import { RecordCardSchemaForm } from '~/components/iris-pages/create/AddRecordCard.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import {
  TAB_LAYOUT_NAME,
  DETAIL_LAYOUT,
} from '~/components/iris-pages/create/AddRecordCard.vue'
import RecordThemeLabel from '~/components/iris-pages/records/RecordThemeLabel.vue'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import checkConfirmFormMixin from '~/components/pages/checkConfirmFormMixin'
import ApplicantData from '~/components/iris-pages/records/ApplicantData.vue'

export const RecordEditForm = {
  name: 'RecordEditPageForm',
  extends: RecordCardSchemaForm,
  mixins: [checkConfirmFormMixin],
  data() {
    return {
      confirmMessage: this.$t('record_card_modify_record_card_confirm'),
      changed: false,
    }
  },
  methods: {
    /**
     * Set as readonly the fields that cannot be changed.
     */
    adaptSchema(schemaDef) {
      const readonlyComp = [
        'applicant_type_id',
        'input_channel_id',
        'support_id',
      ]
      for (let field of readonlyComp) {
        schemaDef.fields[field].readonly = true
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
    },
    /**
     * Override getSaveData for non sending fields that can't be edited and process features.
     */
    getSaveData(model) {
      // Avoid sending non editable fields
      let saveData = {}
      for (let fieldId in this.definition.fields) {
        if (this.definition.fields[fieldId].readonly) {
          saveData[fieldId] = undefined
        }
      }
      const features = Array.isArray(model.features) ? model.features : []
      return {
        input_channel: undefined,
        support_id: undefined,
        features: features.filter(
          feature =>
            !feature.isSpecial &&
            (feature.is_theme_feature || feature.is_theme_feature == undefined)
        ),
        special_features: features.filter(
          feature =>
            feature.isSpecial &&
            (feature.is_theme_feature || feature.is_theme_feature == undefined)
        ),
        ...saveData,
      }
    },
    getCheckUrl() {
      return `/api/record_cards/record_cards/${this.model.id}/update/check/`
    },
  },
}

export default {
  name: 'RecordCardEdit',
  extends: RecordCardEdit,
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
    formComponent: {
      type: [Object, String],
      default() {
        return RecordEditForm
      },
    },
    showCreateNew: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    canChangeAnswerConfig() {
      return this.hasPermission(Permissions.RECORD.UPDATE_ANSWER_CONFIG)
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
    /**
     * @return {Boolean} True if the record card is in a final state.
     */
    isClosed() {
      return (
        this.originalModel &&
        RecordState.isClosed(this.originalModel.record_state_id)
      )
    },
    /**
     * @returns {Array} List of editable fields.
     */
    editables() {
      if (this.isClosed) {
        return [this.canChangeAnswerConfig ? 'recordcardresponse' : '']
      } else {
        return [
          'description',
          'features',
          'ubication',
          this.canChangeAnswerConfig ? 'recordcardresponse' : '',
        ]
      }
    },
    useFiles() {
      return false
    },
  },
  methods: {
    ...mapActions('create', ['newChannel', 'newApplicant']),
    /**
     * Adjusts the form definition according to the record state.
     */
    setDefinition(model) {
      const detailLayout = this.definition.getLayoutByName(DETAIL_LAYOUT)
      detailLayout.legend = this.$t('record_card_theme')
      this.definition.fields.element_detail_id = this.getThemeChangeDefinition(
        model
      )
      if (this.isClosed) {
        const tabLayout = this.definition.getLayoutByName(TAB_LAYOUT_NAME)
        tabLayout.groups = [
          {
            class: 'col-12',
            title: 'Resposta',
            fields: ['recordcardresponse'],
          },
        ]
      }
      this.definition.fields.applicant_id.component = ApplicantData
      this.newChannel(model.input_channel_id)
      this.newApplicant(this.applicant)
      this.setReadonlyFields()
    },
    /**
     * Handler called when the object is saved. By default it redirects to a success url, replacing the
     * current state.
     */
    saved(response, sentObj) {
      this.showReference(response.data)
    },
    beforeExit(to, from, next) {
      if (this.$refs.form) {
        this.$refs.form.beforeExit(to, from, next)
      } else {
        next()
      }
    },
    /**
     * Returns the definition for the element detail field, which in update must be
     * edited following the Theme Change flow.
     * @returns {Object} Field definition for element_detail_id
     */
    getThemeChangeDefinition(model) {
      return {
        ...this.definition.fields.element_detail_id,
        component: RecordThemeLabel,
        isField: false,
        label: '',
        url: '/api/theme/details/change/' + model.id + '/',
      }
    },
    /**
     * Sets the editable fields according to the current state of the record.
     */
    setReadonlyFields() {
      for (let field in this.definition.fields) {
        if (this.editables.indexOf(field) < 0) {
          this.definition.fields[field].readonly = true
        }
      }
    },
  },
}
</script>
