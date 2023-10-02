<script>
import SchemaForm from '~/components/pages/form/schemaForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { recordCardInvalidEmail } from '~/assets/js/iris2/constants'
import { isNormalizedRecordId } from '~/assets/js/helpers'
import ConfirmButton from '~/components/forms/buttons/ConfirmButton'
import { CancelToken } from 'axios'

const formDefinition = vm =>
  new FormDefinition(
    {
      normalized_record_id: {
        type: 'input',
        inputType: 'text',
        required: true,
        label: vm.$t('record_card_id'),
        placeholder: vm.$t('record_card_id'),
        maxLength: 15,
        styleClasses: 'col-4',
      },
    },
    {
      groups: [
        {
          fields: ['normalized_record_id'],
        },
      ],
    }
  )

export default {
  name: 'ReportInvalidEmail',
  extends: SchemaForm,
  props: {
    title: {
      type: String,
      default: 'navigation_report_invalid_mail',
    },
    definition: {
      type: Function,
      default: formDefinition,
    },
    url: {
      type: String,
      default: '/api/record_cards/record_cards/add-comment/',
    },
    successUrl: {
      type: String,
      default: 'backoffice-admin-records-report_invalid_email',
    },
  },
  data() {
    return {
      recordCardId: null,
      loadingRecordCard: false,
      cancelToken: null,
      buttons: [
        {
          name: 'save',
          component: ConfirmButton,
          props: {
            modalContentTextKey: 'insert_comment_confirm',
            buttonTextKey: 'insert_comment',
            buttonIcon: 'comment',
            buttonIconClass: '',
            buttonContextualVariant: 'primary',
            hint: this.$t('report_invalid_email_disabled'),
            beforeConfirm: () =>
              this.hasAllRequiredFields(false) &&
              this.isReadyForSend(this.model) &&
              this.recordCardId,
          },
          classes: '',
          handler: this.submit,
        },
      ],
      successMessageTitle: this.$t('report_invalid_email_inserted'),
      successMessage: this.$t('report_invalid_email_message'),
    }
  },
  computed: {
    reference() {
      return this.model.normalized_record_id
    },
    normalizedReference() {
      return this.reference ? this.reference.trim().toUpperCase() : ''
    },
    insertCommentIcon() {
      return this.loadingRecordCard ? 'spinner' : 'comment'
    },
    insertCommentIconClass() {
      return this.loadingRecordCard ? 'fa-pulse' : ''
    },
  },
  watch: {
    reference(value, oldVal) {
      const normalizedReference = value ? value.trim().toUpperCase() : ''

      if (isNormalizedRecordId(normalizedReference)) {
        this.getIdFromCode(normalizedReference)
      } else if (normalizedReference.length) {
        this.recordCardId = null
        this.displayRecordReferenceError()
      } else {
        this.recordCardId = null
      }
    },
    loadingRecordCard(value, oldVal) {
      this.buttons[0].props.buttonIcon = this.insertCommentIcon
      this.buttons[0].props.buttonIconClass = this.insertCommentIconClass
    },
  },
  methods: {
    getSaveData(model) {
      return {
        normalized_record_id: undefined,
        record_card: this.recordCardId,
        reason: recordCardInvalidEmail,
        comment: this.$t('report_invalid_comment'),
      }
    },
    async getIdFromCode(code) {
      if (this.loadingRecordCard && this.cancelToken) {
        this.cancelToken.cancel()
      }

      this.cancelToken = CancelToken.source()
      this.loadingRecordCard = true
      this.resetFormErrors()

      try {
        const data = await this.$axios.$get(this.getIdUrl(), {
          cancelToken: this.cancelToken.token,
        })

        this.recordCardId = data.id
      } catch (e) {
        this.recordCardId = null
        this.displayRecordReferenceError()
      } finally {
        this.loadingRecordCard = false
      }
    },
    getIdUrl() {
      return `/api/record_cards/record_cards/${this.normalizedReference}/`
    },
    displayRecordReferenceError() {
      if (
        !this.errors.find(
          e => e.error === this.$t('report_invalid_email_not_found')
        )
      ) {
        this.errors.push({
          field: this.schemaDef.fields['normalized_record_id'],
          error: this.$t('report_invalid_email_not_found'),
        })
      }
    },
    created() {
      if (this.isNewModel) {
        this.defaultModel()
      }
    },
    /**
     * Overwritten to reset the form after save
     */
    onSuccess(response, sentObj) {
      if (this.successUrl) {
        this.$router.replace(this.getSuccessUrl(response.data))
      }
      this.$emit('form-saved', response, sentObj)
      this.defaultModel()
      this.resetFormErrors()
    },
    resetFormErrors() {
      this.errors = []
      this.globalErrors = []
      this.errorMessage = ''
    },
    /**
     * Overwritten to remove id parameter
     */
    getSuccessUrl(newObj) {
      return this.localePath({
        name: this.successUrl,
      })
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
