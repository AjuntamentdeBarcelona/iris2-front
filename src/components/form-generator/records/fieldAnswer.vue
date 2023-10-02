<template>
  <div
    v-if="withoutApplicant"
    class="irisbox alert alert-warning">
    {{ $t('wont_be_no_answer') }}
  </div>
  <div
    v-else-if="(readyForConfigureAnswer && configureAnswer) || editMode"
    class="answer">
    <div
      v-show="!model.element_detail_id && !isMultiRecord()"
      class="alert alert-info">
      {{ $t('must_select_detail') }}
    </div>
    <div
      v-show="detailError"
      class="alert alert-danger">
      {{ $t('record_card_answer_detail_error') }}
    </div>
    <div
      v-show="loadingDetail"
      class="alert alert-info">
      {{ $t('detail_loading') }}
    </div>
    <div v-if="(multirecord || hasPrevious || readonly) && !edit">
      <div
        v-if="allowEnglish"
        class="alert alert-warning">
        {{ $t('theme_english_available_but_previous') }}
      </div>
      <span
        v-if="!initial"
        class="badge badge-danger">{{ $t('response_channel') }}: {{ $t('none') }}</span>
      <h2><span
        v-if="initial"
        class="badge badge-info text-left text-wrap">{{ labels[initial.response_channel] }}: {{ initialDescription }}</span></h2>
      <button
        v-if="model.element_detail_id && !readonly"
        class="btn btn-outline-secondary"
        @click="activateEdit">{{ $t('multirecord_change_response_channel') }}</button>
    </div>
    <answer-config
      v-if="detailReady && edit"
      :detail="detail"
      :extra-errors="extraErrors"
      :active="active"
      :is-update="isUpdate"
      :backup="backup"
      v-model="value"
      @validated="validated"
      @on-previous-answer="onHasPrevious" />
    <button
      v-if="edit && multirecord"
      class="btn btn-outline-danger"
      @click="cancelEdit">
      {{ $t('multirecord_cancel_response_channel') }}
    </button>
  </div>
  <div
    v-else-if="!configureAnswer"
    class="alert alert-info">
    {{ $t('record_create_config_answer_no_needed') }}
  </div>
  <div
    v-else
    class="alert alert-info">
    {{ $t('record_create_config_answer_needs_fields') }}
  </div>
</template>

<script>
import AnswerConfig from '~/components/iris-pages/records/AnswerConfig.vue'

import irisField from '../irisField.js'
import { abstractField } from 'vue-form-generator'

import {
  EMAIL,
  SMS,
  LETTER,
  NONE,
  TELEPHONE,
} from '~/components/iris-pages/records/AnswerConfig.vue'
import { mapState, mapGetters } from 'vuex'
import { get, isEmpty } from 'lodash'
import { getLetterDestination } from '~/components/iris-pages/records/detail/DetailAnswerData'

export default {
  name: 'FieldAnswer',
  components: {
    AnswerConfig,
  },
  mixins: [irisField, abstractField],
  props: {
    extraErrors: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * Defines if the answer form is active and available for the user.
     */
    active: {
      type: Boolean,
      default: () => true,
      required: false,
    },
  },
  data() {
    if (this.isMultiRecord()) {
      this.model.multirecord_copy_responsechannel = true
    }

    return {
      valid: true,
      edit: !(this.isMultiRecord() || this.schema.readonly),
      initial: this.value,
      hasPrevious: false,
      visited: this.active || this.model.id != null || this.schema.visited,
    }
  },
  computed: {
    ...mapGetters('create', ['readyForConfigureAnswer']),
    ...mapState('create', [
      'previousAnswerData',
      'previousAnswerDataLoading',
      'configureAnswer',
      'channel',
      'applicantType',
      'editMode',
      'withoutApplicant',
      'detail',
    ]),
    ...mapState('create', {
      loadingDetail: 'loading',
      detailError: 'error',
    }),
    isUpdate() {
      return this.model.id != null
    },
    readonly() {
      return this.schema.readonly
    },
    backup() {
      return get(this.schema, 'backup', false)
    },
    multirecord() {
      return this.model.multirecord_from
    },
    labels() {
      return {
        [EMAIL]: this.$t('email'),
        [SMS]: this.$t('sms'),
        [LETTER]: this.$t('letter'),
        [TELEPHONE]: this.$t('telephone'),
        [NONE]: this.$t('none'),
      }
    },
    detailId() {
      return this.detail ? this.detail.id : null
    },
    detailReady() {
      return (
        this.detailId != null &&
        !this.loadingDetail &&
        this.detail &&
        !this.detailError
      )
    },
    allowEnglish() {
      return get(this.detail, 'allow_english_lang', false)
    },
    initialDescription() {
      if (this.initial) {
        return this.initial.response_channel !== LETTER
          ? this.initial.address_mobile_email
          : getLetterDestination.call(this, this.initial)
      } else {
        return ''
      }
    },
  },
  watch: {
    previousAnswerData(value, oldVal) {
      if (isEmpty(value)) {
        this.resetValue()
        this.onHasPrevious(undefined)
      }
    },
    detailId: {
      handler() {
        if (this.detailId) {
          this.visited = this.active || this.isUpdate || this.multirecord
          this.validate()
        }
      },
      immediate: true,
    },
    hasPrevious() {
      if (this.hasPrevious) {
        this.visited = this.active || this.isUpdate || this.multirecord
        this.initial = this.value
        this.valid = true
        this.validate()
      }
      this.edit = !this.hasPrevious
    },
    active() {
      if (this.active && !this.visited) {
        this.visited = true
        this.validate()
      }
    },
    detailError() {
      this.validate()
    },
    loadingDetail() {
      this.validate()
    },
    readyForConfigureAnswer() {
      this.validate()
    },
    configureAnswer() {
      if (!this.configureAnswer && this.detail) {
        this.value = { response_channel: NONE }
      }
      this.validate()
    },
    withoutApplicant() {
      this.validate()
      if (this.withoutApplicant && this.configureAnswer && this.detail) {
        this.value = { response_channel: NONE }
      }
    },
  },
  methods: {
    onHasPrevious(value) {
      this.hasPrevious = value && this.value.address_mobile_email
    },
    resetValue() {
      this.value = undefined
    },
    isMultiRecord() {
      return this.model.multirecord_from != null
    },
    activateEdit() {
      if (this.hasPrevious) {
        this.value = { response_channel: this.value.response_channel }
      }
      this.edit = true
      this.model.multirecord_copy_responsechannel = false
    },
    cancelEdit() {
      if (this.multirecord || this.hasPrevious) {
        this.edit = false
        this.value = this.initial
        this.valid = true
        if (this.multirecord) {
          this.model.multirecord_copy_responsechannel = true
        }
        this.validate()
      }
    },
    isValid() {
      return (
        this.withoutApplicant ||
        (this.valid && this.readyForConfigureAnswer && this.visited) ||
        this.readonly ||
        !this.configureAnswer ||
        this.editMode
      )
    },
    /**
     * Bypass validate to use the underliying AttributeEdit component.
     */
    validate() {
      this.$emit(
        'validated',
        this.isValid(),
        this.valid && this.readyForConfigureAnswer
          ? []
          : ['Nested field invalid'],
        this
      )
    },
    validated(isValid, formErrors, formGenerator) {
      this.valid = isValid
      this.validate()
    },
  },
}
</script>
