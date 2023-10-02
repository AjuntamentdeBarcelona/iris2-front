<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import VueFormGenerator from 'vue-form-generator'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { mapActions } from 'vuex'
import moment from 'moment'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'
import { vfgEmailRegex } from '~/assets/js/utils'
import Permissions from '~/assets/js/iris2/Permissions.js'

/**
 * A single element is returned with the others nested within it, and a recursive approach is needed
 */
export const treeToPlain = function(data) {
  let plainData = []

  const pushData = item => {
    plainData.push({ id: item.id, description: item.name })
  }

  const extractChildrenData = children => {
    children.forEach(child => {
      pushData(child)
      extractChildrenData(child.childrens)
    })
  }

  // Extract the parent element
  plainData.push({ id: data.id, description: data.name })
  // Begin the extraction from the nested structure
  extractChildrenData(data.childrens)

  plainData.sort(compareFnByDescriptionAsc)

  return plainData
}

const groupFormDefinition = vm =>
  new FormDefinition(
    {
      description: {
        type: 'input',
        inputType: 'text',
        max: 40,
        required: true,
        label: vm.$t('record_card_description'),
        placeholder: vm.$t('description'),
        styleClasses: 'col-lg-4',
        validator: VueFormGenerator.validators.string,
      },
      profile_ctrl_user_id: {
        type: 'input',
        inputType: 'text',
        max: 40,
        required: true,
        placeholder: vm.$t('record_card_profile'),
        label: vm.$t('groups_profile_ctrl_user_id'),
        styleClasses: 'col-lg-3',
        validator: VueFormGenerator.validators.string,
      },
      parent: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('groups_parent'),
        placeholder: vm.$t('please_select'),
        optionLabelAttribute: 'description',
        url: '/api/profiles/groups/',
        processAjaxResult: response => {
          return Array.isArray(response.data)
            ? response.data
            : response.data.results
              ? response.data.results.slice().sort(compareFnByDescriptionAsc)
              : [response.data]
        },
        offlineSearch: false,
        required: true,
        valueAttribute: 'id',
        values: [],
        isRestful: true,
        styleClasses: 'col-lg-4',
      },
      letter_template_id: {
        type: 'autocomplete',
        url: 'api/masters/letter-templates/',
        min: 0,
        max: 2147483647,
        label: vm.$t('groups_letter_template_id'),
        placeholder: vm.$t('id'),
        styleClasses: 'col-lg-6',
        optionLabelAttribute: 'description',
        valueAttr: 'id',
        validator: VueFormGenerator.validators.integer,
      },
      pending_shipping_days: {
        type: 'input',
        inputType: 'number',
        min: 0,
        max: 2147483647,
        label: vm.$t('groups_pending_shipping_days'),
        placeholder: vm.$t('days_cap'),
        styleClasses: 'col-lg-2',
        validator: VueFormGenerator.validators.integer,
      },
      last_pending_delivery: {
        type: 'pikaday',
        placeholder: vm.$t('please_select'),
        pikadayOptions: {
          format: 'DD/MM/YYYY',
        },
        label: vm.$t('groups_last_pending_delivery'),
        styleClasses: 'col-lg-2',
      },
      email: {
        type: 'input',
        inputType: 'email',
        label: vm.$t('email'),
        placeholder: vm.$t('email'),
        styleClasses: 'col-lg-3',
        validator: VueFormGenerator.validators.email,
      },
      signature: {
        type: 'textArea',
        max: 200,
        label: vm.$t('groups_signature'),
        placeholder: vm.$t('groups_signature'),
        styleClasses: 'col-lg-6',
        validator: VueFormGenerator.validators.string,
      },
      icon: {
        type: 'base64',
        label: vm.$t('groups_icon'),
        placeholder: vm.$t('groups_icon'),
        styleClasses: 'col-lg-3 group-icon-preview',
        previewTag: 'img',
        showMaxSize: true,
        accepts: ['image/jpg', 'image/jpeg', 'image/png'],
        maxSize: 1024 * 1.5,
        minimalMode: true,
      },
      no_reasigned: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_no_reasigned'),
        styleClasses: 'col-lg',
      },
      citizen_nd: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_citizen_nd'),
        styleClasses: 'col-lg',
      },
      certificate: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_certificate'),
        styleClasses: 'col-lg',
      },
      is_ambit: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_is_ambit'),
        styleClasses: 'col-lg',
      },
      validate_thematic_tree: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_validate_thematic_tree'),
        styleClasses: 'col-lg',
      },
      reassignments: {
        type: 'm2m-select',
        label: vm.$t('groups_reassignments_own'),
        styleClasses: 'col-12',
        allOptionsUrl: '/api/profiles/groups/tree/',
        modelAttribute: 'reasign_group',
        processApiData: treeToPlain,
        selectedOptionsSorting: compareFnByDescriptionAsc,
        labelKeySelect1: 'groups_all_groups',
        labelKeySelect2: 'groups_selected_groups_own',
      },
      can_reasign_groups: {
        type: 'm2m-select',
        label: vm.$t('groups_reassignments_others'),
        styleClasses: 'col-12',
        allOptionsUrl: '/api/profiles/groups/tree/',
        modelAttribute: 'origin_group',
        processApiData: treeToPlain,
        selectedOptionsSorting: compareFnByDescriptionAsc,
        labelKeySelect1: 'groups_all_groups',
        labelKeySelect2: 'groups_selected_groups_others',
      },
      profiles: {
        type: 'm2m-select',
        label: vm.$t('navigation_profiles'),
        styleClasses: 'col-12',
        allOptionsUrl: '/api/profiles/profiles/',
        modelAttribute: 'profile',
      },
      input_channels: {
        type: 'm2m-select',
        label: vm.$t('groups_input_channels'),
        allOptionsUrl: '/api/masters/input_channels/',
        modelAttribute: 'input_channel',
        styleClasses: 'col',
        labelKeySelect1: 'not_visible',
        labelKeySelect2: 'visible',
      },
      records_next_expire: {
        label: vm.$t('groups_records_next_expire'),
        type: 'toggle',
        default: false,
        styleClasses: 'col',
      },
      records_next_expire_freq: {
        label: vm.$t('groups_records_next_expire_freq'),
        placeholder: vm.$t('days_cap'),
        type: 'input',
        inputType: 'number',
        styleClasses: 'col',
        min: 1,
        max: 32767,
        default: 1,
        validator: VueFormGenerator.validators.integer,
      },
      pend_records: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_pend_records'),
        styleClasses: 'col',
      },
      pend_records_freq: {
        label: vm.$t('groups_records_next_expire_freq'),
        placeholder: vm.$t('days_cap'),
        type: 'input',
        inputType: 'number',
        styleClasses: 'col',
        min: 1,
        max: 32767,
        default: 1,
        validator: VueFormGenerator.validators.integer,
      },
      pend_communication: {
        type: 'toggle',
        default: true,
        label: vm.$t('groups_pend_comms'),
        styleClasses: 'col',
      },
      pend_communication_freq: {
        label: vm.$t('groups_records_next_expire_freq'),
        placeholder: vm.$t('days_cap'),
        type: 'input',
        inputType: 'number',
        styleClasses: 'col',
        min: 1,
        max: 32767,
        default: 1,
        validator: VueFormGenerator.validators.integer,
      },
      records_allocation: {
        type: 'toggle',
        default: false,
        label: vm.$t('groups_records_allocation'),
        styleClasses: 'col',
      },
      notifications_emails: {
        label: vm.$t('groups_notifications_emails'),
        type: 'tag-selector',
        tagRegex: vfgEmailRegex,
        styleClasses: 'col-12',
      },
      tree_levels: {
        label: vm.$t('groups_tree'),
        type: 'select',
        default: 0,
        selectOptions: {
          hideNoneSelectedText: true,
        },
        values: [
          {
            id: 0,
            name: vm.$t('groups_tree_itself'),
          },
          {
            id: 1,
            name: vm.$t('groups_tree_resp'),
          },
          {
            id: 2,
            name: vm.$t('groups_tree_coord'),
          },
        ],
        styleClasses: 'col-6',
      },
    },
    {
      groups: [
        {
          groups: [
            {
              class: 'col-12 mb-2',
              component: TabbedFieldset,
              groups: [
                {
                  class: 'col-12',
                  title: vm.$t('groups_section_general'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: ['description', 'parent', 'profile_ctrl_user_id'],
                    },
                    {
                      class: 'col-12',
                      fields: [
                        'no_reasigned',
                        'citizen_nd',
                        'certificate',
                        'is_ambit',
                        'validate_thematic_tree',
                        'tree_levels',
                      ],
                    },
                    {
                      class: 'col-12',
                      legend: vm.$t('groups_answer_config'),
                      groups: [
                        {
                          fields: ['letter_template_id', 'signature'],
                          class: 'col-6',
                        },
                        { fields: ['icon'], class: 'col-6' },
                      ],
                    },
                  ],
                },
                {
                  class: 'col-12 mb-2',
                  title: vm.$t('groups_section_notifications'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: [
                        'records_next_expire',
                        'records_next_expire_freq',
                      ],
                    },
                    {
                      class: 'col-12',
                      fields: ['pend_records', 'pend_records_freq'],
                    },
                    {
                      class: 'col-12',
                      fields: ['pend_communication', 'pend_communication_freq'],
                    },
                    {
                      class: 'col-12',
                      fields: ['records_allocation'],
                    },
                    {
                      class: 'col-12',
                      fields: ['notifications_emails'],
                    },
                  ],
                },
                {
                  class: 'col-12',
                  title: vm.$t('groups_section_profiles'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: ['profiles'],
                    },
                  ],
                },
                {
                  class: 'col-12',
                  title: vm.$t('groups_section_reasignments'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: ['reassignments'],
                    },
                    {
                      class: 'col-12',
                      fields: ['can_reasign_groups'],
                    },
                  ],
                },
                {
                  class: 'col-12',
                  title: vm.$t('groups_section_input_channels'),
                  groups: [
                    {
                      class: 'col-12',
                      fields: ['input_channels'],
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

export default {
  name: 'GroupForm',
  extends: SchemaForm,
  mixins: [AdminMixin],
  props: {
    url: {
      type: String,
      default: '/api/profiles/groups/',
    },
    title: {
      type: String,
      default: 'group_create',
    },
    definition: {
      type: Function,
      default: groupFormDefinition,
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-access-groups',
    },
    permission: {
      type: String,
      required: false,
      default: Permissions.APP.ADMIN,
    },
  },
  mounted() {
    this.retrieveGroups(true)
  },
  methods: {
    adaptSchema(schemaDef) {
      if (!this.isNewModel) {
        if (!this.initial.parent) {
          schemaDef.fields.parent.required = false
          schemaDef.fields.parent.disabled = true
        }
      }
    },
    applyInitialTransformation(initial) {
      initial.notifications_emails = initial.notifications_emails
        ? initial.notifications_emails.split(',')
        : []
      return initial
    },
    getSaveData(model) {
      return {
        last_pending_delivery: this.formatDate(model.last_pending_delivery),
        letter_template_id_id: model.letter_template_id,
        input_channels: model.input_channels
          ? model.input_channels.map((ic, index) => ({
              ...ic,
              order: index,
            }))
          : [],
        notifications_emails: model.notifications_emails.join(','),
      }
    },
    formatDate(model) {
      return model ? moment(model).format('YYYY-MM-DD') : null
    },
    afterSave() {
      this.retrieveGroups(true)
    },
    ...mapActions('masters', { retrieveGroups: 'retrieveGroups' }),
  },
}
</script>

<style lang="scss">
.group-icon-preview .preview {
  max-height: 210px;
}
</style>
