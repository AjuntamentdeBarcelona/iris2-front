
<template>
  <div
    :class="extraClasses"
    class="record-card-form">
    <div class="col-12">
      <service-schedule />
    </div>
    <component
      v-if="definitionReady && !showLoading && !notFound"
      v-show="!isFirstInstance"
      ref="form"
      :is="formComponent"
      :definition="definition"
      :permission="editPermission"
      :initial="model"
      :url="saveUrl"
      :show-box="false"
      :title="pageTitle"
      :back-url="backUrlPath"
      :method="method"
      :save-button-text="saveButtonText"
      @form-saved="saved"
      @hook:mounted="onFormMounted"
    />
    <!-- Files field component -->
    <MountingPortal
      v-if="formRendered && useFiles"
      mount-to="#add-record-card-files"
    >

      <div
        v-if="copyFilesFrom"
        class="alert alert-info">
        {{ $t('record_card_create_will_copy') }}
      </div>
      <file-uploader
        ref="files"
        :model="recordCard"
        :origin="filesOrigin"
        :icon-name="uploaderIcon"
        :show-allowed="showAllowedExtensions"
        @component-ready="onFileUploaderReady"
      />
    </MountingPortal>
    <loader v-if="showLoading" />
    <div
      v-if="notFound"
      class="__nuxt-error-page">
      <div class="error">
        <div class="bg-danger irisbox text-white">
          <h1>{{ $t('record_error') }}</h1>
          <p>{{ notFound }}</p>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="reference"
        :alt="successMessageTitle"
        :hide-close-button="true"
        :icon="alertIcon"
        blocking
        aria-describedby="modalDescription"
        role="alertdialog"
        class="record-success-modal"
      >
        <span class="title">
          {{ successMessageTitle }}
        </span>
        <!-- Add element detail decription to the title -->
        <nuxt-link
          v-if="Object.keys(recordCard).length && !fileUploaderComponent.uploading && linkToRecord"
          :to="localePath({name: 'backoffice-records-id', params: {'id': recordCard.normalized_record_id}})"
          :title="recordCard.description"
          class="reference"
        >{{ recordCard.normalized_record_id }}</nuxt-link>
        <span
          v-else-if="Object.keys(recordCard).length"
          :title="recordCard.description"
          class="reference"
        >{{ recordCard.normalized_record_id }}</span>
        <div
          v-if="fileUploaderComponent.uploading"
          class="alert alert-info"
        >{{ $t('record_card_files_uploading') }}
          <font-awesome-icon
            icon="spinner"
            class="fa-pulse"
          />
        </div>
        <template v-else>
          <div
            v-if="fileUploaderComponent.hasErrors"
            class="alert alert-warning"
          >{{ fileUploadErrorText }}</div>
          <div
            v-else-if="fileUploaderComponent.uploadWithFullSuccess"
            class="alert alert-success"
          >{{ $t('record_card_files_success') }}</div>
          <div class="sweet-buttons">
            <button
              v-if="mustShowCreateNew && hasCreatePermission"
              slot="button-new"
              class="btn btn-light"
              autofocus
              @click="duplicate"
            >
              <font-awesome-icon icon="copy" />
              {{ $t('record_card_create_duplicate') }}
            </button>
            <button
              slot="button"
              class="btn btn-primary"
              autofocus
              @click="close"
            >
              <font-awesome-icon icon="sign-out-alt" />
              {{ continueText }}
            </button>
          </div>
        </template>
      </sweet-modal>
    </MountingPortal>
  </div>
</template>


<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import Edit from '~/components/pages/form/Edit.vue'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import RecordCardProtocol from '~/components/iris-pages/records/RecordCardProtocol.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import RegisterSelector from '~/components/iris-pages/records/registers/RegisterSelector.vue'
import Loader from '~/components/utils/Loader'
import { pad } from '~/assets/js/helpers.js'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { validators } from 'vue-form-generator'
import moment from 'moment'
import _ from 'lodash'
import FileUploader from '~/components/iris-pages/records/files/FileUploader'
import ServiceSchedule from '~/components/iris-pages/records/schedule/ServiceSchedule.vue'
import FilesType from '~/assets/js/iris2/model/FileTypes.js'
import DetailSearch from '~/components/iris-pages/themes/detail/DetailSearch.vue'
import UbicationField from '~/components/iris-pages/records/maps/UbicationField.vue'

