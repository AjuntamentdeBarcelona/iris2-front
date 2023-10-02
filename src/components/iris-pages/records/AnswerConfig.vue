<template>
  <div>
    <fieldset class="form-group answer-data">
      <legend>{{ $t('record_card_answer_data') }}</legend>
      <div
        v-if="detail.allow_english_lang"
        class="alert alert-info">
        {{ $t('theme_english_available') }}
      </div>
      <div
        v-show="detail.immediate_response"
        class="inmmediate-answer">
        <div
          class="form-group field-radio">
          <div> {{ $t('record_card_first_instance_answer_given') }}</div>
          <div class="form-check">
            <label
              v-if="!detail.immediate_response"
              disabled
              class="form-check-label">
              <input
                v-model="immediate_answer"
                :value="false"
                type="radio"
                class="form-check-input"
                @change="valueChanged">
              {{ $t('no') }}
            </label>
          </div>
          <div class="form-check">
            <label
              v-if="detail.immediate_response"
              class="form-check-label">
              <input
                v-model="immediate_answer"
                :value="true"
                disabled
                type="radio"
                class="form-check-input"
                @change="valueChanged">
              {{ $t('yes') }}
              <span
                v-if="detail.immediate_response"
                class="text-danger">
                {{ $t('record_card_immediate_protocol') }}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div
        class="answer-data-form row">
        <answer-confirm-ans
          v-if="detail.immediate_response && !acceptedAnsMessage"
          ref="confirmAns"
          :element-detail-id="detail.id"
          :active="active"
          :ans="detail.sla_hours"
          @ans-message-accepted="ansMessageChanged"/>
        <div
          v-if="!detail.immediate_response"
          class="col-12 col-lg-4 form-group top-field">
          <div class="field-wrap">
            <select
              id="responseChannel"
              v-model="response_channel"
              class="form-control"
              @change="valueChanged">
              <option
                :value="null"
                :key="null">{{ $t('record_card_response_channel') }}</option>
              <option
                v-for="rc in responseChannels"
                :key="rc.id"
                :value="rc.id">
                {{ rc.description }}
              </option>
            </select>
          </div>
        </div>
        <div
          v-if="detail.allow_english_lang"
          class="col-12 col-lg-4 form-group top-field">
          <label
            for="responseChannel">
            {{ $t('record_card_response_language') }}
          </label>
          <div class="field-wrap">
            <select
              id="responseChannel"
              v-model="language"
              class="form-control"
              @change="valueChanged">
              <option
                key="en"
                value="en">{{ $t('english') }}</option>
              <option
                key="ca"
                value="ca">{{ $t('catalan') }}</option>
              <option
                key="es"
                value="es">{{ $t('spanish') }}</option>
            </select>
          </div>
        </div>
        <div
          v-if="isLetter && !backup"
          class="form-group col-lg-4 top-field">
          <label>{{ isGeoBcnSchema.label }}</label>
          <field-toggle
            :model="formModel"
            :schema="isGeoBcnSchema"
            @model-updated="geoBcnUpdated" />
        </div>
        <div
          v-if="formSchema"
          class="col-12">
          <component
            ref="subform"
            :is="formComponent"
            :ifg-schema="formSchema"
            :definition="definition"
            :model="formModel"
            :initial="formModel"
            :backup="backup"
            :options="subformOptions"
            :external-errors="formExternalErrors"
            :is-new-model="isNewModel"
            :is-geo-bcn="isGeoBCN && !backup"
            class="col-12"
            @model-updated="answerDataChanged"
            @validated="validated"/>
          <div
            v-if="!formModel.address_mobile_email || !formModel.re_email"
            v-show="false"
            class="alert alert-danger">
            {{ $t('record_card_email_mandatory') }}
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import RecordNonAddressForm from '~/components/iris-pages/records/RecordNonAddressForm'
import { getLetterDefinition } from './RecordAddressForm.vue'
import RecordAddressForm from './RecordAddressForm.vue'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import NestedFormMixin from '~/components/form-generator/NestedFormMixin.js'
import { validators } from 'vue-form-generator'
import AnswerConfirmAns from './AnswerConfirmAns.vue'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import { isEmpty, isPlainObject } from 'lodash'
import { mapState } from 'vuex'

