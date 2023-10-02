<template>
  <div
    v-if="model.record_state_id == notTramitState"
    class="row my-2">
    <div class="alert alert-warning irisbox col-12">
      <b>{{ $t('wont_be_done_record') }}</b>
    </div>
  </div>

  <div
    v-else
    class="row my-2"
  >
    <button
      v-b-toggle.dadessolicitant
      class="col-12 cardi__main-title">
      <h4>{{ $t('record_card_applicant_data') }}</h4>

      <div class="ml-auto cardi__show-more">
        <small>
          {{ $t('show_more_content') }}
        </small>
        <i class="fas fa-caret-right card-toggle ml-1" />
      </div>
    </button>

    <b-collapse
      id="dadessolicitant"
      ref="applicant"
      v-model="applicantVisible"
      class="w-100 pt-1"
    >
      <loader v-if="status.loading.request"/>
      <div
        v-else-if="!status.data.request"
        class="alert alert-danger"
      >
        {{ $t('error_loading_data_explanation') }}
      </div>
      <template v-else>
        <!-- Applicant edition -->
        <template v-if="manageVersion">
          <header
            v-if="status.data.request.applicant"
            class="cardi__header px-0 py-1"
          >
            <div
              v-if="status.data.request.applicant.deleted"
              class="alert alert-danger">
              {{ $t('record_applicant_deleted') }}
            </div>
            <button
              v-if="!status.data.request.applicant.deleted"
              :class="[applicantEdition ? 'btn-danger' : 'btn-outline-secondary']"
              class="btn ml-1 btn-sm"
              @click.stop="editApplicant"
            >
              <template v-if="applicantEdition">
                <font-awesome-icon
                  :icon="['fas', 'times']"/>
                {{ $t('cancel') }}
              </template>
              <template v-else>
                <font-awesome-icon
                  :icon="['fas', 'edit']"/>
                {{ $t('edit') }}
              </template>

            </button>
          </header>
          <citizen-form
            v-if="applicantEdition && status.data.request.applicant.citizen"
            :title="$t('record_card_edit_citizen')"
            :url="`/api/record_cards/citizens/${ status.data.request.applicant.citizen.id}/`"
            :initial="status.data.request.applicant.citizen"
            form-type="update"
            method="put"
            @form-saved="applicantUpdated"
          />
          <company-form
            v-if="applicantEdition && status.data.request.applicant.social_entity"
            :title="$t('record_card_edit_social_entity')"
            :url="`/api/record_cards/social_entities/${status.data.request.applicant.social_entity.id}/`"
            :initial="status.data.request.applicant.social_entity"
            form-type="update"
            method="put"
            @form-saved="applicantUpdated"
          />
        </template>

        <!-- citizen -->
        <div
          v-if="status.data.request.applicant && status.data.request.applicant.citizen"
          v-show="!applicantEdition"
          class="row no-gutters"
        >

          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('name') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.citizen.name }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('first_surname') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.citizen.first_surname }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('second_surname') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.citizen.second_surname }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('id_card') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.citizen.dni }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('birth_year') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.citizen.birth_year }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('district') }}
            </div>
            <div class="cardi__description">
              <model-from-id
                :model-id="status.data.request.applicant.citizen.district"
                model-attribute="name"
                store-module="masters"
                store-attribute="districts"
                store-action="retrieveDistricts"
              />
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('language') }}
            </div>
            <div class="cardi__description">
              <lang-from-char :lang-char="status.data.request.applicant.citizen.language" />
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('response_channel') }}
            </div>
            <loader
              v-if="status.loading.responseChannels"
              minimal
              class="cardi__description"
            />
            <div
              v-else
              class="cardi__description"
            >
              <template v-if="get(model, 'recordcardresponse.response_channel', null) !== null">
                {{ getResponseChannelDescription(model.recordcardresponse.response_channel) }}
              </template>
              <template v-else>-</template>
            </div>
          </div>
        </div>

        <!-- social_entity -->
        <div
          v-if="status.data.request.applicant && status.data.request.applicant.social_entity"
          class="row no-gutters"
        >
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('social_reason') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.social_entity.social_reason }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('cif') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.social_entity.cif }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('district') }}
            </div>
            <div class="cardi__description">
              <model-from-id
                :model-id="status.data.request.applicant.social_entity.district"
                model-attribute="name"
                store-module="masters"
                store-attribute="districts"
                store-action="retrieveDistricts"
              />
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('contact') }}
            </div>
            <div class="cardi__description">
              {{ status.data.request.applicant.social_entity.contact }}
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('language') }}
            </div>
            <div class="cardi__description">
              <lang-from-char :lang-char="status.data.request.applicant.social_entity.language" />
            </div>
          </div>
          <div class="col-12 col-lg-4 cardi__card">
            <div class="cardi__title">
              {{ $t('response_channel') }}
            </div>
            <loader
              v-if="status.loading.responseChannels"
              minimal
              class="cardi__description"
            />
            <div
              v-else
              class="cardi__description"
            >
              <template v-if="get(model, 'recordcardresponse.response_channel', null) !== null">
                {{ getResponseChannelDescription(model.recordcardresponse.response_channel) }}
              </template>
              <template v-else>-</template>
            </div>
          </div>
        </div>
      </template>
    </b-collapse>
  </div>
