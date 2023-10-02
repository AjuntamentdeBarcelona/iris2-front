<script>
import RecordCardEdit from '~/components/iris-pages/create/RecordCardEdit.vue'
import { RecordCardSchemaForm } from '~/components/iris-pages/create/AddRecordCard.vue'
import TabbedFieldset from '~/components/form-generator/layout/TabbedFieldset.vue'
import {
  TAB_LAYOUT_NAME,
  DETAIL_LAYOUT,
} from '~/components/iris-pages/create/AddRecordCard.vue'
import _ from 'lodash'
import Permissions from '~/assets/js/iris2/Permissions.js'
import RecordState from '~/assets/js/iris2/model/RecordState.js'
import { setTimeout } from 'timers'

/**
 * SchemaForm for making theme change. The them change is a reduced case of theme modification,
 * which can lead to derivations and ownership changes on the record. According to that behaviour,
 * special flows and information will be given to the user.
 */
export const RecordThemeChangeForm = {
  name: 'RecordThemeChangeForm',
  extends: RecordCardSchemaForm,
  props: {
    backButton: {
      type: Boolean,
      default: false,
    },
    submitOnEnter: {
      type: Boolean,
      default: false,
    },
    checkAllRequired: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      checked: false,
      mustDerivate: false,
    }
  },
  methods: {
    /**
     * Before saving, the check url must be called.
     * @return {Boolean} True if the check has been completed
     */
    beforeSubmit() {
      this.closeAndResetModal()

      if (!this.checked) {
        this.check()
        return false
      }
      return true
    },
    /**
     * Checks if the theme change can be perfomed. If the change will trigger a group
     * change, then a modal will be displayed for asking the user if it want to transfer
     * the record to that group or mantain the ownertship.
     */
    check() {
      return this.save(
        this.constructSaveData(this.model),
        (res, obj, ins, resp) => {
          const checkData = { ...resp.data['__action__'] }
          // If check has validation error, throw an exception an process the response as an error
          this.checkValidationError(resp, checkData)
          this.checked = true
          // If the theme change implies a group change, ask the user
          if (
            checkData.next_group.id != this.model.responsible_profile.id ||
            parseInt(this.model.record_state_id) != checkData.next_state
          ) {
            this.showDerivationModal(
              checkData.next_group.id != this.model.responsible_profile.id
                ? checkData.next_group
                : null,
              parseInt(this.model.record_state_id) != checkData.next_state
                ? checkData.next_state
                : null
            )
          } else {
            // Perform the real save since it's checked
            this.submit()
          }
        }
      )
    },
    /**
     * Checks if the response from a check call has validations errors and throws an exception simulating
     * a bad request, usefull for using inside promise calls.
     * @param {Object} resp Response from a check call
     * @param {Object} checkData __actions__ form a check data call
     */
    checkValidationError(resp, checkData) {
      if (!checkData.can_perform && Object.keys(resp.data).length > 1) {
        let e = new Error()
        delete resp.data.__action__
        resp.status = 400
        e.response = resp
        throw e
      }
    },
    /**
     * Asks the user if a derivation must be done when changing the theme.
     */
    showDerivationModal(group, state) {
      let messageBody = ''
      messageBody +=
        group != null
          ? this.$t('record_card_theme_change_group_change').replace(
              '{group}',
              group.description
            )
          : ''
      messageBody +=
        state != null
          ? ' ' +
            this.$t('record_card_theme_change_group_change_state').replace(
              '{state}',
              this.$t(RecordState.findById(state, {}).title)
            )
          : ''
      messageBody +=
        ' ' + this.$t('record_card_theme_change_group_change_confirm')
      // Workaround to sweet modal bug when calling open to fast after a close
      setTimeout(() => {
        this.$refs.modalConfirm.open(
          this.$t('record_card_theme_change_group_change_title'),
          messageBody,
          changeGroup => {
            this.model.perform_derivation = changeGroup
            this.submit()
          },
          this.$t('record_card_theme_change_group_change_dont'),
          this.$t('record_card_theme_change_group_change_do'),
          true
        )
      }, 200)
    },
    /**
     * @return {String} Check url if not checked, save url otherwise
     */
    getRequestUrl(obj) {
      return this.checked ? this.url : `${this.url}check/`
    },

    /**
     * Override afterUpdate, since this does not need adjustments.
     */
    afterUpdate(schemaRef) {
      this.checked = false
    },
    confirmSubmit() {
      if (this.isReadyForSend(this.model)) {
        this.checked = false
        this.$refs.modalConfirm.reset()
        this.$refs.modalConfirm.open(
          this.$t('record_card_theme_change_title'),
          this.$t('record_card_theme_change_title'),
          () => {
            this.submit()
          }
        )
      } else {
        this.showFillAllMessage()
      }
    },
    getDefaultButtons() {
      let buttons = [
        {
          name: 'save',
          text: this.$t(this.saveButtonText),
          click: this.confirmSubmit,
          icon: this.saveButtonIcon,
          classes: 'btn-primary',
        },
      ]
      return buttons
    },
    closeAndResetModal() {
      this.$refs.modalConfirm.closeAndReset()
    },
  },
}