export const WEB_DESCRIPTION_LENGTH_SETTING = 'IRIS_TEXT_VALIDACIO'
export const DEFAULT_APPLICANT_TYPE = 'DEFAULT_APPLICANT_TYPE'
export const MAX_DESCRIPTION_LENGTH = 2048
/**
 * The IRIS_TEXT_VALIDACIO comes in comma depared value. For example,
 * the 8,2 corresponds to minWords = 8 and maxLength
 */
export function getMaxLengthConfig(config) {
  if (config[WEB_DESCRIPTION_LENGTH_SETTING]) {
    let [minLen, minWords] = config[WEB_DESCRIPTION_LENGTH_SETTING].valor.split(
      ','
    )
    return {
      minWords: minWords,
      minLen: minLen,
    }
  }
}

export const TAB_LAYOUT_NAME = 'TAB-LAYOUT'
export const SUPPORT_LAYOUT = 'SUPPORT-LAYOUT'
export const DETAIL_LAYOUT = 'DETAIL-LAYOUT'
export const ATTRS = 'ATTRS-LAYOUT'
const DATE_FORMAT = 'DD/MM/YYYY'
export const addRecordForm = vm =>
  new FormDefinition(
    {
      element_detail_id: {
        component: DetailSearch,
        label: vm.$t('tree_search_label'),
        inputType: 'number',
        optionLabelAttribute: 'description',
        placeholder: vm.$t('tree_search'),
        styleClasses: 'col-12',
        isRestful: true,
        autoselectOne: true,
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
        getSaveValue(value) {
          return value ? value.id : null
        },
        getInitialOption(model) {
          if (_.isObject(model.element_detail_id)) {
            return model.element_detail_id
          }
        },
      },
      input_channel_id: {
        type: 'autocomplete',
        inputType: 'number',
        optionLabelAttribute: 'description',
        placeholder: vm.$t('create_input_channel_paceholder'),
        label: vm.$t('create_input_channel'),
        valueAttribute: 'id',
        objectValue: true,
        url: '/api/profiles/groups/input_channels/',
        styleClasses: 'col-12',
        isRestful: false,
        autoselectOne: true,
        required: true,
        getSaveValue(value) {
          return value ? value.id : null
        },
        compareFn: (a, b) => {
          return _.get(a, 'id', a) == _.get(b, 'id', b)
        },
        findParams(model) {
          return {}
        },
        getInitialOption: model => {
          return _.isObject(model.input_channel_id)
            ? model.input_channel_id
            : undefined
        },
      },
      support_id: {
        type: 'autocomplete',
        inputType: 'number',
        placeholder: vm.$t('create_support_paceholder'),
        label: vm.$t('create_support'),
        optionLabelAttribute: 'description',
        options: [],
        styleClasses: 'col-12',
        valueAttribute: 'id',
        resetOnOptionsChange: true,
        objectValue: true,
        required: true,
        forwardFields: ['input_channel_id'],
        forwardOptions: model => {
          if (_.isNumber(model.input_channel_id)) {
            return [model.support_id]
          }
          return model.input_channel_id ? model.input_channel_id.supports : []
        },
        compareFn: (a, b) => {
          return a.support == b.support
        },
        getInitialOption: model => {
          return model.support_id
        },
        getSaveValue(value) {
          return value ? value.support : null
        },
        requiredFields: ['input_channel_id'],
        isRestful: true,
        autoselectOne: true,
        valueAttribute: 'support',
      },
      applicant_type_id: {
        type: 'vuex-select',
        storeModule: 'create',
        storeGetter: 'applicantTypes',
        optionLabelAttribute: 'description',
        valueAttribute: 'applicant_type',
        id: 'applicant_type_id',
        label: vm.$t('create_applicant_type'),
        required: true,
        objectValue: true,
        styleClasses: 'col-12',
        compareFn: (a, b) => {
          return a.applicant_type == b.applicant_type
        },
        getInitialOption: model => {
          return {
            ...model.applicant_type,
            applicant_type: model.applicant_type
              ? model.applicant_type.id
              : null,
          }
        },
        getSaveValue(value) {
          return value ? value.applicant_type : null
        },
      },
      communication_media_id: {
        type: 'autocomplete-vuex-select',
        inputType: 'number',
        placeholder: vm.$t('create_comm_media_placeholder'),
        label: vm.$t('create_comm_media'),
        storeModule: 'masters',
        storeAction: 'retrieveCommunicationMedias',
        storeAttribute: 'communicationMedias',
        optionLabelAttribute: 'description',
        options: [],
        styleClasses: 'col-12',
        valueAttribute: 'id',
        getInitialOption: model => {
          return model.communication_media_id
        },
        requiredFields: ['support_id'],
        autoselectOne: true,
      },
      register_code: {
        component: RegisterSelector,
        label: vm.$t('create_register'),
        styleClasses: 'col-12',
        required: true,
      },
      communication_media_date: {
        type: 'pikaday',
        format: DATE_FORMAT,
        pikadayOptions: {
          format: DATE_FORMAT,
        },
        label: vm.$t('create_pub_date'),
        placeholder: '',
        styleClasses: 'col-12',
        validator: validators.date,
      },
      description: {
        uid: 'description',
        type: 'textarea-count',
        placeholder: vm.$t('create_comment_placeholder'),
        label: vm.$t('create_comment_label'),
        styleClasses: 'col-12 citizen-comments',
      },
      ubication: {
        uid: 'ubication',
        component: UbicationField,
        // type: 'geo-bcn',
        styleClasses: 'col-12',
        selectStair: true,
      },
      features: {
        type: 'attributes',
        styleClasses: 'col-12',
        hideGroupErrors: true,
      },
      recordcardresponse: {
        uid: 'response',
        type: 'answer',
        styleClasses: 'col-12',
        hideGroupErrors: true,
      },
      applicant_id: {
        type: 'applicant-selector',
        styleClasses: 'col-12',
        hideGroupErrors: true,
      },
      files: {
        type: 'portal-target',
        id: 'add-record-card-files',
        styleClasses: 'col-12',
      },
      protocol: {
        styleClasses: 'col-12 protocol',
        component: RecordCardProtocol,
        isField: false,
      },
      mayorship: {
        type: 'toggle',
        default: false,
        label: vm.$t('create_mayorship'),
        styleClasses: 'col-12',
      },
    },
    {
      groups: [
        {
          class: 'col-12',
          groups: [
            {
              class: 'col-xl-9 col-md-12 irisbox',
              groups: [
                {
                  layout_name: DETAIL_LAYOUT,
                  class: 'col-12',
                  legend: vm.$t('record_card_create_select_theme'),
                  fields: ['element_detail_id'],
                },
                {
                  class: 'col-12',
                  legend: vm.$t('record_card_create_comments'),
                  fields: ['description'],
                },
              ],
            },
            {
              legend: vm.$t('record_card_create_inputs'),
              class: 'col-xl-3 col-md-12 irisbox create-right',
              groups: [
                {
                  layout_name: SUPPORT_LAYOUT,
                  class: 'col-12',
                  fields: [
                    'input_channel_id',
                    'support_id',
                    'applicant_type_id',
                  ],
                },
              ],
            },
            {
              class: 'col-xl-9 col-md-12 irisbox record-config mb-md-3',
              layout_name: ATTRS,
              groups: [
                {
                  layout_name: TAB_LAYOUT_NAME,
                  class: 'col-12',
                  component: TabbedFieldset,
                  groups: [
                    {
                      tabId: 'rc_create_features',
                      class: 'col-12',
                      title: vm.$t('record_card_create_feature'),
                      fields: ['features'],
                    },
                    {
                      tabId: 'rc_create_ubication',
                      class: 'col-12',
                      title: vm.$t('record_card_create_ubication'),
                      fields: ['ubication'],
                    },
                    {
                      tabId: 'rc_create_applicant',
                      class: 'col-12',
                      title: vm.$t('record_card_create_applicant'),
                      fields: ['applicant_id'],
                    },
                    {
                      tabId: 'rc_create_answer',
                      class: 'col-12',
                      title: vm.$t('record_card_create_answer'),
                      fields: ['recordcardresponse'],
                    },
                  ],
                },
                {
                  class: 'col-12 file-upload',
                  legend: vm.$t('record_card_create_files'),
                  fields: ['files'],
                },
              ],
            },
            {
              class: 'col-xl-3 col-md-12 irisbox mb-3',
              tag: 'div',
              groups: [
                {
                  class: 'col-12',
                  groups: [
                    {
                      legend: vm.$t('record_card_create_protocol'),
                      class: 'pt-2',
                      fields: ['protocol'],
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

export const RecordCardSchemaForm = {
  name: 'RecordCardSchemaForm',
  extends: SchemaForm,
  data() {
    return {
      MEDIA_MODE: 2,
      REGISTER_MODE: 1,
      NORMAL_MODE: 0,
      mode: 0,
    }
  },
  computed: {
    pageTitle() {
      return this.$t(this.title)
    },
    supportLayout() {
      return this.schemaDef.getLayoutByName(SUPPORT_LAYOUT)
    },
    ...mapState('create', [
      'issueText',
      'channel',
      'copyFilesFrom',
      'detail',
      'applicantType',
    ]),
    ...mapGetters('create', ['applicantTypes']),
    canSetMayorship() {
      return this.hasPagePermission(Permissions.RECORD.MAYORSHIP)
    },
  },
  watch: {
    detail() {
      if (
        this.detail == null ||
        this.model.element_detail_id == null ||
        this.detail.id != this.model.element_detail_id.id
      ) {
        this.model.element_detail_id = this.detail
      }
    },
    issueText() {
      this.model.description = '' + this.issueText
    },
    /**
     * When channel is initially loaded for copy and similar, support
     * and applicant types must be adjusted.
     */
    channel() {
      if (this.channel && this.channel.supports && this.model.support_id) {
        const support = this.channel.supports.find(
          s => s.support == this.model.support_id.id
        )
        if (support) {
          this.model.support_id = {
            id: support.support,
            allow_nd: support.allow_nd,
            ...support,
          }
        }
      }
      if (this.channel && this.channel.applicant_types) {
        if (_.isNumber(this.model.applicant_type_id)) {
          const existent = this.channel.applicant_types.find(
            a => a.applicant_type == this.model.applicant_type_id
          )
          if (!existent) {
            this.model.applicant_type_id = null
          }
        }
      } else {
        this.model.applicant_type_id = null
      }
    },

    /**
     * Set default applicant type if needed.
     */
    applicantType() {
      if (this.applicantType != this.model.applicant_type_id) {
        this.model = {
          ...this.model,
          applicant_type_id: this.applicantType,
          applicant_type: this.applicantType,
        }
      }
    },
  },
  methods: {
    ...mapActions('create', ['newChannel', 'newApplicantType', 'loadDetail']),
    /**
     * Transforms initial data from url to model params. This way, some apps can redirect to RecordCard create,
     * assigning some initial params. This params are used by apps like Itaca.
     * @returns Initial data for form extracted from url params. For example, id of the object.
     */
    getUrlInitial() {
      let initial = Object.assign({}, this.$route.query, this.$route.params)
      if (initial.tematica) {
        initial.element_detail_id = parseInt(initial.tematica)
        this.loadDetail(initial.tematica)
      }
      if (initial.org) {
        initial.page_origin = initial.org
      }
      if (initial.valor) {
        initial.description =
          initial.valor && initial.valor.trim() != 'null'
            ? initial.valor.trim()
            : ''
      }
      return initial
    },
    applyInitialTransformation(initial) {
      initial.description = initial.description || ''
      return initial
    },
    /**
     * Some model updates required adapting the schema o requiring new fields.
     * - (support) Some supports require a communication media.
     * - (support) Some supports require and "instance"
     *
     * The definition must be updated only when there is a change in the mode (one of the previous cases),
     * for avoiding unnecessary form and UI updates.
     *
     * @todo only create new list when there is a change
     */
    afterUpdate(schema) {
      if (schema == 'input_channel_id') {
        this.newChannel(this.model.input_channel_id)
      } else if (
        schema == 'applicant_type_id' &&
        this.applicantType != this.model.applicant_type_id
      ) {
        this.newApplicantType(this.model.applicant_type_id)
      }
      if (schema == 'support_id' || schema == 'input_channel_id') {
        this.adjustSupportLayout()
        this.adjustChannelLayout()
      }
    },
    /**
     * Extra processing for form data before sending to the server. The features need adaptation.
     * Also the dates have to be parsed to the server format.
     */
    getSaveData(model) {
      const features = Array.isArray(model.features) ? model.features : []
      const mayorship =
        model.input_channel_id &&
        model.input_channel_id.can_be_mayorship &&
        !!model.mayorship
      let data = {
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
        mayorship: mayorship,
      }
      if (model.register_code) {
        data.register_code = model.register_code.code
      }
      if (model.communication_media_date) {
        data.communication_media_date = model.communication_media_date
          ? moment(model.communication_media_date, DATE_FORMAT).format(
              'YYYY-MM-DD'
            )
          : ''
      }
      if (!model.communication_media_id) {
        model.communication_media_id = undefined
      }
      if (_.isEmpty(model.ubication)) {
        data.ubication = undefined
      }
      data.copy_files_from = this.copyFilesFrom
      data.element_detail_id = this.detail ? this.detail.id : null
      return data
    },
    /**
     * Support defines some of the fields that are required when creating
     * a record. In base of its settings the layout must be adjusted.
     */
    adjustSupportLayout() {
      if (
        this.model.support_id &&
        this.model.support_id.communication_media_required
      ) {
        if (this.model != this.MEDIA_MODE) {
          // REQUIRES INPUT MEDIA DETAILS
          this.supportLayout.fields = [
            'input_channel_id',
            'support_id',
            'applicant_type_id',
            'communication_media_id',
            'communication_media_date',
          ]
          this.mode = this.MEDIA_MODE
        }
      } else if (
        this.model.support_id &&
        this.model.support_id.register_required
      ) {
        // REQUIRES REGISTER
        if (this.mode != this.REGISTER_MODE) {
          this.supportLayout.fields = [
            'input_channel_id',
            'support_id',
            'applicant_type_id',
            'register_code',
          ]
          this.mode = this.REGISTER_MODE
        }
      } else if (this.mode != this.NORMAL_MODE) {
        this.supportLayout.fields = [
          'input_channel_id',
          'support_id',
          'applicant_type_id',
        ]
        this.mode = this.NORMAL_MODE
      }
    },
    /**
     * If the input channel allows mayorship records, the field must be present.
     */
    adjustChannelLayout() {
      if (
        this.model.input_channel_id &&
        this.model.input_channel_id.can_be_mayorship &&
        this.canSetMayorship
      ) {
        if (this.supportLayout.fields.indexOf('mayorship') < 0) {
          this.supportLayout.fields.push('mayorship')
        }
      } else {
        const index = this.supportLayout.fields.indexOf('mayorship')
        if (index >= 0) {
          this.supportLayout.fields.splice(index, 1)
        }
      }
    },
    showSuccessMessage() {},
  },
}

export default {
  name: 'AddRecordCard',
  components: {
    'schema-form': RecordCardSchemaForm,
    FileUploader,
    Loader,
    ServiceSchedule,
  },
  extends: Edit,
  props: {
    formComponent: {
      type: [Object, String],
      default() {
        return RecordCardSchemaForm
      },
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.RECORD.CREATE,
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/',
    },
    addNewUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'record_card_create',
    },
    successUrl: {
      type: String,
      default: 'backoffice-create',
    },
    defaultDefinition: {
      type: [Object, Function],
      default: () => addRecordForm,
      required: false,
    },
    method: {
      type: String,
      default: 'post',
    },
    showCreateNew: {
      type: Boolean,
      default: true,
    },
    linkToRecord: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    let def = this.getDefaultDefinition()
    return {
      recordCard: {},
      notFound: false,
      originalDefinition: def,
      successMessageTitle: this.$t('record_card_save_success_title'),
      definition: def.clone(),
      definitionReady: false,
      saveButtonText: this.$t('form_save'),
      loading: 0,
      formRendered: false,
      fileUploaderReady: false,
    }
  },
  computed: {
    ...mapState('create', ['copyFilesFrom', 'detail']),
    ...mapGetters('groups', { hasPagePermission: 'hasPermission' }),
    mustShowCreateNew() {
      return this.showCreateNew
    },
    extraClasses() {
      return ''
    },
    continueText() {
      return this.$t('close_and_continue')
    },
    fileUploadErrorText() {
      const errors = this.fileUploaderComponent.errors.length
      const total = this.fileUploaderComponent.files.length
      return errors > 1
        ? this.$t('record_card_files_errors')
            .replace('{errors}', errors)
            .replace('{total}', total)
        : this.$t('record_card_file_error').replace('{total}', total)
    },
    alertIcon() {
      return 'success'
    },
    filesOrigin() {
      return FilesType.CREATE
    },
    uploaderIcon() {
      return undefined
    },
    showAllowedExtensions() {
      return true
    },
    useFiles() {
      return true
    },
    ...mapState({
      parameters: 'parameters',
    }),
    saveUrl() {
      return this.url
    },
    backUrlPath() {
      return this.backUrl
    },
    fileUploaderComponent() {
      return this.fileUploaderReady
        ? this.$refs.files
        : { files: [], errors: [] }
    },
    isFirstInstance() {
      return this.detail && this.detail.first_instance_response
    },
    hasCreatePermission() {
      return this.hasPagePermission(Permissions.RECORD.CREATE)
    },
  },
  /**
   * Load parameters in order to create the schema dynamically.
   * The parameters are refreshed each time in order to ensure
   * the rules are updated.
   */
  mounted() {
    this.loadDetail(null)
    this.loadConfigParams()
    this.loadDefaultApplicant()
    this.setEditMode(this.isEdit())
  },
  beforeRouteLeave(to, from, next) {
    this.beforeExit(to, from, next)
  },
  methods: {
    ...mapActions(['loadParams']),
    ...mapActions('applicant', {
      loadDefaultApplicant: 'loadDefault',
    }),
    ...mapMutations('create', {
      resetCreateState: 'resetState',
    }),
    ...mapMutations('create', ['setCopyFilesFrom', 'setEditMode']),
    ...mapMutations('create', ['setDefaultApplicantType']),
    getDefaultDefinition() {
      return _.isFunction(this.defaultDefinition)
        ? this.defaultDefinition(this)
        : this.defaultDefinition
    },
    /**
     * Handler called when the object is saved. By default it redirects to a success url, replacing the
     * current state.
     */
    saved(response, sentObj) {
      this.showReference(response.data)
      this.resetCreateState()
    },
    isEdit() {
      return false
    },
    loadConfigParams() {
      this.loading++
      this.loadParams()
        .then(config => {
          if (config) {
            const wordConf = getMaxLengthConfig(config)
            if (this.definition.fields.description) {
              this.definition.fields.description.minWords = wordConf
                ? wordConf.minWords
                : 2
              this.definition.fields.description.max = MAX_DESCRIPTION_LENGTH
              this.definition.fields.description.min = wordConf
                ? wordConf.minLen
                : 3
            }
            if (this.definition.fields.applicant) {
              this.definition.fields.applicant.default_applicant_type = 0
            }
          }
          if (this.definition.fields.ubication) {
            this.definition.fields.ubication.backup =
              this.parameters.get('ALTA_GEOBCN', '1') == '0'
            this.definition.fields.recordcardresponse.backup =
              this.parameters.get('ALTA_GEOBCN', '1') == '0'
          }
          if (!this.useFiles) {
            const layout = this.definition.getLayoutByName(ATTRS)
            if (layout) {
              layout.groups = layout.groups.filter(
                layout => layout.layout_name == TAB_LAYOUT_NAME
              )
            }
          }
          let defApplicantType = 0
          if (config[DEFAULT_APPLICANT_TYPE]) {
            defApplicantType = config[DEFAULT_APPLICANT_TYPE].valor
          }
          this.setDefaultApplicantType(parseInt(defApplicantType))
          this.definitionReady = this.onParamsReady()
        })
        .then(() => {
          this.loading--
        })
    },
    onParamsReady() {
      return true
    },
    uploadFiles() {
      if (this.fileUploaderComponent.hasFiles) {
        this.fileUploaderComponent.startUpload()
      }
    },
    showReference(recordCard) {
      this.recordCard = recordCard
      this.uploadFiles()
      this.$refs.reference.open()
    },
    close() {
      this.$refs.reference.close()
      if (
        this.fileUploaderComponent &&
        this.fileUploaderComponent.deleteAllFiles
      ) {
        this.fileUploaderComponent.deleteAllFiles()
      }
      this.gotToSuccesUrl()
    },
    gotToSuccesUrl() {
      this.$router.push(this.getSuccessUrl(this.recordCard))
    },
    getDetailPath() {
      return this.localePath({
        name: 'backoffice-records-id',
        params: { id: recordCard.id },
      })
    },
    getSuccessUrl(recordCard) {
      if (!this.hasCreatePermission) {
        return this.getDetailPath()
      }
      return this.localePath({
        name: this.successUrl,
        params: { id: recordCard.id },
        query: { lastCreated: recordCard.id },
      })
    },
    duplicate() {
      this.$router.push(
        this.localePath({
          name: 'backoffice-create-duplicate-id',
          params: {
            id: this.recordCard.normalized_record_id,
          },
        })
      )
      this.$refs.reference.close()
    },
    onFormMounted() {
      this.formRendered = true
    },
    onFileUploaderReady() {
      this.fileUploaderReady = true
    },
    beforeExit(to, from, next) {
      if (this.$refs.form) {
        this.$refs.form.beforeExit(to, from, next)
      } else {
        next()
      }
    },
  },
}
</script>

<style lang="scss">
.record-card-form {
  .tab-content {
    // Multifitxa table edit
    .VueTables--server {
      padding: 0;
      border: none;
      width: 100%;
    }

    .form-group {
      width: 100%;
    }
  }
  .citizen-comments textarea {
    min-height: 150px;
  }

  .file-upload {
    margin-top: 10px;
  }

  .record-config {
    .table-responsive {
      max-height: 500px;
      overflow: auto;
    }
  }

  .create-right .form-group.field-autocomplete.error .errors {
    top: auto;
    margin-top: 5px;
  }
}

.record-success-modal {
  .title {
    color: $primary;
    font-weight: bold;
    font-size: 1.5rem;
  }
  .reference {
    color: $primary;
    font-weight: bold;
    font-size: 1.9rem;
    clear: both;
    display: inherit;
  }
  .alert-info svg {
    vertical-align: middle;
  }
}

// .tabs {
//   .nav-tabs {
//     outline: none; // todo damia: general
//     font-size: 0.873rem;
//     &.fullexpand {
//       .nav-item {
//         flex-grow: 1;
//       }
//     }
//     .nav-item {
//       .nav-link {
//         &.error {
//           color: $danger;
//           &:after {
//             content: ' \f071';
//             font-size: 0.9em;
//             font-family: 'Font Awesome 5 Free';
//             font-weight: 900;
//           }
//         }
//         padding: 1.1rem 1rem;
//         position: relative;
//         border-radius: 0;
//         color: $primary;
//         background-color: $gray-100;
//         border: 1px solid $gray-400;
//         &:hover {
//           border-color: $gray-300;
//         }
//         &.active {
//           &.error {
//             background-color: $danger;
//             border: 1px solid $danger;
//             &:before {
//               background-color: $danger;
//             }
//             &:after {
//               color: $white;
//             }
//           }
//           background-color: $primary;
//           border: 1px solid $primary;
//           color: $white;
//           &:before {
//             content: '';
//             position: absolute;
//             left: calc(50% - 1rem);
//             top: 100%;
//             width: 1rem;
//             height: 1rem;
//             background-color: $primary;
//             transform: rotate(45deg) translateY(-0.6rem);
//           }
//         }
//       }
//       &:first-child .nav-link {
//         border-top-left-radius: $border-radius;
//       }
//       &:last-child .nav-link {
//         border-top-right-radius: $border-radius;
//       }
//     }
//   }
//   .tab-content {
//     border: 1px solid $gray-600;
//     padding: 0.5rem;
//     padding-top: 1.5rem;
//   }
// }
</style>
