<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import ConfirmButton from '~/components/forms/buttons/ConfirmButton'
import { pad } from '~/assets/js/helpers'
import { isObject } from 'lodash'

const formDefinition = vm =>
  new FormDefinition(
    {
      reasignation_detail_id: {
        type: 'detail-selector',
        portalModal: true,
        inputType: 'number',
        label: vm.$t('detail_replace_with'),
        optionLabelAttribute: 'description',
        placeholder: 'Cerca per paraula clau o amb un ID',
        url: '/api/theme/details/search/',
        styleClasses: 'col-12',
        isRestful: true,
        autoselectOne: true,
        objectValue: true,
        getOptionLabel(option) {
          const text = option.id
            ? `${pad(option.id, 7)} | ${option.description}`
            : ''
          if (option.is_visible != undefined && !option.is_visible) {
            return text + ` (${vm.$t('detail_hidden')})`
          }
          return text
        },
        getSaveValue(value) {
          return value ? value.id : null
        },
        getInitialOption(model) {
          if (isObject(model.element_detail_id)) {
            return model.element_detail_id
          }
        },
      },
      only_open: {
        type: 'select',
        values: [
          { id: true, name: vm.$t('groups_open_rc') },
          { id: false, name: vm.$t('groups_all_rc') },
        ],
        default: true,
        required: true,
        selectOptions: {
          hideNoneSelectedText: true,
        },
        label: vm.$t('groups_rc_to_reassign'),
        styleClasses: 'col',
      },
    },
    {
      groups: [
        {
          class: 'col-12',
          fields: ['reasignation_detail_id'],
        },
        {
          class: 'col-12',
          fields: ['only_open'],
        },
      ],
    }
  )

export default {
  name: 'DetailDeleteForm',
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/theme/details/delete/',
    },
    deleteId: {
      type: Number,
      required: true,
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
    saveButtonText: {
      type: String,
      default: 'delete',
    },
  },
  data() {
    return {
      buttons: [
        {
          name: 'save',
          component: ConfirmButton,
          props: {
            'modal-content-text-key': 'detail_delete_confirm_object',
            'button-text-key': 'delete',
            'button-icon': 'trash',
            'button-contextual-variant': 'danger',
            hint: this.$t('detail_delete_reassign_select'),
            beforeConfirm: this.beforeSubmit,
          },
          classes: 'd-flex',
          handler: this.submit,
        },
      ],
    }
  },
  created() {
    if (this.isNewModel) {
      this.defaultModel()
    }
  },
  methods: {
    beforeSubmit() {
      if (!this.model.reasignation_detail_id) {
        return false
      }
      return true
    },
    resetState() {
      this.defaultModel()
      this.errors = []
      this.globalErrors = []
      this.errorMessage = ''
    },
    getSaveData(model) {
      return {
        deleted_detail_id: this.deleteId,
      }
    },
    /**
     * Overwritten to include reseting the model to its defaults
     */
    onSuccess(response, sentObj) {
      if (this.successUrl) {
        this.$router.replace(this.getSuccessUrl(response.data))
      }
      this.$emit('form-saved', response, sentObj)
      this.resetState()
    },
    /**
     * Overriden to remove the generic notification
     */
    showSuccessMessage() {},
  },
}
</script>