function getEmailDefinition(vm) {
  const emailValidator = validators.email.locale({
    invalidEmail: vm.$t('email_invalid'),
    required: vm.$t('required'),
  })
  return new FormDefinition(
    {
      address_mobile_email: {
        type: 'confirm',
        styleClasses: 'col-12',
        defaultRelationError: vm.$t('email_match'),
        required: true,
        allwaysConfirm: true,
        schema: {
          type: 'input',
          inputType: 'text',
          label: vm.$t('email'),
          placeholder: vm.$t('users_email'),
          styleClasses: 'col',
          required: true,
          min: 0,
          validator: [emailValidator],
        },
      },
    },
    {
      groups: [
        {
          fields: ['address_mobile_email'],
        },
      ],
    }
  )
}

function getTelephoneDefinition(vm, name) {
  return new FormDefinition(
    {
      address_mobile_email: {
        type: 'confirm',
        styleClasses: 'col-12',
        defaultRelationError: vm.$t('value_match'),
        required: true,
        allwaysConfirm: true,
        schema: {
          type: 'input',
          inputType: 'text',
          label: vm.$t(name),
          placeholder: vm.$t('answer_address_number_placeholder'),
          styleClasses: 'col',
          required: true,
          min: 9,
          max: 13,
          validator: validators.string.locale(),
        },
      },
    },
    {
      groups: [
        {
          fields: ['address_mobile_email'],
        },
      ],
    }
  )
}

function getImmediateResponseDefinition(vm) {
  const emailValidator = validators.email.locale({
    invalidEmail: vm.$t('email_invalid'),
  })
  return new FormDefinition(
    {
      address_mobile_email: {
        type: 'input',
        inputType: 'text',
        label: `${vm.$t('email')} (${vm.$t('optional')})`,
        placeholder: vm.$t('users_email'),
        styleClasses: 'col-8 col-xs-12',
        validator: [emailValidator],
      },
    },
    {
      groups: [
        {
          fields: ['address_mobile_email'],
        },
      ],
    }
  )
}

export const EMAIL = 0
export const SMS = 1
export const LETTER = 2
export const NONE = 3
export const TELEPHONE = 5

/**
 * Form component for configuring the answer preferences for a
 * RecordCard. The form changes dynamically according to the Detail
 * selected and the response channel.
 *
 * So, each response channel has its own form definition since it needs
 * different fields. For example, a letter needs addres fields while an
 * email only needs the email address.
 *
 * This component takes care of the two possible kinds of themes (ElementDetails):
 * immediate answer or not. The immediate answer only accepts to set an email for
 * receiving the created record card code.
 *
 * In addition, the user can select a none as ResponseChannel option,
 * in which case the value of this field will be null.
 *
 * This field allows to use the v-model directive.
 *
 * In this version, only the email flow is supported.
 *
 * @todo dynamize response channels from server (detail must define which are valid)
 * @todo letter
 * @todo confidential
 */
