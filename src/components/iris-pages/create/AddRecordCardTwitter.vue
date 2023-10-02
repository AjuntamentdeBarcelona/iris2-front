<script>
import RecordCardEdit from '~/components/iris-pages/create/RecordCardEdit'
import { mapState, mapActions } from 'vuex'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import { pad } from '~/assets/js/helpers.js'
import {
  TAB_LAYOUT_NAME,
  DETAIL_LAYOUT,
  RecordCardSchemaForm,
} from '~/components/iris-pages/create/AddRecordCard'
import { twitterElementdetailParameter } from '~/assets/js/iris2/constants'
import Permissions from '~/assets/js/iris2/Permissions.js'
import DetailSearch from '~/components/iris-pages/themes/detail/DetailSearch.vue'

const addRecordForm = vm => {
  return new FormDefinition(
    {
      next_theme_id: {
        uid: 'next_theme_id',
        component: DetailSearch,
        label: vm.$t('tree_search_label'),
        inputType: 'number',
        optionLabelAttribute: 'description',
        placeholder: vm.$t('tree_search'),
        styleClasses: 'col-12',
        isRestful: true,
        autoselectOne: true,
        syncstore: false,
        objectValue: true,
        getOptionLabel(option) {
          const text = option.id
            ? `${pad(option.id, 7)} | ${option.description}`
            : ''
          if (option.is_visible != undefined && !option.is_visible) {
            return text + vm.$t('tree_hidden')
          }
          return text
        },
        getInitialOption(model) {
          if (_.isObject(model.next_theme_id)) {
            return model.next_theme_id
          }
        },
      },
      description: {
        uid: 'description',
        type: 'textArea',
        label: vm.$t('twitter_hint'),
        placeholder: vm.$t('twitter_hint_placeholder'),
        styleClasses: 'col-12 citizen-comments',
        required: false,
      },
      features: {
        type: 'attributes',
        styleClasses: 'col-12',
        hideGroupErrors: true,
      },
    },
    {
      groups: [
        {
          class: 'col-12 mb-3 border border-twitter',
          groups: [
            {
              class: 'col-md-12 irisbox',
              groups: [
                {
                  layout_name: DETAIL_LAYOUT,
                  class: 'col-12',
                  legend: vm.$t('tree_search_select'),
                  fields: ['next_theme_id'],
                },
                {
                  class: 'col-12',
                  legend: vm.$t('twitter_hint_label'),
                  fields: ['description'],
                },
              ],
            },
            {
              class: 'col-12 irisbox',
              groups: [
                {
                  layout_name: TAB_LAYOUT_NAME,
                  class: 'col-12 record-config',
                  groups: [
                    {
                      class: 'col-12',
                      title: vm.$t('create_attributs'),
                      fields: ['features'],
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

const AdaptedRecordCardSchemaForm = {
  name: 'RecordCardTwitterForm',
  extends: RecordCardSchemaForm,
  props: {
    saveButtonIcon: {
      type: Array,
      default: () => ['fab', 'twitter'],
    },
    pageClass: {
      type: String,
      default: 'twitter',
    },
  },
  computed: {
    ...mapState({
      parameters: 'parameters',
    }),
  },
  methods: {
    afterUpdate(schema, newVal) {
      if (schema == 'next_theme_id') {
        this.model[schema] = newVal.id
        this.emitModelUpdated(this.model)
      }
    },
  },
}

export default {
  name: 'AddRecordCardTwitter',
  components: {
    'schema-form': AdaptedRecordCardSchemaForm,
  },
  extends: RecordCardEdit,
  props: {
    title: {
      type: String,
      default: 'record_card_create',
    },
    showCreateNew: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/sources/twitter/',
    },
    method: {
      type: String,
      default: 'post',
    },
    successUrl: {
      type: String,
      default: 'backoffice-twitter-create',
    },
    defaultDefinition: {
      type: [Object, Function],
      default: () => addRecordForm,
    },
    formComponent: {
      type: [Object, String],
      default() {
        return AdaptedRecordCardSchemaForm
      },
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.RECORD.CREATE_TWITTER,
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('record_card_save_success_title'),
      saveButtonText: this.$t('form_save'),
    }
  },
  computed: {
    pageTitle() {
      return this.$t(this.title) + ' (via Twitter)'
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
    onParamsReady() {
      this.setTwitterElementDetail()
      return false
    },
    async setTwitterElementDetail() {
      const detailId = Number(
        this.parameters[twitterElementdetailParameter].valor
      )
      this.loadDetail(detailId)
      await this.loadingPromise
      this.model = {
        ...this.model,
        element_detail_id: detailId,
      }
      this.definition.define('next_theme_id', {
        exclude_record_type_id: 5,
        application: this.parameters.get('TWITTER_THEME_APPLICATION', 1),
      })
      this.definitionReady = true
    },
    /**
     * Handler called when the object is saved. By default it redirects to a success url, replacing the
     * current state.
     */
    saved(response, sentObj) {
      this.showReference(response.data)
      this.definitionReady = false
      this.setTwitterElementDetail()
      this.model = {}
    },
    ...mapActions('create', ['loadDetail']),
  },
}
</script>