</template>

<script>
import LangFromChar from '~/components/tables/LangFromChar'
import SexFromChar from '~/components/tables/SexFromChar'
import ModelFromId from '~/components/tables/ModelFromId'
import Loader from '~/components/utils/Loader'
import CitizenForm from '~/components/iris-pages/create/CitizenForm'
import CompanyForm from '~/components/iris-pages/create/CompanyForm'

import RecordState from '~/assets/js/iris2/model/RecordState'

import { mapState, mapActions } from 'vuex'
import { get } from 'lodash'
import { CancelToken } from 'axios'

export default {
  name: 'RecordCardApplicant',
  components: {
    LangFromChar,
    SexFromChar,
    ModelFromId,
    Loader,
    CitizenForm,
    CompanyForm,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    manageVersion: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      applicantVisible: false,
      applicantEdition: false,
      status: {
        data: {
          request: null,
        },
        loading: {
          request: null,
          responseChannels: null,
        },
        cancelToken: {
          request: null,
        },
        error: {
          request: false,
        },
      },
    }
  },
  computed: {
    notTramitState() {
      return RecordState.NOT_TRAMIT.id
    },
    ...mapState('masters', ['responseChannels']),
  },
  watch: {
    applicantVisible: {
      immediate: true,
      handler(value, oldVal) {
        if (value && !this.status.data.request) {
          this.loadRequest()
          this.loadResponseChannels()
        }
      },
    },
  },
  created() {
    this.get = get
  },
  methods: {
    async loadRequest() {
      if (this.status.loading.request && this.status.cancelToken.request) {
        this.status.cancelToken.request.cancel()
      }

      this.status.cancelToken.request = CancelToken.source()
      this.status.loading.request = true
      this.status.error.request = false

      try {
        const url = this.getRequestEndpoint()
        const requestConfig = {
          cancelToken: this.status.cancelToken.request.token,
        }

        this.status.data.request = await this.$axios.$get(url, requestConfig)
      } catch (e) {
        this.status.error.request = true
      } finally {
        this.status.loading.request = false
      }
    },
    async loadResponseChannels() {
      this.status.loading.responseChannels = true
      await this.retrieveResponseChannels()
      this.status.loading.responseChannels = false
    },
    getRequestEndpoint() {
      return `/api/record_cards/requests/${this.model.request_id}/`
    },
    editApplicant() {
      this.applicantEdition = !this.applicantEdition
    },
    applicantUpdated() {
      this.applicantEdition = false
      this.applicantVisible = true
      this.loadRequest()
    },
    getResponseChannel(responseChannelPk) {
      return this.responseChannels.find(obj => obj.id === responseChannelPk)
    },
    getResponseChannelDescription(id) {
      const responseChannel = this.getResponseChannel(id)
      return responseChannel
        ? responseChannel.name
        : `- ${this.$t('untraceable_item')} (${id})-`
    },
    ...mapActions('masters', ['retrieveResponseChannels']),
  },
}
</script>
