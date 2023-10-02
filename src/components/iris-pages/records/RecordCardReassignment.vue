<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import { validators } from 'vue-form-generator'
import ReasonType from '~/assets/js/iris2/model/ReasonType.js'
import Ca from '~/lang/ca'
import { get } from 'lodash'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'

const ALLOW_DERIVATION = 'all_der'

let reassignmentFormDefinition = vm =>
  new FormDefinition(
    {
      next_responsible_profile: {
        type: 'autocomplete',
        url: '',
        label: vm.$t('record_card_reassignment_profile_selection'),
        placeholder: Ca.name,
        optionLabelAttribute: 'description',
        required: true,
        offlineSearch: true,
        styleClasses: 'col-12',
      },
      reason: {
        type: 'autocomplete-vuex-select',
        label: vm.$t('record_card_reassignment_motive'),
        placeholder: vm.$t('reason_placeholder'),
        storeModule: 'masters',
        storeAttribute: 'reassignReasons',
        storeAction: 'retrieveReassignReasons',
        required: true,
        styleClasses: 'col-12',
      },
      allow_multiderivation: {
        type: 'toggle',
        default: false,
        disabled: false,
        label: vm.$t('record_card_allow_multiderivation'),
        styleClasses: 'col',
      },
      comment: {
        type: 'textArea',
        label: vm.$t('record_card_comment'),
        placeholder: vm.$t('comment'),
        min: 3,
        required: true,
        validator: validators.string,
        rows: 4,
        styleClasses: 'col-12',
      },
    },
    {
      groups: [
        {
          fields: ['next_responsible_profile'],
        },
        {
          fields: ['reason'],
        },
        {
          fields: ['comment'],
        },
        {
          fields: ['allow_multiderivation'],
          layout_name: ALLOW_DERIVATION,
        },
      ],
    }
  )

export default {
  name: 'RecordCardReassignment',
  extends: SchemaForm,
  props: {
    title: {
      type: String,
      default: '',
    },
    definition: {
      type: Function,
      default: reassignmentFormDefinition,
    },
    backButton: {
      type: Boolean,
      default: false,
    },
    saveButtonText: {
      type: String,
      default: 'record_card_reassignment_reassign',
    },
    saveButtonIcon: {
      type: String,
      default: 'exchange-alt',
    },
    propModel: {
      type: Object,
      required: true,
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
  methods: {
    adaptSchema(schemaDef) {
      schemaDef.fields.next_responsible_profile.url = `/api/record_cards/record_cards/${
        this.propModel.id
      }/reasignations/`

      schemaDef.fields.next_responsible_profile.processAjaxResult = response => {
        return Array.isArray(response.data)
          ? response.data.slice().sort(compareFnByDescriptionAsc)
          : []
      }

      const allowRes = get(
        this,
        'propModel.element_detail.allow_multiderivation_on_reassignment',
        false
      )
      schemaDef.fields.allow_multiderivation.disabled = !allowRes
      schemaDef.getLayoutByName(ALLOW_DERIVATION).fields = allowRes
        ? ['allow_multiderivation']
        : []
    },
    getSaveData(model) {
      const newFields = {
        record_card: this.propModel.id,
      }
      return newFields
    },
    getDefaultButtons() {
      let buttons = [
        {
          name: 'close',
          text: this.$t('cancel'),
          click: this.cancel,
          icon: 'times',
          classes: 'btn-light mr-auto order-1',
        },
        {
          name: 'save',
          text: this.$t(this.saveButtonText),
          click: this.confirmSubmit,
          icon: this.saveButtonIcon,
          classes: 'btn-primary ml-auto',
        },
      ]
      return buttons
    },
    confirmSubmit() {
      if (this.isReadyForSend(this.model)) {
        this.$refs.modalConfirm.open(
          this.$t('record_card_reassignment_title'),
          this.$t('record_card_reassignment_title'),
          () => {
            this.submit()
          }
        )
      }
    },
    onSuccess(response, sentObj) {
      this.sendSuccessMessage()
      this.$emit('form-saved', response, sentObj)
    },
    sendSuccessMessage() {
      this.$notify({
        group: 'iris',
        title: this.$t('record_card_reassignment_reassigned'),
        type: 'success',
        text: '',
      })
    },
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
/* Allows textarea's rows attribute to work */
/deep/ .form-group.field-textArea .form-control {
  height: unset;

  // Unsets non scoped css by https://w33.bcn.cat/geobcn/js/0.5/jsapi.css
  border-color: rgb(212, 212, 212);
  background-color: #fff;
  outline: initial;
  box-shadow: initial;
  -webkit-box-shadow: initial;
  -moz-box-shadow: initial;
  -ms-box-shadow: initial;
}
</style>
