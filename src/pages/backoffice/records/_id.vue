<template>
  <detail
    ref="detail"
    :pk="detailRecordId"
    url="/api/record_cards/record_cards/"
  >
    <div
      slot="loading"
      class="loading-box"
    >
      <div class="loading-overlay">
        <div class="loader" />
      </div>
    </div>

    <template
      slot="object"
      slot-scope="{ model }"
    >
      <set-applicant-form
        v-if="setApplicantMode && canPerform(model, 'set_applicant')"
        :record="model"
        @form-saved="applicantSetDone"
      />

      <template v-else>
        <b-breadcrumb :items="breadcrumb" />
        <header class="cardi__header px-2">
          <h2>
            {{ $t('record_card_record_card_characteristics') }}
          </h2>
          <span
            v-if="model.full_detail && manageVersion"
            class="cardi__header__items"
          >
            <block :record="model" />
          </span>
        </header>
        <div
          v-if="!model.full_detail"
          class="alert alert-warning text-center"
        >
          {{ $t('record_card_mayorship_version') }}
        </div>

        <div class="cardi">

          <!-- General data -->
          <div class="row my-2">
            <div class="col-12 cardi__main-title">
              <h3>{{ $t('record_card_general_data') }}</h3>
            </div>
            <b-collapse
              id="dadesgenerals"
              class="w-100 pt-1"
              visible
            >
              <div class="row no-gutters">
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_record_card_code') }}
                  </div>
                  <!-- Add element detail decription to the title -->
                  <div
                    :title="model.description"
                    class="cardi__description">
                    {{ model.normalized_record_id }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_tipology') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.record_type.description }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_entry_channel') }}
                  </div>
                  <div
                    v-if="model.input_channel"
                    class="cardi__description">
                    {{ model.input_channel.description }}
                  </div>
                  <div
                    v-if="!model.input_channel"
                    class="cardi__description">
                    {{ $t('no_response_channel') }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_area') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.element_detail.element.area.description }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_element') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.element_detail.element.description }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_detail') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.element_detail.description }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_applicant') }}
                  </div>
                  <div
                    class="cardi__description"
                  >
                    <template v-if="get(model, 'applicant_type', null) !== null">
                      {{ model.applicant_type.description }}
                    </template>
                    <template v-else>-</template>
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_input_date') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.created_at | dateTime }}
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_protocol') }}
                  </div>
                  <div class="cardi__description">
                    <dynamic-tag-modal
                      v-if="model.element_detail.external_protocol_id"
                      :component-props="{variant:'outline-primary'}">
                      <font-awesome-icon icon="eye"/>
                      {{ $t('record_card_display_protocol') }}
                      <template slot="modal">
                        <protocol :pk="model.element_detail.external_protocol_id" />
                      </template>
                    </dynamic-tag-modal>
                    <span v-else>-</span>
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_state') }}
                  </div>
                  <div class="cardi__description">
                    <span
                      :class="'badge badge-' + acronymUnderScored(model.record_state.acronym)">
                      {{ model.record_state.description }}
                    </span>
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_origin') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.page_origin ? model.page_origin : '' }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_support') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.support.description }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_group') }}
                  </div>
                  <div
                    v-if="model.responsible_profile"
                    class="cardi__description"
                  >
                    {{ model.responsible_profile.description }}
                  </div>
                  <div
                    v-if="!model.responsible_profile"
                    class="cardi__description"
                  >
                    -
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_creator') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.user_id }}
                  </div>
                </div>
                <div class="col-12 col-lg-4 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_creator_profile') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.creation_group ? model.creation_group.description : $t('not_available') }}
                  </div>
                </div>
                <!-- Answer data -->
                <detail-answer-data
                  :record="model"
                  class="col-12 col-lg-4 "
                />
                <div class="col-12 col-lg-8 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_register') }}
                  </div>
                  <div
                    v-if="model.registers.length"
                    class="cardi__description"
                  >
                    <span
                      v-for="register in model.registers"
                      :key="register.code"
                    >
                      {{ register.code }}
                    </span>
                  </div>
                  <div
                    v-else
                    class="cardi__description"
                  >
                    -
                  </div>
                </div>
                <div
                  v-if="model.communication_media"
                  class="col-12 col-lg-8 cardi__card"
                >
                  <div class="cardi__title">
                    {{ $t('record_card_communication_media') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.communication_media.description }}
                  </div>
                </div>
                <div
                  v-if="model.communication_media_date"
                  class="col-12 col-lg-4 cardi__card"
                >
                  <div class="cardi__title">
                    {{ $t('record_card_communication_media_date') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.communication_media_date | date }}
                  </div>
                </div>
                <div class="col-12 col-lg-12 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_related_record_cards') }}
                  </div>
                  <div class="cardi__description">
                    -
                  </div>
                </div>
                <div
                  v-if="model.claims_number > 0"
                  class="col-12 col-lg-12 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_claims') }} ({{ model.claims_number }})
                  </div>
                  <div class="cardi__description">
                    <record-card-claims :record="model" />
                  </div>
                </div>
                <div class="col-12 cardi__card">
                  <div class="cardi__title">
                    {{ $t('record_card_description') }}
                  </div>
                  <div class="cardi__description">
                    {{ model.description }}
                  </div>
                </div>
              </div>
            </b-collapse>
          </div>

          <template v-if="model.full_detail">
            <!-- Multirecords -->
            <div
              v-if="model.is_multirecord || model.multirecord_from"
              class="row"
            >
              <button
                v-b-toggle.atributs
                class="col-12 cardi__main-title mt-2">
                <h4>{{ $t('multirecord') }}</h4>

                <div class="ml-auto cardi__show-more">
                  <small>
                    {{ $t('show_more_content') }}
                  </small>
                  <i class="fas fa-caret-right card-toggle ml-1" />
                </div>
              </button>

              <b-collapse
                id="atributs"
                class="w-100 pt-1"
                visible
              >
                <multi-record-list :record="model" />
              </b-collapse>
            </div>

            <record-attribute-values :record="model" />

            <!-- External ids -->
            <div
              v-show="model.external_ids && model.external_ids.length > 0"
              class="row my-2">

              <button
                v-b-toggle.external_ids
                class="col-12 cardi__main-title">
                <h4>{{ $t('record_card_external_ids') }}</h4>

                <div class="ml-auto cardi__show-more">
                  <small>
                    {{ $t('show_more_content') }}
                  </small>
                  <i class="fas fa-caret-right card-toggle ml-1" />
                </div>
              </button>

              <b-collapse
                id="external_ids"
                class="w-100 pt-1"
                visible
              >
                <div class="row no-gutters">
                  <div
                    v-for="external_id in model.external_ids"
                    :key="external_id.service_name"
                    class="col-12 col-lg-6 cardi__card"
                  >
                    <div class="cardi__title cardi__title__big">
                      {{ external_id.service_name }}
                    </div>
                    <div class="cardi__description">
                      {{ external_id.external_code }}
                    </div>
                  </div>
                </div>
              </b-collapse>
            </div>

            <!-- Ubication -->
            <div
              v-if="model.ubication"
              class="row my-2">

              <button
                v-b-toggle.ubicacio
                class="col-12 cardi__main-title">
                <h4>{{ $t('record_card_location') }}</h4>

                <div class="ml-auto cardi__show-more">
                  <small>
                    {{ $t('show_more_content') }}
                  </small>
                  <i class="fas fa-caret-right card-toggle ml-1" />
                </div>
              </button>


              <b-collapse
                id="ubicacio"
                class="w-100 pt-1"
                visible
              >
                <div class="row no-gutters">
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_district') }}
                    </div>
                    <div class="cardi__description">
                      <model-from-id
                        v-if="model.ubication.district"
                        :model-id="model.ubication.district"
                        model-attribute="name"
                        store-module="masters"
                        store-attribute="districts"
                        store-action="retrieveDistricts"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_neighborhood') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.neighborhood }}
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_statistical_sector') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.statistical_sector }}
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_address') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.official_street_name || (model.ubication.via_type + ' ' + model.ubication.street) }}
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_number_km_exit') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.street2 }}
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_setting') }}
                    </div>
                    <div class="cardi__description">
                      <b-button
                        variant="outline-primary"
                        @click="seeOnMap"
                      >
                        <font-awesome-icon
                          icon="map-marked-alt"/>
                        {{ $t('record_card_check_on_map') }}
                      </b-button>

                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_stair') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.stair }}
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_floor') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.floor }}
                    </div>
                  </div>
                  <div class="col-12 col-lg-4 cardi__card">
                    <div class="cardi__title">
                      {{ $t('record_card_door') }}
                    </div>
                    <div class="cardi__description">
                      {{ model.ubication.door }}
                    </div>
                  </div>
                </div>
              </b-collapse>
            </div>

            <!-- Map list modal -->
            <MountingPortal
              v-if="model.ubication"
              mount-to="body"
              append
            >
              <sweet-modal
                ref="modalMapList"
                :title="$t('record_cards_map_title_single')"
                blocking
                enable-mobile-fullscreen
                class="is-fullscreen"
                @close="mapOpened = false"
              >
                <record-card-map
                  v-if="mapOpened"
                  :model="[model]"
                  :is-single-model="true"
                />
              </sweet-modal>
            </MountingPortal>

            <!-- Applicant -->
            <record-card-applicant
              :model="model"
              :manage-version="manageVersion"
            />
          </template>
        </div>

        <template v-if="model.full_detail">
          <!-- Workflow -->
          <template v-if="model.workflow && !hiddenProcess">
            <header class="cardi__header px-2">
              <h3>{{ $t('record_card_process') }}</h3>
            </header>
            <div class="cardi">
              <div class="row ">
                <div class="col-12 p-0 cardi__card">
                  <process
                    :process="model"
                    :can-manage="manageVersion"
                    @state-changed="stateChanged"
                    @empty-process="hideProcess"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Files -->
          <files
            :record-card="model"
            :can-add-files="manageVersion && canPerform(model, 'upload-file')"
            :can-delete-files="manageVersion && canPerform(model, 'delete-file')"
            :missing-files="missingFiles"
            @file-uploaded="stateChanged"
          />

          <!-- Communications -->
          <header
            v-if="manageVersion"
            class="cardi__header px-2">
            <h3>
              {{ $t('record_card_communication_area') }}
            </h3>
          </header>
          <div
            v-if="manageVersion"
            class="cardi cardi--files">
            <div class="row my-2">

              <button
                v-b-toggle.espaicomunicacions
                class="col-12 cardi__main-title"
              >
                <h4>{{ $t('comms_comms') }}</h4>
                <div class="ml-auto cardi__show-more">
                  <small>
                    {{ $t('show_more_content') }}
                  </small>
                  <i class="fas fa-caret-right card-toggle ml-1" />
                </div>
              </button>

              <b-collapse
                id="espaicomunicacions"
                class="w-100 pt-1"
                visible
              >
                <div class="row no-gutters">
                  <communications
                    :record-card="model"
                    class="pt-1 w-100"
                    @message-sent="newComment"
                  />
                </div>
              </b-collapse>
            </div>
          </div>

          <!-- Traceability -->

          <header class="cardi__header px-2">

            <insert-comment
              v-if="canAddComments(model)"
              :record-card="model.id"
              @new-comment="newComment"
            >
              <h3>
                {{ $t('record_card_record_card_information') }}
              </h3>
            </insert-comment>
          </header>
          <div class="cardi cardi--files traceability">
            <div class="row my-2">
              <button
                v-b-toggle.informaciofitxa
                class="col-12 cardi__main-title">
                <h4>{{ $t('record_card_traceability') }}</h4>

                <div class="ml-auto cardi__show-more">
                  <small>
                    {{ $t('show_more_content') }}
                  </small>
                  <i class="fas fa-caret-right card-toggle ml-1" />
                </div>
              </button>
              <b-collapse
                id="informaciofitxa"
                class="w-100 pt-1"
                visible
              >
                <div class="row no-gutters">
                  <traceability
                    ref="traceability"
                    :model="model"
                    @pending-files="pendingFiles"
                  />
                </div>
              </b-collapse>
            </div>
          </div>
        </template>

        <footer
          v-if="manageVersion"
          class="cardi__footer">
          <!-- Cancel -->
          <check-modal-form-button
            v-if="model.full_detail && manageVersion"
            :form-component="components.RecordCardCancel"
            :model="model"
            icon-prop="times"
            action-name="cancel"
            open-button-text-key="record_card_annul"
            modal-content-text-key="record_card_annul"
            open-button-variant="danger"
            class="ml-0"
            @action-done="onCancel"
          />
          <!-- Cancel request -->
          <check-modal-form-button
            v-if="model.full_detail && manageVersion"
            :form-component="components.RecordCardCancelRequest"
            :model="model"
            :icon-prop="'times'"
            action-name="cancel-request"
            open-button-text-key="record_card_annul_request"
            modal-content-text-key="record_card_annul_request"
            @action-done="stateChange"
          />
          <!-- Claim -->
          <record-claim-action
            v-if="model.full_detail && manageVersion"
            :record-card="model"
            @claim-ready="newComment"
          />

          <!-- Urgency -->
          <div class="urgency ml-auto mr-auto">
            <urgency
              v-if="canPerform(model, 'toogle-urgency')"
              :record="model"
              :retry-url="{name: $route.name}"
              class="cardi__header__items__itemno"
              @value-changed="refresh"
            />
          </div>

          <!-- Add multirecord -->
          <div
            v-if="canPerform(model, 'add-multirecord')"
            class="cardi__header__items__itemno">
            <multi-record-button :record="model"/>
          </div>
          <!-- Change ElementDetail -->
          <record-theme-label
            :model="model"
            :show-button="true"
            :show-label="false"
            @theme-changed="refresh"
          />
          <!-- Edit record card -->
          <div v-if="canPerform(model, 'update')">
            <nuxt-link
              :to="localePath({name: 'backoffice-records-edit-id', params: {id: model.normalized_record_id}, query: $route.query})"
              class="btn btn-secondary ml-1"
            >
              <font-awesome-icon
                :icon="['fas', 'edit']"/>
              {{ $t('record_card_edit_record_card') }}
            </nuxt-link>
          </div>
          <!-- Resend answer -->
          <div
            v-if="canPerform(model, 'answer-resend')"
            class="cardi__header__items__itemno">
            <action
              :record="model"
              :actions="model.actions['answer-resend']"
              :icon="['fas', 'paper-plane']"
              confirm-title-key="record_card_answer_resend"
              confirm-text-key="record_card_answer_resend_confirm"
              success-message-key="record_card_answer_resend_success"
              error-message-key="record_card_answer_resend_error"
              variant="secondary"
              @action-done="newComment"
            />
          </div>
          <!-- Set applicant -->
          <div v-if="canPerform(model, 'set_applicant')">
            <button
              class="btn btn-primary"
              @click="setApplicant">
              <font-awesome-icon icon="user-check"/>
              {{ $t('record_card_applicant_set_and_solve') }}
            </button>
          </div>
          <!-- Validate and manage -->
          <check-modal-form-button
            v-if="model.full_detail && manageVersion"
            :form-component="components.RecordCardValidate"
            :check-components="validateCheckComponents"
            :model="model"
            :icon-prop="'clipboard-check'"
            action-name="validate"
            open-button-text-key="record_card_validate_and_manage"
            modal-content-text-key="record_card_validate_confirm_title"
            @action-done="stateChange"
          />
          <!-- Validate -->
          <check-modal-form-button
            v-if="model.full_detail && manageVersion"
            :form-component="components.RecordCardValidate"
            :check-components="validateCheckComponents"
            :model="model"
            :icon-prop="'check'"
            action-name="validate"
            open-button-text-key="record_card_validate"
            modal-content-text-key="record_card_validate_confirm_title"
            @action-done="returnToPending"
          />
          <!-- Reassign -->
          <old-modal-form-button
            v-b-popover.hover.top="getActionReason(model, 'reasign')"
            v-if="model.full_detail && manageVersion && canReassign(model)"
            :model="model"
            :form-component="components.RecordCardReassignment"
            :url="canReassign(model)"
            :alert="getActionReason(model, 'reasign')"
            :success-url="`/records/${model.id}`"
            :alert-modal-mode="false"
            reset-form-on-modal-closed
            button-text-key="record_card_reassignment_reassign"
            modal-text-key="record_card_reassignment_reassign"
            @action-done="reassignResult"
          >
            <template slot="before-form">
              <toggle-flag
                :object="model"
                :retry-url="{name: $route.name}"
                action="toogle-reasignable"
                label-key="record_card_blocked_reassignation"
                flag-attr="reassignment_not_allowed"
                success-message-key="record_card_set_non_reassignable"
                success-message-key-false="record_card_set_reassignable"
                class="cardi__header__items__item"
                @value-changed="refresh"
              />
            </template>
          </old-modal-form-button>

          <!-- Detail record modal print  -->
          <dynamic-tag-modal 
            :width="'900px'" 
            :show-scroll="true"
            red="dynamicmodal" >
            <font-awesome-icon icon="file-pdf" />
            <template slot="modal">
              <detail-record-print 
                :id-record="detailRecordId"
              />
            </template>
          </dynamic-tag-modal>  

        </footer>

        <!-- onCancel modal -->
        <MountingPortal
          mount-to="body"
          append
        >
          <sweet-modal
            v-if="newRC"
            ref="newRC"
            :blocking="true"
            @close="returnToOriginRecordList(true)"
          >
            <p v-text="$t('record_card_cancel_new_rc')"/>
            <nuxt-link
              :to="localePath({name: 'backoffice-records-id', params: {'id': newRC}})"
              class="rc-reference"
            >{{ newRC }}</nuxt-link>
          </sweet-modal>
        </MountingPortal>
      </template>
    </template>
  </detail>
