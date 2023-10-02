<script>
import AddRecordCard from '~/components/iris-pages/create/AddRecordCard.vue'
import GubAddForm from '~/components/iris-pages/create/GubAddForm.vue'
import WizzardFielset from '~/components/form-generator/layout/WizzardFieldset.vue'
import GeoBcnMobile from '~/components/forms/GeoBcnMobile.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import FieldMobileApplicantSelector from '~/components/form-generator/create/FieldMobileApplicantSelector.vue'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import AutocompleteVuexSelect from '~/components/form-generator/masters/AutocompleteVuexSelect.vue'

export default {
  name: 'GubAdd',
  extends: AddRecordCard,
  props: {
    formComponent: {
      type: [Object, String],
      default() {
        return GubAddForm
      },
    },
    showCreateNew: {
      type: Boolean,
      default: false,
    },
    successUrl: {
      type: String,
      default: 'backoffice-mobile-app-dashboard',
    },
    backUrl: {
      type: String,
      default: 'backoffice-mobile-app-dashboard',
    },
    app: {
      type: String,
      default: 'gub',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.RECORD.GUB,
    },
    linkToRecord: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pageTitle() {
      return ''
    },
    ...mapGetters('create', ['applicantTypes']),
    ...mapState('create', [
      'applicant',
      'applicantType',
      'detail',
      'detailId',
      'configureAnswer',
    ]),
    ...mapState('applicant', ['defaultApplicant']),
    ...mapState('create', { loadingDetail: 'loading' }),
    configs() {
      return JSON.parse(this.parameters.get('WEB_SMARTPHONE_CONFIG', '{}'))
    },
    config() {
      return this.configs[this.app] || {}
    },
    recordTypes() {
      return (
        this.config.record_types ||
        this.parameters
          .get('PDA_CERCA_TIPUS', '0')
          .split(',')
          .map(item => parseInt(item))
      )
    },
    recordApps() {
      return (
        this.config.applications ||
        this.parameters
          .get('SISTEMES_CERCA_PDA', '1')
          .split(',')
          .map(item => parseInt(item))
      )
    },
    support() {
      return this.config.support
    },
    appApplicantType() {
      return this.config.applicant_type
    },
    fullTree() {
      return !!this.config.full_tree
    },
    uploaderIcon() {
      return ['fas', 'camera']
    },
    showAllowedExtensions() {
      return false
    },
  },
  watch: {
    loadingDetail() {
      if (this.loadingDetail) {
        this.$nuxt.$loading.start()
      } else {
        this.$nuxt.$loading.finish()
      }
    },
    appApplicantType: {
      handler() {
        this.setDefaultApplicantType(
          this.appApplicantType ? this.appApplicantType : 0
        )
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('create', ['loadDetail', 'newApplicantType']),
    getSuccessUrl(recordCard) {
      return this.localePath({
        name: this.successUrl,
        params: { app: this.app },
      })
    },
    onParamsReady() {
      const autocompletes = [
        'element_detail_id',
        'input_channel_id',
        'support_id',
        'applicant_type_id',
      ]
      autocompletes.forEach(field => {
        this.definition.define(field, {
          label: null,
          alwaysOpen: true,
        })
      })
      this.definition.define('features', {
        autoSetFields: true,
      })
      this.definition.fields.ubication.addressComponent = GeoBcnMobile
      this.definition.define('applicant_id', {
        showLast: false,
        allowTypeSelection: false,
        component: FieldMobileApplicantSelector,
        type: null,
      })
      this.definition.define('applicant_type_id', {
        component: AutocompleteVuexSelect,
        resetOnOptionsChange: false,
      })
      this.definition.define('element_detail_id', {
        noCollapse: true,
        groupByType: false,
        url: this.fullTree
          ? undefined
          : '/api/theme/details/search/?page_size=200' +
            ['', ...this.recordApps].join('&applications=') +
            ['', ...this.recordTypes].join('&record_types='),
        initialFilter: (item, element, area) => {
          return (
            !item.first_instance_response &&
            this.recordTypes.indexOf(item.record_type_id) >= 0 &&
            this.hasApplication(item)
          )
        },
      })
      this.definition.define('support_id', {
        filterFn: (options, value) => {
          return options.filter(
            item => item.support == this.support || item.id == this.support
          )
        },
      })
      this.definition.define('description', {
        type: 'textArea',
        getSaveValue(value) {
          return value || '-'
        },
      })

      this.definition.layout = {
        // class: 'col-12',
        groups: [
          {
            // class: 'col-12',
            groups: [
              {
                class: 'col-12',
                component: WizzardFielset,
                groups: [
                  {
                    uid: 'element_detail_id',
                    title: this.$t('tree_detail_selection'),
                    class: 'col-12',
                    autonext: true,
                    nextOnValidated: true,
                    fields: ['element_detail_id'],
                    checkValue: model => {
                      return this.detailId != null
                    },
                  },
                  {
                    uid: 'input_channel_id',
                    title: this.$t('gub_input_channel'),
                    class: 'col-12',
                    autonext: true,
                    fields: ['input_channel_id'],
                    checkValue: model => {
                      return model.input_channel_id != null
                    },
                  },
                  {
                    uid: 'support_id',
                    title: this.$t('gub_suport'),
                    class: 'col-12',
                    autonext: true,
                    fields: ['support_id'],
                    checkValue: model => {
                      return model.support_id != null
                    },
                  },
                  {
                    uid: 'applicant_type_id',
                    title: this.$t('gub_applicant_type'),
                    class: 'col-12',
                    autonext: true,
                    nextOnValidated: true,
                    /**
                     * Must be autoselected only if there's only an option.
                     */
                    fastForward: () => {
                      return (
                        (this.applicantType && this.applicantType.id != 0) ||
                        (this.applicantTypes && this.applicantTypes.length == 1)
                      )
                    },
                    checkValue: () => {
                      return (
                        this.applicantType ||
                        (this.applicantTypes && this.applicantTypes.length == 1)
                      )
                    },
                    fields: ['applicant_type_id'],
                  },
                  {
                    uid: 'applicant_id',
                    class: 'col-12',
                    title: this.$t('gub_applicant'),
                    autonext: true,
                    nextOnValidated: true,
                    fastForward: () => {
                      return (
                        this.defaultApplicant &&
                        this.applicant &&
                        this.applicant.id == this.defaultApplicant.id
                      )
                    },
                    /**
                     * Next if applicant is selected
                     */
                    checkValue: model => {
                      return this.applicant != null && this.applicant.id != null
                    },
                    fields: ['applicant_id'],
                  },
                  {
                    uid: 'ubication',
                    class: 'col-12 pt-0',
                    autonext: false,
                    title: this.$t('gub_ubication'),
                    nextOnValidated: true,
                    fields: ['ubication'],
                  },
                  {
                    uid: 'features',
                    class: 'col-12',
                    autonext: false,
                    title: this.$t('gub_features'),
                    fields: ['features', 'description'],
                    /**
                     * Skip when detail has not features
                     */
                    checkValue: (model, isValid) => {
                      return (
                        this.detail &&
                        (this.detail.features.length == 0 || isValid)
                      )
                    },
                  },
                  {
                    uid: 'recordcardresponse',
                    class: 'col-12',
                    title: this.$t('gub_answer'),
                    autonext: true,
                    fields: ['recordcardresponse'],
                    checkValue: (model, isValid) => {
                      return !this.configureAnswer || isValid
                    },
                  },
                  {
                    uid: 'files',
                    class: 'col-12',
                    autonext: false,
                    title: this.$t('gub_files'),
                    lazy: false,
                    fields: ['files'],
                    nextRequired: false,
                  },
                ],
              },
            ],
          },
        ],
      }
      return true
    },
    hasApplication(detail) {
      return _.intersection(detail.applications, this.recordApps).length > 0
    },
  },
}
</script>

<style lang="scss">
.mobile-layout {
  .main-mobile {
    .field-attributes {
      margin-bottom: 0px;
    }
    .citizen-comments {
      .field-wrap,
      label {
        padding-left: 15px;
        padding-right: 15px;
      }
    }
  }
}
</style>
