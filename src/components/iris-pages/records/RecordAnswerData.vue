<template>
  <div class="cardi record-answer-data border-0 p-0">
    <!-- <div class="row">
      hoala -->
    <!-- <div class="col-12"> -->
    <div class="cardi__main-title px-2"><h3>{{ $t('record_card_answer_data') }}</h3></div>
    <div class="row w-100 no-gutters">
      <div
        class="col-6 col-lg-12 cardi__card">
        <div class="cardi__title">
          {{ $t('response_channel_short') }}
        </div>
        <div class="cardi__description">
          {{ responseChannel ? responseChannel.description : $t('none') }}
        </div>
      </div>
      <div
        v-if="language"
        class="col-6 col-lg-12 cardi__card">
        <div class="cardi__title">
          {{ $t('language') }}
        </div>
        <div class="cardi__description">
          <lang-from-char :lang-char="language" />
        </div>
      </div>
      <div
        v-for="record in recordResponses"
        :key="record.normalized_record_id"
        class="cardi__card cardi__card--aplicants col-6 col-lg-12">
        <!-- Add element detail decription to the title -->
        <div
          :title="record.description"
          class="cardi__title">
          {{ record.normalized_record_id }}
        </div>
        <div class="cardi__description">
          <dl>
            <dd class="font-weight-bold text-dark">{{ record.applicantDisplay }}</dd>
            <dd v-if="applicant">{{ record.destination }}</dd>
            <dd 
              v-if="applicant" 
              class="form-group mt-1 col field-checkbox d-flex no-answer-check">        
              <div
                v-if="canNoSendAnswer && !disabled" 
                class="field-wrap">
                <label
                  v-b-popover.hover="$t('record_card_answer_no_send_explanation')">
                  {{ $t('record_card_answer_no_send') }}
                  <input
                    v-model="avoidValues[record.id]"
                    type="checkbox"
                    @change="avoidSend(record)">
                </label>
            </div></dd>
          </dl>
        </div>
      </div>
      <!-- </div> -->
    </div>
</div></template>

<script>
import { EMAIL, NONE, TELEPHONE, LETTER, SMS } from './AnswerConfig.vue'
import Permissions from '~/assets/js/iris2/Permissions.js'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'
import LangFromChar from '~/components/tables/LangFromChar.vue'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'RecordAnswerData',
  components: {
    LangFromChar,
  },
  props: {
    records: {
      type: Array,
      required: true,
      default: () => [],
    },
    language: {
      type: String,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      avoidValues: {},
    }
  },
  computed: {
    /**
     * Default record for extracting the channel and some information.
     */
    record() {
      return this.records[0]
    },
    recordResponses() {
      return this.records.map(record => {
        return {
          ...record,
          applicantDisplay: this.getApplicantDisplay(record),
          destination: this.getResponseDestination(record),
        }
      })
    },
    res() {
      return this.record.recordcardresponse
    },
    isNone() {
      return this.res == null || this.res.response_channel == NONE
    },
    responseChannel() {
      if (!this.res) {
        return { id: NONE, description: this.$t('none') }
      }
      let res_channel = this.res.response_channel
      if (
        this.res.response_channel == ResponseChannel.IMMEDIATE &&
        this.res.address_mobile_email.trim()
      ) {
        res_channel = ResponseChannel.EMAIL
      }
      return ResponseChannel.getAll(this).filter(
        item => res_channel == item.id
      )[0]
    },
    applicant() {
      return this.getApplicantDisplay(this.record)
    },
    canNoSendAnswer() {
      if (this.responseChannel == ResponseChannel.LETTER) {
        return (
          (this.hasPermission(Permissions.RECORD.NO_LETTER) &&
            this.hasPermission(Permissions.RECORD.NO_LETTER)) ||
          this.hasPermission(Permissions.RECORD.NO_SEND)
        )
      }
      return this.hasPermission(Permissions.RECORD.NO_SEND)
    },
    ...mapGetters('groups', ['hasPermission']),
  },
  methods: {
    avoidSend(record) {
      this.$emit('avoid-send', [record, this.avoidValues[record.id]])
    },
    getApplicantDisplay(record) {
      if (!this.res) {
        return null
      }
      if (!record.request.applicant) {
        return null
      }
      return record.request.applicant.citizen
        ? this.getCitizenName(record.request.applicant.citizen)
        : record.request.applicant.social_entity.social_reason
    },
    getCitizenName(citizen) {
      return `${citizen.name} ${citizen.first_surname} ${
        citizen.second_surname
      }`.trim()
    },
    getResponseDestination(record) {
      if (record.recordcardresponse) {
        const rr = record.recordcardresponse
        if (rr.municipality) {
          return (
            `${rr.via_type} ${rr.address_mobile_email} ${rr.number},` +
            `${rr.postal_code} ${rr.municipality} ${rr.province}`
          )
        }
        return rr.address_mobile_email
      }
      return '-'
    },
  },
}
</script>
<style>
.cardi .record-answer-data .cardi__title {
  flex: 1 1 43px;
}
.cardi .record-answer-data .cardi__description dd {
  flex: 1 1 calc(100% - 43px);
  word-break: keep-all;
}
.cardi__card--aplicants {
  flex-grow: 1;
  flex-wrap: wrap;
}
.cardi__description dl,
.cardi__description dd {
  margin: 0;
}

.no-answer-check {
  padding: 0px;
}
</style>
