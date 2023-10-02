<script>
import FormDefinition from '~/assets/js/forms/formDefinition'
import SchemaForm from '~/components/pages/form/schemaForm'
import { validators } from 'vue-form-generator'

const formDefinition = vm =>
  new FormDefinition(
    {
      comment: {
        type: 'textArea',
        label: vm.$t('record_card_comment'),
        placeholder: vm.$t('comment'),
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
          fields: ['comment'],
        },
      ],
    }
  )

export default {
  name: 'RecordCardCancelRequest',
  extends: SchemaForm,
  props: {
    definition: {
      type: Function,
      default: formDefinition,
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
    getSaveData(model) {
      return {
        record_card: this.extraInfo.model.id,
        reason: this.extraInfo.action.reason_comment_id,
      }
    },
    confirmSubmit() {
      if (this.isReadyForSend(this.model)) {
        this.$refs.modalConfirm.open(
          this.$t('cancel_request_confirm_title'),
          this.$t('cancel_request_confirm_title'),
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
          text: this.$t(this.saveButtonText),
          click: this.confirmSubmit,
          icon: this.saveButtonIcon,
          classes: 'btn-primary',
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