</template>

<script>
import Detail from '~/components/pages/detail/Detail.vue'
import Action from '~/components/pages/actions/Action.vue'
import Urgency from '~/components/iris-pages/records/Urgency.vue'
import Block from '~/components/iris-pages/records/Block'
import { ToggleButton } from 'vue-js-toggle-button'
import InsertComment from '~/components/iris-pages/records/InsertComment.vue'
import Process from '~/components/iris-pages/records/Process.vue'
import ModelFromId from '~/components/tables/ModelFromId'
import MultiRecordList from '~/components/iris-pages/records/multirecord/MultiRecordList.vue'
import MultiRecordButton from '~/components/iris-pages/records/multirecord/MultiRecordButton.vue'
import OldModalFormButton from '~/components/forms/OldModalFormButton'
import ModalFormButton from '~/components/forms/buttons/ModalFormButton'
import CheckModalFormButton from '~/components/forms/buttons/CheckModalFormButton'
import GroupChecker from '~/components/forms/buttons/checkers/GroupChecker'
import SimilarRecordCardsChecker from '~/components/forms/buttons/checkers/SimilarRecordCardsChecker'
import ExternalServiceChecker from '~/components/forms/buttons/checkers/ExternalServiceChecker'
import RecordCardValidate from '~/components/iris-pages/records/RecordCardValidate'
import RecordCardReassignment from '~/components/iris-pages/records/RecordCardReassignment'
import SetApplicantForm from '~/components/iris-pages/records/process/SetApplicantForm'
import RecordCardCancel from '~/components/iris-pages/records/RecordCardCancel'
import Communications from '~/components/iris-pages/records/communications/Communications'
import Files from '~/components/iris-pages/records/files/Files'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'
import { get } from 'lodash'
import { mapState, mapActions } from 'vuex'
import RecordClaimAction from '~/components/iris-pages/records/RecordClaimAction.vue'
import breadcrumb from '~/pages/backoffice/records/breadcrumb.js'
import RecordCardClaims from '~/components/iris-pages/records/RecordCardClaims.vue'
import ToggleFlag from '~/components/pages/actions/ToggleFlag.vue'
import RecordThemeLabel from '~/components/iris-pages/records/RecordThemeLabel.vue'
import RecordCardCancelRequest from '~/components/iris-pages/records/RecordCardCancelRequest'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'
import Protocol from '~/components/iris-pages/records/Protocol.vue'
import Traceability from '~/components/iris-pages/records/Traceability'
import RecordCardMap from '~/components/iris-pages/records/maps/RecordCardMap'
import RecordStateColumn from '~/components/pages/list/columns/RecordStateColumn.vue'
import DetailAnswerData from '~/components/iris-pages/records/detail/DetailAnswerData.vue'
import RecordAttributeValues from '~/components/iris-pages/records/detail/RecordAttributeValues.vue'
import RecordCardApplicant from '~/components/iris-pages/records/detail/RecordCardApplicant'
import DetailRecordPrint from '../../../components/pages/detail/DetailRecordPrint.vue'

