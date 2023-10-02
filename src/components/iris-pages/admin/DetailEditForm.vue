<script>
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import { validators } from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import DetailForm from '~/pages/backoffice/admin/records/theme/detail/add.vue'
import detailFormDefinition from '~/assets/js/iris2/forms/detailForm.js'
import MultiDerivation from '~/components/iris-pages/admin/MultiDerivation.vue'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset.vue'
import SpecialField from '~/components/iris-pages/admin/features/SpecialField.vue'
import FeatureIsMandatory from '~/components/iris-pages/admin/features/IsMandatory.vue'
import { mapGetters, mapActions } from 'vuex'
import { treeToPlain } from '~/pages/backoffice/admin/access/groups/group.vue'
import { compareFnByDescriptionAsc, pad } from '~/assets/js/helpers'

const EXT_EMAIL_LAYOUT = 'EXTERNAL'

function getDetailFormDefinition(vm) {
  let description = {
    type: 'textArea',
    max: 255,
    min: 3,
    label: vm.$t(`description`),
    placeholder: vm.$t('theme_description_placeholder'),
    required: true,
    validator: validators.string.locale(),
  }

  let htmlEditor = {
    type: 'wysiwyg',
    editorOptions: {
      placeholder: 'Escrigui aquí...',
      formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list'],
    },
    default: '',
    editorToolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  }

  let flag = {
    type: 'checkbox',
    default: false,
    styleClasses: 'col-12 col-lg-4',
  }

  let detailEditFormDefinition = detailFormDefinition(vm).clone()
  detailEditFormDefinition.fields.group_profiles = {
    type: 'm2m-select',
    label: vm.$t('detail_form_ambits'),
    styleClasses: 'col-12',
    allOptionsUrl: '/api/profiles/groups/tree/',
    modelAttribute: 'group',
    processApiData: treeToPlain,
    selectedOptionsSorting: compareFnByDescriptionAsc,
    labelKeySelect1: 'groups_all_groups',
    labelKeySelect2: vm.$t('detail_form_ambits_selected'),
  }
  detailEditFormDefinition.fields.autovalidate_records = {
    type: 'toggle',
    label: vm.$t('theme_autovalidate'),
    styleClasses: 'col-12',
  }
  detailEditFormDefinition.fields.active = {
    type: 'toggle',
    label: vm.$t('theme_active'),
    styleClasses: 'col-4 col-xs-12',
  }
  detailEditFormDefinition.fields.hide = {
    type: 'toggle',
    label: vm.$t('theme_hide'),
    styleClasses: 'col-4 col-xs-12',
  }
  detailEditFormDefinition.fields.activation_date = {
    type: 'pikaday',
    format: 'YYYY-MM-DD',
    pikadayOptions: {
      format: 'DD/MM/YYYY',
    },
    label: vm.$t('theme_activation_date'),
    placeholder: vm.$t('theme_activation_date_placeholder'),
    styleClasses: 'col-6 col-xs-12',
  }
  detailEditFormDefinition.fields.visible_date = {
    type: 'pikaday',
    format: 'YYYY-MM-DD',
    pikadayOptions: {
      format: 'DD/MM/YYYY',
    },
    label: vm.$t('theme_visibility_date'),
    placeholder: vm.$t('theme_visibility_date_placeholder'),
    styleClasses: 'col-6 col-xs-12',
  }
  detailEditFormDefinition.fields.keywords = {
    type: 'tag-selector',
    label: vm.$t('theme_keywords'),
    model: 'keywords',
    styleClasses: 'col-12',
  }
  detailEditFormDefinition.fields.applications = {
    type: 'select-list',
    uniqueField: 'id',
    inlineIdName: 'application',
    placeholder: 'Selecciona',
    labelField: 'description',
    label: vm.$t('theme_applications'),
    placeholder: vm.$t('theme_applications_selected'),
    required: true,
    initialValidation: true,
    url: '/api/masters/applications/',
    uid: 'applications',
    itemFormDef: new FormDefinition(
      {
        favorited: {
          type: 'favorite',
          label: vm.$t('favourite'),
        },
      },
      {
        fields: ['favorited'],
      }
    ),
    styleClasses: 'col-12',
  }
  detailEditFormDefinition.fields.features = {
    type: 'select-list',
    uniqueField: 'id',
    inlineIdName: 'feature',
    placeholder: 'Selecciona',
    labelField: 'description',
    label: vm.$t('theme_attributes'),
    placeholder: vm.$t('theme_attributes_selected'),
    url: '/api/features/features/',
    orderBy: 'order',
    itemFormDef: new FormDefinition(
      {
        is_mandatory: {
          component: FeatureIsMandatory,
          label: vm.$t('theme_attributes_mandatory'),
        },
        is_special: {
          component: SpecialField,
          label: vm.$t('theme_attributes_special'),
          readonly: true,
        },
      },
      {
        fields: ['is_mandatory', 'is_special'],
      }
    ),
    styleClasses: 'col-12',
  }

  detailEditFormDefinition.fields.theme_groups = {
    type: 'autocomplete-multiple',
    url: '/api/theme/theme_groups/',
    required: true,
    placeholder: vm.$t('select'),
    optionLabelAttribute: 'description',
    offlineSearch: false,
    valueAttribute: 'id',
    values: [],
    isRestful: true,
    objectValue: true,
    styleClasses: 'col',
    excludeSelectedValuesByField: 'id',
    styleClasses: 'col-12',
    getSaveValue(value) {
      if (!value) {
        return []
      }
      return value.map(val => {
        console.log(val)
        return {
          theme_group: val.id || val.theme_group,
        }
      })
    },
    getInitialOption(model) {
      if (!model.theme_groups) {
        return null
      }
      return model.theme_groups.map(item => {
        return {
          id: item.theme_group,
          description: item.description,
        }
      })
    },
  }

  const codiFieldsSize = 'col-xl col-sm-6'
  Object.assign(detailEditFormDefinition.fields, {
    detail_code: {
      type: 'input',
      inputType: 'input',
      label: vm.$t('theme_detail_code'),
      maxlength: 36,
      styleClasses: codiFieldsSize,
      disabled: true,
    },
    id_code: {
      type: 'input',
      inputType: 'input',
      label: vm.$t('theme_id_code'),
      maxlength: 36,
      styleClasses: codiFieldsSize,
      disabled: true,
    },
    rat_code: {
      type: 'input',
      inputType: 'text',
      label: vm.$t('theme_rat_code'),
      placeholder: vm.$t('theme_rat_code_placeholder'),
      maxlength: 90,
      styleClasses: codiFieldsSize,
    },
    similarity_hours: {
      type: 'input',
      inputType: 'number',
      min: 0,
      label: vm.$t('theme_repeat_time'),
      placeholder: vm.$t('theme_repeat_time_placeholder'),
      styleClasses: codiFieldsSize,
      validator: validators.integer,
      debounceFormatTimeout: 0,
    },
    similarity_meters: {
      type: 'input',
      inputType: 'number',
      min: 0,
      label: vm.$t('theme_repeat_meters'),
      placeholder: vm.$t('theme_repeat_meters_placeholder'),
      styleClasses: codiFieldsSize,
      validator: validators.integer,
      debounceFormatTimeout: 0,
    },
    app_resolution_radius_meters: {
      type: 'input',
      inputType: 'number',
      label: vm.$t('theme_repeat_radius'),
      placeholder: vm.$t('theme_repeat_radius_placeholder'),
      min: 0,
      styleClasses: codiFieldsSize,
      validator: validators.integer,
      debounceFormatTimeout: 0,
    },
    validation_place_days: {
      type: 'input',
      inputType: 'number',
      label: '',
      placeholder: '',
      min: 0,
      styleClasses: codiFieldsSize,
      validator: validators.integer,
      debounceFormatTimeout: 0,
    },
    sla_hours: {
      type: 'input',
      inputType: 'number',
      label: vm.$t('theme_sla_hours'),
      placeholder: vm.$t('theme_sla_hours_placeholder'),
      min: 0,
      styleClasses: codiFieldsSize,
      validator: validators.integer,
      debounceFormatTimeout: 0,
    },
    derivations: {
      title: 'Derivation',
      component: MultiDerivation,
      styleClasses: 'col-12',
      hideGroupErrors: true,
    },
    icon_name: {
      type: 'input',
      inputType: 'text',
      label: vm.$t('theme_icon_name'),
      placeholder: vm.$t('theme_icon_name'),
      min: 3,
      styleClasses: 'col-2',
      validator: validators.string,
    },
  })
  detailEditFormDefinition.fields.area_id.readonly = true
  detailEditFormDefinition.fields.element_id.readonly = true
  detailEditFormDefinition.fields.response_channels = {
    type: 'switch-response-channel',
    inputType: 'array',
    label: '',
    styleClasses: 'col-12',
    required: true,
    initialValidation: true,
  }

  const flagDescs = {
    requires_citizen: Object.assign(
      {
        label: vm.$t('theme_citizen_mandatory'),
      },
      flag
    ),
    aggrupation_first: Object.assign(
      {
        label: vm.$t('theme_aggrupation_first'),
      },
      flag
    ),
    immediate_response: Object.assign(
      {
        label: vm.$t('theme_immediate_response'),
      },
      flag
    ),
    allow_english_lang: Object.assign(
      {
        label: vm.$t('theme_english'),
      },
      flag
    ),
    first_instance_response: Object.assign(
      {
        label: vm.$t('theme_first_instance_response'),
      },
      flag
    ),
    requires_appointment: Object.assign(
      {
        label: vm.$t('theme_requires_appointment'),
      },
      flag
    ),
    allow_resolution_change: Object.assign(
      {
        label: vm.$t('theme_allow_resolution_change'),
      },
      flag
    ),
    validated_reassignable: Object.assign({}, flag, {
      label: vm.$t('theme_validated_reassignable'),
      default: true,
    }),
    sla_allows_claims: Object.assign({}, flag, {
      label: vm.$t('theme_sla_allows_claims'),
      default: true,
    }),
    allow_external: Object.assign({}, flag, {
      label: vm.$t('theme_allow_external'),
      default: false,
    }),
    custom_answer: Object.assign({}, flag, {
      label: vm.$t('theme_custom_answer'),
      default: false,
    }),
    show_pda_resolution_time: Object.assign({}, flag, {
      label: vm.$t('theme_show_pda_resolution_time'),
      default: false,
    }),
    allow_multiderivation_on_reassignment: Object.assign({}, flag, {
      label: vm.$t('theme_allow_multiderivation_on_reassignment'),
      default: false,
    }),
  }
  Object.assign(detailEditFormDefinition.fields, flagDescs)

  detailEditFormDefinition.fields.app_description = {
    ...description,
    default: '',
    required: false,
    label: '',
  }
  detailEditFormDefinition.fields.pda_description = {
    ...description,
    label: vm.$t('theme_pda_desc'),
    required: false,
  }

  detailEditFormDefinition.fields.pend_commmunications = {
    type: 'toggle',
    default: true,
    label: vm.$t('detail_pend_comms'),
    styleClasses: 'col',
  }

  function addHTMLField(vm, name) {
    detailEditFormDefinition.fields[name] = {
      ...htmlEditor,
      required: false,
      label: '',
    }
    return [name]
  }

  const gdpr = addHTMLField(vm, 'lopd')
  const head = addHTMLField(vm, 'head_text')
  const footer = addHTMLField(vm, 'footer_text')
  const email_templates = addHTMLField(vm, 'email_template')
  const sms_templates = addHTMLField(vm, 'sms_template')

  const selectors = {
    external_service_id: {
      type: 'vuex-select',
      label: vm.$t('theme_external_service'),
      storeAttribute: 'externalServices',
      storeModule: 'masters',
      storeAction: 'retrieveExternalServices',
      styleClasses: 'col-6 col-lg-3',
      optionLabelAttribute: 'name',
      required: false,
    },
    external_email: {
      type: 'input',
      inputType: 'email',
      label: vm.$t('theme_external_service_email'),
      placeholder: 'Email',
      styleClasses: 'col-6 col-lg-3',
      validator: validators.email,
    },
    external_protocol_id: {
      type: 'autocomplete-vuex-select',
      label: vm.$t('theme_protocol'),
      storeModule: 'masters',
      storeAction: 'retrieveProtocols',
      storeAttribute: 'protocols',
      nameAttribute: 'full_description',
      optionLabelAttribute: 'full_description',
      valueAttribute: 'protocol_id',
      placeholder: vm.$t('select'),
      validator: validators.string,
      required: false,
      styleClasses: 'col-8 col-md-6',
    },
    ubication: {
      type: 'multi-attribute-select',
      label: vm.$t('theme_ubication'),
      styleClasses: 'col-6 col-lg-4',
      options: {
        np: {
          name: 'no_require_ubication',
          modelValue: {
            requires_ubication: false,
            requires_ubication_full_address: false,
            requires_ubication_district: false,
          },
        },
        address: {
          name: 'require_ubication_address',
          modelValue: {
            requires_ubication: true,
            requires_ubication_full_address: false,
            requires_ubication_district: false,
          },
        },
        district: {
          name: 'require_ubication_district',
          modelValue: {
            requires_ubication: false,
            requires_ubication_full_address: false,
            requires_ubication_district: true,
          },
        },
      },
    },
    open_data: {
      type: 'multi-attribute-select',
      label: 'OpenData',
      styleClasses: 'col-6 col-lg-4',
      options: {
        np: {
          name: 'open_data_not_publish',
          modelValue: {
            allows_open_data: false,
            allows_open_data_sensible_location: false,
            allows_open_data_location: false,
          },
        },
        pwl: {
          name: 'open_data_publish_without_loc',
          modelValue: {
            allows_open_data: true,
            allows_open_data_sensible_location: false,
            allows_open_data_location: false,
          },
        },
        pl: {
          name: 'open_data_publish_loc',
          modelValue: {
            allows_open_data: true,
            allows_open_data_sensible_location: false,
            allows_open_data_location: true,
          },
        },
        pls: {
          name: 'open_data_publish_sensible',
          modelValue: {
            allows_open_data: true,
            allows_open_data_sensible_location: true,
            allows_open_data_location: true,
          },
        },
      },
      default: {
        allows_open_data: false,
        allows_open_data_sensible_location: false,
        allows_open_data_location: false,
      },
    },
    ssi: {
      type: 'multi-attribute-select',
      label: vm.$t('theme_ssi'),
      styleClasses: 'col-6 col-lg-4',
      options: {
        np: {
          name: 'ssi_not_publish',
          modelValue: {
            allows_ssi: false,
            allows_ssi_sensible_location: false,
          },
        },
        pwl: {
          name: 'ssi_publish_without_loc',
          modelValue: {
            allows_ssi: true,
            allows_ssi_sensible_location: false,
            allows_ssi_location: false,
          },
        },
        pls: {
          name: 'ssi_publish_loc',
          modelValue: {
            allows_ssi: true,
            allows_ssi_location: true,
          },
        },
      },
      default: {
        allows_ssi: false,
        allows_ssi_location: false,
      },
    },
  }
  Object.assign(detailEditFormDefinition.fields, selectors)

  for (let field in detailEditFormDefinition.fields) {
    if (!detailEditFormDefinition.fields[field].styleClasses) {
      detailEditFormDefinition.fields[field].styleClasses = 'col-12 col-lg-4'
    }
  }

  detailEditFormDefinition.layout = {
    fields: [],
    class: 'row',
    groups: [
      {
        groups: [
          {
            component: TabbedFieldset,
            vertical: false,
            class: 'col-12',
            groups: [
              {
                title: vm.$t('descriptions'),
                groups: [
                  {
                    legend: vm.$t('theme_theme'),
                    fields: ['element_id', 'area_id'],
                    class: 'col-12',
                  },
                  {
                    legend: vm.$t('theme_short_descriptions'),
                    class: 'col-12',
                    fields: ['short_description'],
                  },
                  {
                    legend: vm.$t('theme_long_descriptions'),
                    fields: ['description'],
                    class: 'col-12 external-desc',
                  },
                  {
                    legend: vm.$t('theme_app_descriptions'),
                    fields: ['app_description'],
                    class: 'col-12 small-desc',
                  },
                ],
              },
              {
                title: vm.$t('configurations'),
                groups: [
                  {
                    layout_name: EXT_EMAIL_LAYOUT,
                    legend: vm.$t('theme_configuration'),
                    fields: [
                      'pda_description',
                      'record_type_id',
                      'process',
                      'external_protocol_id',
                      'external_service_id',
                      'external_email',
                    ],
                    class: 'col-12 small-desc',
                  },
                  {
                    legend: vm.$t('groups_icon'),
                    class: 'code-fields col-12',
                    fields: ['icon_name'],
                  },
                  {
                    legend: vm.$t('theme_codes'),
                    class: 'code-fields col-12',
                    fields: [
                      'id_code',
                      'detail_code',
                      'rat_code',
                      'similarity_hours',
                      'similarity_meters',
                      'app_resolution_radius_meters',
                      'sla_hours',
                      'autovalidate_records',
                    ],
                  },
                  {
                    legend: vm.$t('theme_checks'),
                    class: 'checkbox-cloud ml-2 mb-3',
                    fields: Object.keys(flagDescs),
                  },
                ],
              },
              {
                title: vm.$t('derivations'),
                groups: [
                  {
                    legend: vm.$t('derivations'),
                    fields: ['ubication', 'derivations'],
                    class: 'col-12 module',
                  },
                ],
              },
              {
                title: vm.$t('theme_advanced'),
                class: 'col-12',
                groups: [
                  {
                    legend: vm.$t('theme_response_channel'),
                    fields: ['response_channels'],
                    class: 'col-12',
                  },
                  {
                    legend: '',
                    fields: ['features'],
                    class: 'col-12 module applications-module',
                  },
                  {
                    legend: '',
                    class: 'selectors col-12',
                    fields: ['open_data', 'ssi'],
                  },
                ],
              },
              {
                title: vm.$t('detail_form_aggrupations'),
                groups: [
                  {
                    legend: vm.$t('detail_form_groups'),
                    fields: ['theme_groups'],
                    class: 'col-12 module',
                  },
                  {
                    legend: vm.$t('detail_form_keywords'),
                    fields: ['keywords'],
                    class: 'col-12',
                  },
                  {
                    legend: '',
                    fields: ['applications'],
                    class: 'col-12 module applications-module',
                  },
                ],
              },
              {
                title: vm.$t('detail_form_template'),
                groups: [
                  {
                    legend: vm.$t('detail_form_email_template'),
                    fields: email_templates,
                    class: 'col-12 module small-desc',
                  },
                  {
                    legend: vm.$t('detail_form_sms_template'),
                    fields: sms_templates,
                    class: 'col-12 module small-desc',
                  },
                  {
                    legend: vm.$t('detail_form_head'),
                    fields: head,
                    class: 'col-12 module small-desc',
                  },
                  {
                    legend: vm.$t('detail_form_footer'),
                    fields: footer,
                    class: 'col-12 module small-desc',
                  },
                  {
                    legend: vm.$t('detail_form_gdpr'),
                    fields: gdpr,
                    class: 'col-12 module small-desc',
                  },
                ],
              },
              {
                title: vm.$t('visibility'),
                groups: [
                  {
                    legend: vm.$t('detail_form_activation'),
                    fields: ['active', 'activation_date'],
                    class: 'col-12',
                  },
                  {
                    legend: vm.$t('detail_form_theme_visibility'),
                    fields: ['hide', 'visible_date'],
                    class: 'col-12',
                  },
                  {
                    legend: vm.$t('detail_form_theme_visibility'),
                    fields: ['group_profiles'],
                    class: 'col-12',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
  return detailEditFormDefinition.translatable(vm, [
    'app_description',
    'lopd',
    'head_text',
    'email_template',
    'sms_template',
    'footer_text',
  ])
}

export default {
  name: 'DetailUpdateForm',
  extends: DetailForm,
  props: {
    definition: {
      type: Function,
      default: getDetailFormDefinition,
      required: false,
    },
    updateWithSaveData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      oldProcess: null,
      actionButtons: this.getDefaultButtons()
        .filter(button => button.name != 'save_and_add')
        .concat([
          {
            name: 'save_and_stay',
            text: this.$t('form_save_and_stay'),
            click: this.saveAndAnother,
            icon: 'plus',
            classes: 'btn-primary',
          },
        ]),
    }
  },
  computed: {
    ...mapGetters('masters', ['processRequires', 'processDisabled']),
  },
  created() {
    this.retrieveProcesses().then(() => {
      this.adaptSchemaToModel(this.schemaDef, 'visible_date', this.model)
      this.adaptSchemaToModel(this.schemaDef, 'immediate_response', this.model)
      this.adjustProcess(this.model, this.schemaDef)
    })
  },
  methods: {
    ...mapActions('masters', ['retrieveProcesses']),
    adaptSchema(schemaDef, initial) {},
    /**
     * Values are received as a list that must be classified according to its state.
     */
    groupDerivations() {
      const values = {}
      for (let state of Object.keys(this.derivableStates)) {
        values[state] = {
          state: state,
          initial: this.derivableStates[state].initial,
          description: this.derivableStates[state].description,
          id: this.model.id,
          district_derivations: this.model.district_derivations.filter(
            item => item.record_state == parseInt(state)
          ),
          direct_derivations: this.model.direct_derivations.filter(
            item => item.record_state == parseInt(state)
          ),
          polygon_derivations: this.model.polygon_derivations.filter(
            item => item.record_state == parseInt(state)
          ),
        }
      }
      this.model.derivations = values
    },
    getDerivationType(grouped, derivations, type) {
      derivations.forEach(d => {
        if (!grouped[d.record_state]) {
          grouped[d.record_state] = {}
        }
        grouped[d.record_state]
      })
    },

    /**
     * Override submit method from SchemaForm in order to implement the check and save
     * behaviour of the detail edit. This submit versions launches the check and then
     * the final submit is performed depending on the result.
     */
    submit(event, onSuccess) {
      if (this.isReadyForSend(this.model)) {
        if (this.beforeSubmit(this.model)) {
          this.checkSave(onSuccess)
        }
        return false
      }
      this.showNotReadyMessage()
      return false
    },
    /**
     * On DetailEditForm the submit is separated in two phases, check and save.
     * This method implements the final save.
     */
    submitAfterConfirm(onSuccess) {
      if (this.saveOnSubmit) {
        return this.save(this.constructSaveData(this.model), onSuccess)
      } else {
        this.$emit('submit', this.model)
        return true
      }
    },
    /**
     * Before saving, the app must shown a message indicating if the theme
     * can be activated.
     */
    checkSave(onSuccess) {
      this.saving = true
      this.$axios
        .post(
          this.getRequestUrl() + 'check/',
          this.constructSaveData(this.model)
        )
        .then(resp => {
          if (resp.data.will_be_active) {
            // Save and activate
            this.showSaveConfirmationMessage(
              this.$t('detail_active'),
              onSuccess
            )
          } else if (resp.data.mandatory_fields_missing) {
            // Try to activate but there are fields missing
            this.showMissingFieldsForActivation(
              resp.data.mandatory_fields_missing,
              onSuccess
            )
          } else {
            this.showSaveConfirmationMessage(
              this.$t('detail_non_active'),
              onSuccess
            )
          }
        })
        .catch(result => {
          let resp = result.response.data
          if (resp.requires_ubication_district) {
            result.response.data = {
              ubication: resp.requires_ubication_district,
              ...resp,
            }
            delete result.response.data['requires_ubication_district']
          }
          this.processErrorResponse(result)
        })
        .then(result => {
          this.saving = false
        })
    },
    /**
     * Show a modal indicating that changes will be saved and the detail will be active.
     */
    showSaveConfirmationMessage(msg, onSuccess) {
      this.$refs.modalConfirm.open(
        msg,
        msg,
        () => {
          this.submitAfterConfirm(onSuccess)
        },
        this.$t('form_cancel_and_stay'),
        this.$t('form_save')
      )
    },
    /**
     * Show a modal indicating that some fields are missing for the detail, but a intermediate version
     * of it can be save without activation.
     */
    showMissingFieldsForActivation(missingFields, onSuccess) {
      this.$refs.modalConfirm.open(
        this.$t('detail_activate_missing'),
        this.$t('detail_activate_missing'),
        () => {
          this.submitAfterConfirm(onSuccess)
        },
        this.$t('form_cancel_and_stay'),
        this.$t('form_save')
      )
    },
    applyInitialTransformation(initial) {
      initial.hide = !initial.visible
      initial.custom_answer = !initial.custom_answer // We have to change the value, false if uses own answer
      initial.id_code = pad(initial.id, 7)
      return initial
    },
    getSaveData(data) {
      data.features = data.features || []
      data.applications = data.applications || []
      return {
        visible: data.hide != undefined ? !data.hide : true,
        external_email: data.external_email == null ? '' : data.external_email, // NULL not allowed, send blank
        custom_answer: !data.custom_answer, // We have to change the value, false if uses own answer
        features: data.features.map(feature => {
          return {
            ...feature,
            is_mandatory: feature.is_mandatory || false,
          }
        }),
        applications: data.applications.map(application => {
          return {
            favorited: false,
            ...application,
          }
        }),
        ...this.getDerivationData(),
      }
    },
    /**
     * Convert derivation data to expected server data.
     * Multiderivation data is stored as an object indexed by state.
     * The server expects three arrays with the different derivations.
     */
    getDerivationData() {
      if (!this.model.derivations) {
        return {}
      }
      const states = Object.keys(this.model.derivations).map(item =>
        parseInt(item)
      )
      let saveData = {},
        district = [],
        direct = [],
        polygon = []
      for (let state of Object.values(this.model.derivations)) {
        district = district.concat(
          state.district_derivations.filter(item => item.group != null)
        )
        direct = direct.concat(
          state.direct_derivations.filter(item => item.group != null)
        )
        polygon = polygon.concat(
          state.polygon_derivations.filter(item => item.group != null)
        )
      }
      saveData.district_derivations = [
        ...this.model.district_derivations.filter(
          item => states.indexOf(parseInt(item.record_state)) < 0
        ),
        ...district,
      ]
      saveData.direct_derivations = [
        ...this.model.direct_derivations.filter(
          item => states.indexOf(parseInt(item.record_state)) < 0
        ),
        ...direct,
      ]
      saveData.polygon_derivations = [
        ...this.model.polygon_derivations.filter(
          item => states.indexOf(parseInt(item.record_state)) < 0
        ),
        ...polygon,
      ]
      return saveData
    },
    afterUpdate(field) {
      this.adaptSchemaToModel(this.schemaDef, field, this.model)
    },
    adaptSchemaToModel(schemaDef, field, model) {
      if (field == 'immediate_response') {
        schemaDef.fields.external_protocol_id.required =
          model.immediate_response
      }
      if (field == 'hide' || field == 'visible_date') {
        // If permanent hide is on, visible_date not makes sense
        schemaDef.fields.visible_date = {
          ...schemaDef.fields.visible_date,
          disabled: model.hide,
        }
      }
      if (field == 'process') {
        // Hide external_email if not mandatory
        if (model.process && model.process != this.oldProcess) {
          this.adjustProcess(model, schemaDef)
        }
      }
    },
    /**
     * Sets the current process required fields.
     */
    adjustProcess(model, schemaDef) {
      this.adjustProcessFields('processRequires', 'required', schemaDef, model)
      this.adjustProcessFields('processDisabled', 'disabled', schemaDef, model)
      this.oldProcess = model.process
    },
    /**
     * Adjust fields schema bassed on process requirements (required/disabled).
     * @param {String} method Component method for retriving the field list (processRequires, processDisabled)
     * @param {String} attr Schema attribute for adjusting (required, disabled)
     */
    adjustProcessFields(method, attr, schemaDef, model) {
      if (this.oldProcess) {
        for (let req of this[method](this.oldProcess)) {
          schemaDef.define(req, { [attr]: false })
        }
      }
      for (let req of this[method](model.process)) {
        schemaDef.define(req, { [attr]: true })
        if (attr == 'disabled') {
          this.model[req] = null
        }
      }
    },
    showNotReadyMessage() {
      if (this.hasDerivationErrors()) {
        this.$notify({
          group: 'iris',
          title: this.$t('detail_select_derivation_options'),
          type: 'error',
          text: '',
        })
      }
      // Call parent method
      SchemaForm.methods.showNotReadyMessage.apply(this)
    },
    hasDerivationErrors() {
      for (let field in ['direct_derivations', 'district_derivations']) {
        if (Array.isArray(this.model[field]) && this.model[field].length > 0) {
          return false
        }
      }
      return true
    },
  },
}
</script>

<style lang="scss" >
.vue-form-generator .checkbox-cloud .form-group {
  min-height: auto;
  display: flex;
  label {
    order: 2;
    margin-top: -0.2em;
  }
}

.applications-module {
  min-height: 300px;
}

.vue-form-generator .external-desc textarea {
  min-height: 140px;
}

.vue-form-generator
  .small-desc
  .form-group.field-textArea
  textarea.form-control {
  height: 42px;
}

.vue-form-generator .small-desc .ql-editor {
  min-height: 80px;
  font-size: 1rem;
  height: 80px;
}

.derivations-module .tab-pane .row > .form-group:not(.field-checkbox) {
  padding: 0;
  margin: 0;
}

.derivations-module .tab-pane .row .nested-form .form-group {
  padding-bottom: 10px;
}

.derivations-module .tabbed-fieldset {
  margin-bottom: 10px;
}

.derivations-module .tabs {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
