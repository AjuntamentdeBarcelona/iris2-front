<script>
import RecordCardEdit from '~/components/iris-pages/create/RecordCardEdit'
import { mapState, mapActions, mapMutations } from 'vuex'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset.vue'
import {
  TAB_LAYOUT_NAME,
  DETAIL_LAYOUT,
  RecordCardSchemaForm,
  addRecordForm,
} from '~/components/iris-pages/create/AddRecordCard'
import DetailSearch from '~/components/iris-pages/themes/detail/DetailSearch.vue'

const addSurveyRecordForm = vm => {
  return new FormDefinition(
    {
      ...addRecordForm(vm).fields,
      description: {
        uid: 'description',
        type: 'textarea-count',
        label: vm.$t('comment'),
        placeholder: vm.$t('record_card_create_survey_description'),
        styleClasses: 'col-12 citizen-comments',
      },
    },
    {
      groups: [
        {
          class: 'col-12 mb-3 border',
          groups: [
            {
              class: 'col-md-12 irisbox',
              groups: [
                {
                  class: 'col-12',
                  fields: ['description'],
                },
                {
                  layout_name: TAB_LAYOUT_NAME,
                  class: 'col-12',
                  component: TabbedFieldset,
                  groups: [
                    {
                      class: 'col-12',
                      title: 'Enquesta',
                      fields: ['features'],
                    },
                    {
                      class: 'col-12',
                      title: 'Resposta',
                      fields: ['recordcardresponse'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  )
}

const SurveyCardSchemaForm = {
  name: 'SurveyCardSchemaForm',
  extends: RecordCardSchemaForm,
  props: {
    saveButtonIcon: {
      type: Array,
      default: () => ['fa', 'comment'],
    },
    pageClass: {
      type: String,
      default: 'survey',
    },
  },
}

/**
 * Special record card creation adapted for surveys. In this kind of creation, only the description
 * and features are required.
 */
export default {
  name: 'AddSurveyCard',
  components: {
    'schema-form': SurveyCardSchemaForm,
  },
  extends: RecordCardEdit,
  props: {
    title: {
      type: String,
      default: 'record_card_create_survey',
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/sources/survey/',
    },
    method: {
      type: String,
      default: 'post',
    },
    successUrl: {
      type: String,
      default: 'backoffice-dashboard',
    },
    defaultDefinition: {
      type: [Object, Function],
      default: () => addSurveyRecordForm,
    },
    formComponent: {
      type: [Object, String],
      default() {
        return SurveyCardSchemaForm
      },
    },
    permission: {
      type: String,
      required: false,
      default: '',
    },
    showCreateNew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('record_card_survey_success'),
      saveButtonText: this.$t('record_card_survey_save'),
    }
  },
  computed: {
    pageTitle() {
      return this.$t(this.title)
    },
    useFiles() {
      return false
    },
    saveUrl() {
      return this.url
    },
    ...mapState('create', ['loadingPromise']),
  },
  methods: {
    ...mapMutations('create', ['setConfigureAnswer']),
    onParamsReady() {
      this.setSurvey()
      return false
    },
    async setSurvey() {
      const detailId = Number(this.parameters['IRIS_ENQUESTA'].valor)
      // const channelId = Number(this.parameters['IRIS_ENQUESTA'].valor)
      this.loadDetail(detailId)
      this.setConfigureAnswer(true)
      await this.loadingPromise
      this.model = {
        ...this.model,
        element_detail_id: detailId,
      }
      // Remove ubication if not required
      this.definitionReady = true
    },
    ...mapActions('create', ['loadDetail']),
  },
}
</script>