export default {
  name: 'RecordCardDetail',
  layout: 'backoffice',
  components: {
    Detail,
    Process,
    Urgency,
    ToggleButton,
    InsertComment,
    ModelFromId,
    Block,
    ToggleFlag,
    MultiRecordList,
    MultiRecordButton,
    OldModalFormButton,
    ModalFormButton,
    Communications,
    Action,
    RecordClaimAction,
    Files,
    CheckModalFormButton,
    RecordCardClaims,
    RecordThemeLabel,
    DynamicTagModal,
    Protocol,
    Traceability,
    RecordCardMap,
    RecordStateColumn,
    SetApplicantForm,
    DetailAnswerData,
    RecordAttributeValues,
    RecordCardApplicant,
    DetailRecordPrint,
  },
  mixins: [AuthorizationMixin],
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
    manageVersion: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      missingFiles: false,
      mapOpened: false,
      setApplicantMode: false,
      hiddenProcess: false,
      components: {
        RecordCardCancel,
        RecordCardCancelRequest,
        RecordCardReassignment,
        RecordCardValidate,
      },
      status: {
        loading: {
          applicantTypes: null,
        },
      },
      newRC: null,
    }
  },
  computed: {
    recordId() {
      return this.id ? this.id : this.$route.params.id
    },
    detailRecordId() {
      return [this.recordId]
    },
    breadcrumb() {
      return breadcrumb.getBreadCrumb(this)
    },
    ...mapState('masters', ['applicantTypes']),
    validateCheckComponents() {
      return [ExternalServiceChecker, GroupChecker, SimilarRecordCardsChecker]
    },
  },
  async created() {
    this.get = get

    this.status.loading.applicantTypes = true
    await this.retrieveApplicantTypes()
    this.status.loading.applicantTypes = false
  },
  mounted() {
    // this.returnToPending()
  },
  methods: {
    pendingFiles() {
      this.missingFiles = true
    },
    /**
     * On actions:
     * The existance of an action_url dictates whether the action is possible on the current state of the RecordCard's
     * process or not.
     * The existance of a permission dictates if it's possible for the group's profile to carry this kind of operation
     * or not. Its abscence means there's not such restriction.
     */
    acronymUnderScored(acronym) {
      const acronymUnderscored = acronym.replace(' ', '-')
      return acronymUnderscored.toLowerCase()
    },
    canAddComments(model) {
      return (
        !!get(model, 'actions.add-comment.action_url') && this.manageVersion
      )
    },
    canReassign(model) {
      return get(model, 'actions.reasign.action_url', false)
    },
    refresh() {
      this.$refs.detail.refresh()
    },
    newComment(comment) {
      this.$refs.traceability.refresh()
    },
    stateChanged() {
      this.refresh()
    },
    stateChange(success) {
      if (success) {
        this.refresh()
      }
    },
    async onCancel(success, response, sentObj) {
      if (response.data.normalized_record_id) {
        this.newRC = response.data.normalized_record_id
        await this.$nextTick()
        this.$refs.newRC.open()
      } else {
        this.returnToOriginRecordList(success)
      }
    },
    /**
     * This page can be accessed with the fromList queryparam.
     * The param must be a path.
     */
    returnToOriginRecordList(success) {
      if (success) {
        if (this.$route.query.fromList) {
          this.$router.push(this.$route.query.fromList)
        } else {
          this.returnToPending(success)
        }
      }
    },
    returnToPending(success) {
      if (success) {
        this.$router.push(this.localePath({ name: 'backoffice-tasks' }))
      }
    },
    applicantType(applicantTypePk) {
      return this.applicantTypes.find(obj => obj.id === applicantTypePk)
    },
    getActionReason(model, reasonName) {
      return get(model, `actions.${reasonName}.reason`, undefined)
    },
    canPerform(model, action) {
      return get(model, `actions.${action}.can_perform`, false)
    },
    seeOnMap() {
      this.$refs.modalMapList.open()
      this.mapOpened = true
    },
    setApplicant() {
      this.setApplicantMode = true
    },
    applicantSetDone() {
      this.setApplicantMode = false
      this.refresh()
    },
    reassignResult(result, model) {
      if (result) {
        this.$refs.detail.model = model
        this.$refs.traceability.refresh()
      } else {
        this.refresh()
      }
    },
    hideProcess() {
      this.hiddenProcess = true
    },
    ...mapActions('masters', ['retrieveApplicantTypes']),
  },
}
</script>

