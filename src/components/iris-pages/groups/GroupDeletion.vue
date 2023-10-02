<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import ConfirmButton from '~/components/forms/buttons/ConfirmButton'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'

const formDefinition = vm =>
  new FormDefinition(
    {
      reasignation_group_id: {
        type: 'autocomplete',
        inputType: 'number',
        label: vm.$t('groups_group_to_reassign'),
        optionLabelAttribute: 'description',
        url: '/api/profiles/groups/',
        processAjaxResult: response => {
          return response.data.results.slice().sort(compareFnByDescriptionAsc)
        },
        offlineSearch: false,
        required: true,
        valueAttribute: 'id',
        values: [],
        isRestful: true,
        styleClasses: 'col',
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
          fields: ['reasignation_group_id'],
        },
        {
          class: 'col-12',
          fields: ['only_open'],
        },
      ],
    }
  )

export default {
  extends: SchemaForm,
  props: {
    url: {
      type: String,
      default: '/api/profiles/groups/delete/',
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
            'modal-content-text-key': 'groups_delete_confirm_object',
            'button-text-key': 'delete',
            'button-icon': 'trash',
            'button-contextual-variant': 'danger',
            hint: this.$t('groups_delete_reassign_select'),
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
      if (!this.model.reasignation_group_id) {
        return false
      }
      return true
    },
    getSaveData(model) {
      return {
        deleted_group_id: this.deleteId,
      }
    },
    /**
     * Overriden to remove the generic notification
     */
    showSuccessMessage() {},
  },
}
</script>