/**
 * Component for performing a theme change in a record.
 * It can work by loading it (passed by url) or with a record card object loaded previously.
 */
export default {
  name: 'RecordThemeChange',
  extends: RecordCardEdit,
  props: {
    title: {
      type: String,
      default: 'Canvi de temàtica',
    },
    /**
     * If the record is passed, initial record card load will be avoided.
     */
    initial: {
      type: Object,
      default: null,
      required: false,
    },
    formComponent: {
      type: [Object, String],
      default() {
        return RecordThemeChangeForm
      },
    },
    method: {
      type: String,
      default: 'post',
    },
  },
  data() {
    return {
      successMessageTitle: this.$t('record_card_theme_change_success_title'),
      saveButtonText: this.$t('record_card_theme_change_button'),
    }
  },
  computed: {
    action() {
      return _.get(this.originalModel, 'actions.theme-change', {})
    },
    saveUrl() {
      return this.action.action_url
    },
    useFiles() {
      return false
    },
    canChangeArea() {
      return this.hasPagePermission(Permissions.RECORD.CHANGE_AREA)
    },
  },
  methods: {
    /**
     * The save event must be handled by the parent component.
     */
    saved(response, sentObj) {
      this.$emit('theme-changed')
    },
    /**
     * Since we are going to change theme, we have to set it blank
     */
    extraModelChanges(model) {
      return {
        ...model,
        originalDetail: model.element_detail_id,
        record_state_id: this.originalModel.record_state_id,
        element_detail_id: null,
      }
    },
    /**
     * If there is no reassign or theme change reasons, the user can select
     * any theme from the theme.
     */
    canSelectFullTree(model) {
      return (
        _.get(model, 'actions.reasign.reason', null) == null &&
        _.get(model.actions['theme-change'], 'reason', null) == null
      )
    },
    initialFilter(item, element, area) {
      if (
        !this.canChangeArea &&
        area.id != this.originalModel.element_detail.element.area.id
      ) {
        return false
      }
      return !item.first_instance_response
    },
    /**
     * Adjust the definition for case.
     */
    setDefinition(model) {
      const editables = ['features', 'element_detail_id']
      Object.values(this.definition.fields).forEach(field => {
        if (!editables.includes(field.model) && field.required) {
          field.required = false
        } else if (field.model === 'element_detail_id') {
          field.required = true
          field.portalModal = true
        }
      })
      this.definition.fields.element_detail_id = {
        ...this.definition.fields.element_detail_id,
        autoOpen: true,
        excludeRecordTypeId: null, // Allow query theme tree
        application: null,
        noHidden: true,
        initialFilter: (item, element, area) => {
          return this.initialFilter(item, element, area)
        },
      }

      if (!this.canSelectFullTree(model)) {
        this.definition.fields.element_detail_id = {
          ...this.definition.fields.element_detail_id,
          noHidden: true,
          label: `${this.$t('record_card_theme_change_original_theme')} ${
            model.element_detail.description
          }`,
          url: '/api/theme/details/change/' + model.id + '/',
        }
      }
      model.element_detail_id = null
      model.element_detail = null
      this.definition.layout = {
        groups: [
          {
            class: 'col-12',
            groups: [
              {
                class: 'col-xl-12 col-md-12 irisbox',
                groups: [
                  {
                    layout_name: DETAIL_LAYOUT,
                    class: 'col-12',
                    legend: this.$t('record_card_select_new_theme'),
                    fields: ['element_detail_id'],
                  },
                  {
                    layout_name: TAB_LAYOUT_NAME,
                    class: 'col-xl-12 col-md-12 theme-change-config',
                    component: TabbedFieldset,
                    groups: [
                      {
                        class: 'col-12',
                        title: this.$t('record_card_attributes'),
                        fields: ['features'],
                      },
                      {
                        class: 'col-12',
                        title: this.$t('record_card_location'),
                        fields: ['ubication'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    },
  },
}
</script>

<style lang="scss">
.theme-change-config {
  .tab-content {
    max-height: 400px;
    min-height: 300px;
    overflow-y: auto;
  }
}
</style>