<style lang="scss">
.loading-box {
  position: relative;
}

.rc-reference {
  color: $primary;
  font-weight: bold;
  font-size: 1.9rem;
  clear: both;
  display: inherit;
}

.cardi__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  flex-wrap: wrap;
  padding: 5px;
  &__items {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    &__item {
      padding: 5px;
    }
  }
  h2,
  h3 {
    margin: 0.5rem 0;
    margin-right: auto;
    text-transform: uppercase;
    font-weight: bold;
  }
  h3 {
    margin-bottom: 1rem;
    font-size: 1.4em;
  }
}
.cardi__footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  .btn {
    margin: 0.5rem;
  }
}
@media print {
  .cardi__footer {
    display: none;
  }
}
.cardi {
  border: 1px solid $gray-400;
  background-color: $white;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  &__main-title {
    background-color: darken($gray-200, 15);
    text-transform: uppercase;
    flex: 1 1 100%;
    min-height: 2rem;
    display: flex;
    align-items: center;
    border: none;
    &:focus {
      outline-color: $primary;
    }
    h3,
    h4 {
      margin-bottom: 0;
      font-size: 1.1em;
      font-weight: bold;
      display: inline-flex;
      width: auto;
      float: left;
      text-align: left;
    }
    .cardi__show-more {
      width: auto;
      min-width: 30%;
      float: right;
      text-align: right;
    }
    small {
      text-transform: initial;
    }
    .btn {
      padding: 0.2rem;
      &:focus {
        box-shadow: initial;
      }
    }
  }
  // TODO: DAMIÀ A. PONT cercar alternativa als components de col- de bootstrap i fer-ho en flex ajustant les diferencies de contingut
  &__card {
    display: flex;
  }

  &--files {
    .cardi__card {
      border-top: 1px solid $gray-400;
      border-bottom: 1px solid $gray-400;
      padding: 0.4rem;
      &:nth-child(even) {
        background-color: $gray;
      }
    }
  }
  &__title,
  &__description {
    padding: 0.5rem 0.8rem;
    border: 1px solid $gray-400;
    display: flex;
    align-items: center;
    .btn {
      padding: 0rem 0.5rem;
    }
  }
  &__title {
    flex: 1 1 175px;
    justify-content: flex-end;
    background-color: $gray-100;
    font-weight: bold;
    width: 175px;
  }
  &__title__big {
    flex: 1 1 320px;
    justify-content: flex-end;
    background-color: $gray-100;
    font-weight: bold;
    width: 320px;
  }
  &__description {
    flex: 1 1 calc(100% - 175px);
    justify-content: flex-start;
    word-break: break-all;
  }
  &__main-title.collapsed {
    .card-toggle {
      transform: rotate(0deg);
    }
  }
}

.card-toggle {
  transition: transform 0.3s ease-out;
  transform: rotate(90deg);
}

.vue-js-switch {
  margin-bottom: 0;
}
</style>

<style lang="scss" scoped>
/deep/ .sweet-title {
  display: flex;
  align-items: center;
}
/deep/ .urgency {
  padding: 10px 5px;
}
</style>
