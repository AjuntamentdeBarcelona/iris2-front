<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import { validators } from 'vue-form-generator'
import { mapState } from 'vuex'
import ReasonType from '~/assets/js/iris2/model/ReasonType'

const cancelFormDefinition = vm =>
  new FormDefinition(
    {
      reason: {
        type: 'autocomplete-vuex-select',
        label: vm.$t('record_card_reassignment_motive'),
        placeholder: vm.$t('reason_placeholder'),
        storeModule: 'masters',
        storeAttribute: 'cancelReasons',
        storeAction: 'retrieveCancelReasons',
        required: true,
        styleClasses: 'col-12',
        objectValue: true,
        getSaveValue(value) {
          return value.id
        },
      },
      duplicated_record_card: {
        type: 'input',
        inputType: 'text',
        min: 7,
        max: 13,
        validator: [validators.string],
        styleClasses: 'col-12',
        label: vm.$t('record_card_cancel_duplicity_id'),
        hint: vm.$t('record_card_cancel_duplicity_id_hint'),
      },
      comment: {
        type: 'textArea',
        label: vm.$t('record_card_comment'),
        placeholder: vm.$t('text'),
        required: true,
        rows: 4,
        styleClasses: 'col-12',
        hint: vm
          .$t('error_at_least_words')
          .replace('{words}', 2)
          .replace('{chars}', 4),
        pattern: /\S{4,}\s+[\s\S]*\S{4,}/,
        validator: [validators.string, validators.regexp],
      },
    },
    {
      groups: [
        {
          fields: ['reason', 'comment'],
        },
      ],
    }
  )
export default {
  name: 'RecordCardCancel',
  extends: SchemaForm,
  props: {
    title: {
      type: String,
      default: '',
    },
    definition: {
      type: Function,
      default: cancelFormDefinition,
    },
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
  methods: {
    /**
     * The schema can vary according to the Reason type selected.
     */
    afterUpdate(field) {
      if (field == 'reason') {
        if (
          this.model.reason &&
          this.model.reason.require_applicant_record_card
        ) {
          this.schemaDef.layout.groups = [
            {
              fields: ['reason', 'comment', 'duplicated_record_card'],
            },
          ]
          this.schemaDef.define('duplicated_record_card', { required: true })
        } else {
          // Reset schema
          if (this.$refs.form) {
            this.$refs.form.errors = this.$refs.form.errors.filter(
              error =>
                error.field && error.field.uid != 'duplicated_record_card'
            )
            this.valid = this.$refs.form.errors.length == 0
          }
          this.schemaDef = this.getInitialDefinition().clone()
        }
      }
    },
    getSaveData(model) {
      const newFields = {
        record_card: this.extraInfo.model.id,
      }
      return newFields
    },
    confirmCancel() {
      if (this.isReadyForSend(this.model)) {
        this.$refs.modalConfirm.open(
          this.$t('cancel_confirm_title'),
          this.$t('cancel_confirm_text'),
          () => {
            this.submit()
          }
        )
      }
    },
    getDefaultButtons() {
      let buttons = [
        {
          name: 'save',
          text: this.$t('record_card_annul'),
          click: this.confirmCancel,
          icon: 'times',
          classes: 'btn-danger',
        },
      ]
      return buttons
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