export default {
  name: 'AnswerConfig',
  components: {
    AnswerConfirmAns,
  },
  mixins: [NestedFormMixin],
  props: {
    detail: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      default() {
        return {}
      },
      required: false,
    },
    /**
     * Defines if the answer form is active and available for the user.
     */
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
    /**
     * In backup mode, geobcn plugins are not used
     */
    backup: {
      type: Boolean,
      default: false,
      required: false,
    },
    /**
     * Indicates the component if is a new record or will updat~/components/pages/form/irisFormGeneratore one.
     */
    isUpdate: {
      type: Boolean,
      default: () => false,
      required: false,
    },
  },
  data() {
    const definitions = {
      [EMAIL]: getEmailDefinition(this),
      [TELEPHONE]: getTelephoneDefinition(this, 'telephone'),
      [SMS]: getTelephoneDefinition(this, 'mobile'),
      [LETTER]: getLetterDefinition(this),
    }
    return {
      ...this.getDefaultValue(),
      ...(this.value ? this.value : {}),
      initialValue: { ...this.value },
      emailVal: EMAIL,
      noneVal: NONE,
      telVal: TELEPHONE,
      smsVal: SMS,
      isNewModel: true,
      formModel: {},
      definitions: definitions,
      immediateDefinition: getImmediateResponseDefinition(this),
      nonFormFields: [
        'authorization',
        'response_channel',
        'immediate_answer',
        'language',
      ],
      subformOptions: this.getFormOptions(),
      acceptedAnsMessage: this.isUpdate,
      initialDetail: this.detail ? this.detail.id : null,
      isGeoBCN: false,
      isGeoBcnSchema: {
        model: 'is_geo_bcn',
        type: 'toggle',
        label: this.$t('answer_address_is_barcelona'),
        default: false,
      },
    }
  },
  computed: {
    ...mapState('create', [
      'previousAnswerData',
      'configureAnswer',
      'editMode',
      'applicant',
    ]),
    isLetter() {
      return this.response_channel == ResponseChannel.LETTER
    },
    detailResponseChannels() {
      if (this.detail) {
        return this.detail.response_channels.map(rc => {
          return rc.responsechannel
        })
      }
      return []
    },
    formComponent() {
      return this.response_channel == LETTER
        ? RecordAddressForm
        : RecordNonAddressForm
    },
    /**
     * @returns {Array<Object>} Returns all the detail's response channels that we have a map for
     */
    responseChannels() {
      return ResponseChannel.getAll(this).filter(channel => {
        return (
          this.detail && this.detailResponseChannels.indexOf(channel.id) >= 0
        )
      })
    },
    applicantLang() {
      if (!this.applicant || !this.applicant.id) {
        return ''
      }
      return this.applicant.citizen
        ? this.applicant.citizen.language
        : this.applicant.social_entity.language
    },
    /**
     * @returns {Array<number>} Returns all the detail's response channels that we have a map for
     */
    responseChannelsId() {
      return this.responseChannels.map(channel => channel.id)
    },
    /**
     * @returns {Array<number>} Returns all the detail's response channels that we have a map for, sorted by priority
     */
    channelsByPriority() {
      return [
        ResponseChannel.EMAIL,
        ResponseChannel.SMS,
        ResponseChannel.LETTER,
        ResponseChannel.TELEPHONE,
        ResponseChannel.CAP,
      ].filter(rc => this.responseChannelsId.includes(rc))
    },
    definition() {
      return this.detail.immediate_response
        ? this.immediateDefinition
        : this.definitions[this.response_channel]
    },
    formErrors() {
      const error = {}
      this.nonFormFields.forEach(field => {
        if (this.errorDict[field] != null) {
          error[field] = this.extraErrors[field]
        }
      })
      return error
    },
    /**
     * @returns {Object<Object>} Returns previous answer data mapped by the response channel that expects it
     */
    mappedPreviousAnswerData() {
      const a = this.previousAnswerData
      let letter = {
        via_type: a.street_type,
        address_mobile_email: a.street,
        number: a.number,
        floor: a.floor,
        door: a.door,
        stair: a.scale,
        postal_code: a.postal_code,
        municipality: a.municipality,
        province: a.province,
      }

      function wrapAdm(value, rc) {
        return value != '' && value != null && rc === a.response_channel
          ? { address_mobile_email: value }
          : null
      }
      return {
        [ResponseChannel.LETTER]:
          a.street != '' && a.street != null && LETTER === a.response_channel
            ? letter
            : null,
        [ResponseChannel.EMAIL]: wrapAdm(a.email, EMAIL),
        [ResponseChannel.TELEPHONE]: wrapAdm(a.phone_number, TELEPHONE),
        [ResponseChannel.SMS]: wrapAdm(a.mobile_number, SMS),
      }
    },
  },
  watch: {
    /**
     * We must adjust and revalidate all the data each time the detail changes.
     */
    detail: {
      handler(newVal, old) {
        if (old) {
          this.setPreviousAnswerData()
        }
        this.attachValue()
        if (!this.detail.allow_english_lang) {
          this.language = this.applicantLang
          this.valueChanged()
        }
        if (this.detail && this.detail.id != this.initialDetail) {
          this.acceptedAnsMessage = false
          this.validated(true, [], this.$refs.$subform)
          this.valueChanged()
        }
      },
      immediate: true,
    },
    formSchema() {
      this.validated(true, [], this)
      this.isNewModel = true
      this.$nextTick(function() {
        if (this.$refs.subform) {
          this.$refs.subform.validate()
        }
      })
    },
    previousAnswerData: {
      handler(value, oldVal) {
        if (isEmpty(this.value) || this.value.response_channel == null) {
          this.setPreviousAnswerData()
        }
      },
      immediate: true,
    },
    response_channel: {
      handler(value, oldVal) {
        if (oldVal !== value && !this.immediate_answer) {
          this.setPreviousAnswerData()
        }
      },
    },
    configureAnswer() {
      this.valueChanged()
    },
  },
  mounted() {
    if (isEmpty(this.value)) {
      this.formModel = this.getPreviousAnswerData()
      this.valueChanged()
    } else {
      this.isGeoBCN =
        this.value.municipality == ResponseChannel.getGeoBcnMunicipality() &&
        !this.backup
      this.formModel = this.value
      this.formModel.is_geo_bcn = this.isGeoBCN
    }
    this.validated(true, [], this.$refs.$subform)
  },
  methods: {
    /**
     * @return {Object} Returns the answer data pertaining to a given response channel
     */
    getPreviousAnswerDataByResponseChannel(rc) {
      return this.mappedPreviousAnswerData[rc]
    },
    /**
     * @return {Object} Returns the previous answer data attending to the response channel priority,
     * in other words we pick the first existant response channel. Empty object if there is no data.
     *
     * Here we also set the response channel
     */
    attachPreviousResponseDataByPriority() {
      let formModel = null
      for (const rc of this.channelsByPriority) {
        formModel = this.getPreviousAnswerDataByResponseChannel(rc)
        if (formModel) {
          this.response_channel = rc
          return formModel
        }
      }
      return {}
    },
    /**
     * @return {Object} Returns the previous answer data
     */
    getPreviousAnswerData() {
      return this.response_channel !== null
        ? this.getPreviousAnswerDataByResponseChannel(this.response_channel)
        : this.attachPreviousResponseDataByPriority()
    },
    /**
     * Set the previous answer data
     */
    setPreviousAnswerData() {
      if (this.previousAnswerData && !this.editMode && !this.immediate_answer) {
        const answerDataKeys = Object.keys(this.previousAnswerData).length
        if (answerDataKeys === 0) {
          this.formModel = {}
          this.valueChanged()
          this.onPreviousData(false)
        } else if (answerDataKeys >= 1) {
          this.formModel = this.getPreviousAnswerData() || {}
          if (this.response_channel == ResponseChannel.LETTER) {
            if (!this.formModel.municipality) {
              this.formModel.municipality = ResponseChannel.getGeoBcnMunicipality()
              this.formModel.province = ResponseChannel.getGeoBcnProvince()
            }
            this.isGeoBCN =
              this.formModel.municipality ==
                ResponseChannel.getGeoBcnMunicipality() && !this.backup
            this.formModel.is_geo_bcn = this.isGeoBCN
          }
          this.valueChanged()
          this.onPreviousData(true)
        }
      } else {
        this.onPreviousData(false)
        if (this.response_channel == ResponseChannel.LETTER) {
          this.isGeoBCN = true && !this.backup
          this.formModel.municipality = ResponseChannel.getGeoBcnMunicipality()
          this.formModel.province = ResponseChannel.getGeoBcnProvince()
        } else {
          this.formModel.address_mobile_email = ''
        }
        this.formModel = { ...this.formModel }
        this.valueChanged()
      }
      this.language = this.applicantLang
    },
    getSchema() {
      return this.definition ? this.definition.getFormSchema() : null
    },
    attachValue() {
      const initial = {
        ...this.getDefaultValue(),
        ...(this.value ? this.value : {}),
      }
      Object.keys(initial).forEach(key => {
        this[key] = initial[key]
      })
      if (this.formModel) {
        Object.assign(this.formModel, this.getFormValueObject(this.value))
      }
      this.immediate_answer = this.detail.immediate_response
    },
    getDefaultValue() {
      return {
        immediate_answer: this.detail.immediate_response,
        authorization: false,
        response_channel: null,
        language: 'ca',
      }
    },
    getValue() {
      const value = {}
      if (!this.configureAnswer) {
        return {
          response_channel: NONE,
        }
      }
      this.nonFormFields.forEach(attr => {
        value[attr] = this[attr]
      })
      let lang = this.detail.allow_english_lang
        ? value.language || this.formModel.language
        : this.applicantLang
      if (this.detail && this.detail.immediate_response) {
        value.response_channel = this.formModel.address_mobile_email
          ? EMAIL
          : NONE
        lang = undefined
      }

      const initialValue = {
        language: this.initialValue.language,
      }
      return {
        ...value,
        ...this.formModel,
        language: lang,
        response_channel: value.response_channel,
        ...(this.editMode ? initialValue : {}),
      }
    },
    getLanguage() {},
    /**
     * Overwritten from NestedFromMixin, since some fields are handled here (nonFormFields)
     * and so they can't be found on the definition.
     *
     * Errors for these fields are sent as a string, and need to be handled by the receiving schemaForm so
     * that they end up as globalErrors
     */
    processExternalErrors() {
      if (!_.isObject(this.errorDict)) {
        return []
      }
      return Object.keys(this.errorDict).map(errorKey => {
        const field = this.definition.fields[errorKey]
        return field
          ? {
              field: field,
              error: Array.isArray(this.errorDict[errorKey])
                ? this.errorDict[errorKey][0]
                : this.errorDict[errorKey],
            }
          : this.composeNonFormFieldError(errorKey, this.errorDict[errorKey])
      })
    },
    composeNonFormFieldError(key, error) {
      const knownKeyLabels = {
        language: this.$t('language'),
      }
      return `${knownKeyLabels[key] || key}: ${
        Array.isArray(error) ? error[0] : error
      }`
    },
    /**
     * The form values are received flat with this component
     * value, so they must be unflatten and placed in a separate
     * object in order to work easily with the VueFormGenerator.
     */
    getFormValueObject(value) {
      value = value || {}
      const obj = {}
      Object.keys(value).forEach(key => {
        if (this.nonFormFields.indexOf(key) < 0) {
          obj[key] = value[key]
        }
      })
      return obj
    },
    valueChanged() {
      this.$emit('input', this.getValue())
      if (!this.definition && !this.immediate_answer) {
        this.validated(this.hasResponseChannel(), [], null)
      }
    },
    hasResponseChannel() {
      return this.response_channel != null
    },
    isValid() {
      if (!this.configureAnswer) {
        return true
      } else if (!this.detail) {
        return false
      } else if (!this.hasResponseChannel() && !this.immediate_answer) {
        return false
      } else if (this.immediate_answer && !this.acceptedAnsMessage) {
        return false
      }
      return this.hasAllRequiredFields()
    },
    answerDataChanged(model) {
      this.isNewModel = false
      if (model) {
        this.formModel = {
          ...this.formModel,
          ...(isPlainObject(model) ? model : {}),
        }
        this.geoBcnUpdated()
      }
      this.valueChanged()
    },
    ansMessageChanged(accepted) {
      this.acceptedAnsMessage = accepted
      this.validated(true, [], this.$refs.subform)
    },
    getRequiredFormFields() {
      const fields = this.definition
        ? Object.keys(this.definition.fields).filter(
            key => this.definition.fields[key]['required']
          )
        : []
      return fields
    },
    geoBcnUpdated() {
      this.isGeoBCN = this.formModel.is_geo_bcn && !this.backup
    },
    onPreviousData(hasPrevious) {
      this.$emit('on-previous-answer', hasPrevious)
    },
    validated(isValid, formErrors, formGenerator) {
      this.$emit(
        'validated',
        isValid && this.isValid(),
        [formErrors, ...(this.isValid() ? [] : [this.$t('all_madatory')])],
        formGenerator
      )
    },
  },
}
</script>

<style lang="scss">
.answer-data {
  .answer-data-form {
    width: 100%;
    .vue-form-generator .form-group {
      padding: 5px;
    }
    .top-field {
      margin-bottom: 0px;
      padding-bottom: 5px;
    }
  }
  .answer-data-type {
    display: inline-flex;
    margin-top: 1rem;
    padding-left: 0px;
  }
}

.form-check .text-danger {
  margin-left: 10px;
}

.vue-form-generator .form-group:not(.field-checkbox) .inmmediate-answer {
  .field-radio {
    margin-bottom: 0px;
    padding-bottom: 10px;
  }
}

.answer-confidential {
  .form-group {
    margin-left: 1.3rem;
  }
}
</style>
