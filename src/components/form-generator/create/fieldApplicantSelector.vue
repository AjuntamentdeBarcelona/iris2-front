<template>
  <div
    v-if="isReadyForWork"
    class="applicantSelector">

    <div
      v-if="loadingInitial"
      class="alert alert-info"
    >
      {{ $t('applicant_from_external_loading') }}
    </div>
    <div
      v-if="isBlockedApplicant"
      class="alert alert-danger"
    >
      {{ $t('applicant_blocked') }}
      <button
        class="btn btn-outline btn-primary"
        @click="loadDetail(blockedTheme)">
        {{ $t('applicant_set_blocked_theme') }}
      </button>
    </div>
    <!-- Applicant type selector -->
    <div
      v-if="allowTypeSelection"
      class="form-group field-radio d-flex flex-wrap">
      <div
        v-for="(value, key) in personTypes"
        :key="key"
        class="form-check ml-1 mr-2">
        <label
          v-if="!applicant && !loadingInitial"
          disabled
          class="form-check-label">
          <input
            :id="key"
            :value="key"
            v-model="personTypeIndex"
            type="radio"
            class="form-check-input"
          >
          {{ $t(value.label) }}
        </label>
      </div>
    </div>
    <div
      v-if="extraErrors.length"
      class="alert alert-danger"
    >
      <ul class="list-unstyled">
        <li
          v-for="error in extraErrors"
          :key="error"
        >
          {{ error }}
        </li>
      </ul>
    </div>
    <div
      v-if="value && applicant && !loadingInitial && !wontGiveData"
      class="applicant row"
    >
      <!-- Applicant selected -->
      <div class="col-12 col-lg-8">
        <!-- Citizen selected -->
        <h1
          v-if="applicant.citizen"
          class="title-line"
        >{{ $t("record_card_citizen_selected") }}
        </h1>
        <span
          v-if="applicant.citizen"
          class="row no-gutters"
        >
          <div class="col-12 cardi__card">
            <div class="cardi__title">
              {{ $t('name') }}
            </div>
            <div class="cardi__description">
              {{ applicant.citizen.name }}
            </div>
          </div>
          <div class="col-12 cardi__card">
            <div class="cardi__title">
              {{ $t('first_surname') }}
            </div>
            <div class="cardi__description">
              {{ applicant.citizen.first_surname }}
            </div>
          </div>
          <div class="col-12 cardi__card">
            <div class="cardi__title">
              {{ $t('second_surname') }}
            </div>
            <div class="cardi__description">
              {{ applicant.citizen.second_surname }}
            </div>
          </div>
          <div class="col-12 cardi__card">
            <div class="cardi__title">
              {{ $t('identity_card') }}
            </div>
            <div class="cardi__description">
              {{ applicant.citizen.dni }}
            </div>
          </div>
        </span>

        <!-- Company selected -->
        <h1
          v-if="applicant.social_entity"
          class="title-line"
        >{{ $t("record_card_social_entity_selected") }}
        </h1>
        <span
          v-if="applicant.social_entity"
          class="row no-gutters"
        >
          <div class="col-12 cardi__card">
            <div class="cardi__title">
              {{ $t('social_reason') }}
            </div>
            <div class="cardi__description">
              {{ applicant.social_entity.social_reason }}
            </div>
          </div>
          <div class="col-12 cardi__card">
            <div class="cardi__title">
              {{ $t('cif') }}
            </div>
            <div class="cardi__description">
              {{ applicant.social_entity.cif }}
            </div>
          </div>
        </span>

        <!-- Common buttons -->
        <span
          v-if="!readonly"
          class="applicant__buttons">
          <button
            v-if="operation === 'update'"
            class="btn btn-danger ml-auto py-1 px-2 rounded-0"
            @click.prevent="cancel"
          >
            <font-awesome-icon
              :icon="['fas', 'times']"/>
            {{ $t('cancel') }}
          </button>
          <button
            v-if="operation !== 'update' && canEdit"
            class="btn btn-primary ml-auto py-1 px-2 rounded-0"
            @click.prevent="edit"
          >
            <font-awesome-icon
              :icon="['fas', 'edit']"/>
            {{ $t('edit') }}
          </button>
          <button
            class="btn btn-primary ml-1 py-1 px-2 rounded-0"
            @click.prevent="unselect"
          >
            <font-awesome-icon
              :icon="['far', 'minus-square']"/>
            {{ $t('unselect') }}
          </button>
        </span>
      </div>
      <!-- Applicant last records -->
      <applicant-last-records
        v-if="showLast"
        :applicant-id="applicant.id"
        class="col-12 col-lg-3" />
    </div>

    <template v-if="!applicant && !loadingInitial && !wontGiveData">
      <keep-alive>
        <component
          v-if="operation === 'table'"
          ref="applicantTable"
          :is="applicantSearchComponent"
          :url="url"
          :applicant-type="Number(personTypeIndex)"
          :is-page-component="isPageComponent"
          :allow-nd="allowNd"
          class="applicantSearch"
          @empty-result="emptyResult"
          @select="select($event)"
        >
          <template
            v-if="isPageComponent"
            slot="extra-buttons">
            <button
              v-if="operation !== 'create' && canEditCreate"
              class="btn btn-primary"
              @click.prevent="create"
            >
              <font-awesome-icon
                :icon="['fas', 'user-plus']"
                class="mr-1"/>
              {{ `${$t('create')} ${$t(isCitizen ? 'citizen' : 'social_entity')}` }}
            </button>
          </template>
        </component>
      </keep-alive>

      <component
        v-if="operation === 'create'"
        :is="applicantFormComponent"
        :initial="createInitial"
        @form-saved="formCreated"
      />
      <div class="d-flex justify-content-end">
        <button
          v-if="['create', 'update'].includes(operation)"
          class="btn btn-danger mb-1 mt-auto mr-1"
          @click.prevent="cancel"
        >
          <font-awesome-icon
            :icon="['fas', 'times']"
            class="mr-1"/>
          {{ $t('cancel') }}
        </button>

        <button
          v-if="operation !== 'create' && !isPageComponent && canEditCreate"
          class="btn btn-primary mb-1 mt-auto"
          @click.prevent="create"
        >
          <font-awesome-icon
            :icon="['fas', 'user-plus']"
            class="mr-1"/>
          {{ `${$t('create')} ${$t(isCitizen ? 'citizen' : 'social_entity')}` }}
        </button>
      </div>
    </template>

    <component
      v-if="operation === 'update'"
      :is="applicantFormComponent"
      :initial="updateInitial"
      :url="formUrl"
      :title="`Modificar ${personType.label.toLowerCase()}`"
      form-type="update"
      method="put"
      @form-saved="formUpdated"
    />

    <div
      v-if="wontGiveData"
      class="irisbox alert-warning">
      <b v-if="requireSelection">{{ $t('wont_be_done_explanation') }}</b>
      <b v-else>{{ $t('wont_be_no_answer') }}</b>
    </div>
  </div>
  <div
    v-else
    class="alert alert-info">
    {{ $t('record_create_applicant_needs_channel_and_support') }}
  </div>
</template>


<script>
import irisField from '../irisField.js'
import { abstractField } from 'vue-form-generator'

import PersonType from '~/assets/js/iris2/model/PersonType.js'
import Applicant from '~/assets/js/iris2/model/Applicant.js'

import CitizenSearch from '~/components/iris-pages/create/CitizenSearch.vue'
import CompanySearch from '~/components/iris-pages/create/CompanySearch.vue'
import ApplicantLastRecords from '~/components/iris-pages/create/ApplicantLastRecords.vue'

import CitizenForm from '~/components/iris-pages/create/CitizenForm.vue'
import CompanyForm from '~/components/iris-pages/create/CompanyForm.vue'
import Crm from '~/assets/js/iris2/model/Crm.js'
import Permissions from '~/assets/js/iris2/Permissions.js'

import { mapState, mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

const BLOCKED_THEME = 'TEMATICA_NO_BLOQUEJADA'

/**
 * FieldApplicantSelector allows to search through applicants and select one applicant id.
 */
export default {
  name: 'FieldApplicantSelector',
  components: {
    CitizenForm,
    CompanyForm,
    ApplicantLastRecords,
  },
  mixins: [irisField, abstractField],
  props: {
    extraErrors: {
      type: Array,
      default: () => [],
    },
    isPageComponent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      operation: 'table',
      loadingInitial: false,
      createInitial: {},
      applicant: null,
      personTypes: {
        ...PersonType,
      },
      personTypeIndex: Object.keys(PersonType)[0],
    }
  },
  computed: {
    ...mapState('groups', { userGroupAllowNd: 'allowNd' }),
    ...mapState('applicant', {
      defaultApplicant: 'defaultApplicant',
      loadingDefault: 'loading',
    }),
    ...mapState('create', [
      'initialApplicantDoc',
      'initialApplicantName',
      'initialApplicantFirstSurname',
      'initialApplicantSecondSurname',
      'initialApplicantBirthYear',
      'initialApplicantDistrict',
      'initialApplicantLang',
      'initialApplicantSex',
      'initialApplicantType',
      'initialApplicantDocType',
      'initialCheckId',
      'initialIsRegister',
      'applicantId',
      'applicantType',
      'channel',
      'isEdit',
      'configureAnswer',
      'detail',
    ]),
    ...mapGetters('create', ['applicantTypes']),
    ...mapGetters('groups', ['hasPermission']),
    ...mapState(['parameters']),
    ...mapGetters(['applicantTypesRequireApplicant']),
    canEditCreate() {
      return this.hasPermission(Permissions.CITIZEN.CREATE)
    },
    /**
     * Checks if the selected applicant type must use the default applicant by checking
     * the parameter that define the list of applicant type ids that must select an applicant.
     */
    isDefault() {
      if (!this.applicantType) {
        return false
      }
      return (
        this.applicantTypesRequireApplicant.find(
          item => item == this.applicantType.id
        ) == null
      )
    },
    blockedTheme() {
      return this.parameters.get(BLOCKED_THEME)
    },
    isBlockedApplicant() {
      const blocked =
        this.applicant &&
        (this.applicant.citizen
          ? this.applicant.citizen.blocked
          : this.applicant.social_entity.blocked)
      return blocked && this.detail && this.blockedTheme != this.detail.id
    },
    wontGiveData() {
      return this.personTypeIndex == 'null'
    },
    url() {
      return this.isPageComponent
        ? '/api/record_cards/applicants/'
        : '/api/record_cards/applicants/search/'
    },
    lockApplicantTypeSwitch() {
      return this.operation === 'update' && this.applicant
    },
    applicantTypeId() {
      return this.applicantType ? this.applicantType.id : null
    },
    isGeneric() {
      if (!this.applicant || !this.applicant.id) {
        return false
      }
      return Applicant.isGeneric(this.applicant)
    },
    canEdit() {
      return !this.isGeneric && this.configureAnswer && this.canEditCreate
    },
    readonly() {
      return this.schema.readonly
    },
    personType: function() {
      return this.personTypes[this.personTypeIndex]
    },
    isCitizen: function() {
      return this.personTypeIndex == 0
    },
    /**
     * Maps ~/assets/js/iris2/model/PersonType.js to its respective search component
     */
    applicantSearchComponent: function() {
      return this.isCitizen ? CitizenSearch : CompanySearch
    },
    /**
     * Maps ~/assets/js/iris2/model/PersonType.js to its respective form component
     */
    applicantFormComponent: function() {
      return this.isCitizen ? CitizenForm : CompanyForm
    },
    formUrl: function() {
      const url = `/api/record_cards/applicants/${this.applicant.id}/`
      return url
    },
    /**
     * Prepares initial data for applicant update
     */
    updateInitial() {
      return {
        ...this.applicant[this.personType.type],
        flag_ca: this.applicant.flag_ca,
      }
    },
    support() {
      return this.model ? this.model.support_id : null
    },
    allowNd() {
      if (this.isPageComponent) {
        return true
      }
      return this.userGroupAllowNd && this.support
        ? this.support.allow_nd
        : false
    },
    allowNoData() {
      return !this.isPageComponent && !this.schema.citizenSelector
    },
    requireSelection() {
      return (
        this.isPageComponent || (this.detail && this.detail.requires_citizen)
      )
    },
    isReadyForWork() {
      return (
        (this.support && this.channel && this.detail && this.applicantType) ||
        this.isPageComponent ||
        this.schema.citizenSelector
      )
    },
    citizenIsMandatory() {
      return this.isReadyForWork && this.requireSelection
    },
    showLast() {
      return _.get(this.schema, 'showLast', true)
    },
    allowTypeSelection() {
      return _.get(this.schema, 'allowTypeSelection', true)
    },
    createOnEmpty() {
      return _.get(this.schema, 'createOnEmpty', true)
    },
  },
  watch: {
    value(newValue) {
      if (newValue == null) {
        this.applicant = null
        this.validate()
      }
      this.newApplicant(this.applicant)
      if (this.applicant) {
        this.setWithoutApplicant(false)
      }
    },
    initialCheckId() {
      this.loadFromInitial()
    },
    allowNoData: {
      handler() {
        this.setPersonTypes()
        if (this.value) {
          this.validate()
        }
      },
      immediate: true,
    },
    allowNd() {
      if (this.value) {
        this.validate()
      }
    },
    applicantType: {
      handler() {
        this.checkDefaultApplicant()
      },
      immediate: true,
    },
    defaultApplicant: {
      handler() {
        this.checkDefaultApplicant()
      },
      immediate: true,
    },
    isReadyForWork() {
      this.validate()
      this.checkDefaultApplicant()
    },
    citizenIsMandatory() {
      const without =
        this.isReadyForWork && !this.requireSelection && !this.applicant
      this.setWithoutApplicant(without)
      this.model.without_applicant = without
    },
    wontGiveData() {
      this.validate()
      // The user don't has to select an answer when has set as "won't give"
      // or the detail does not require citizen and no citizen has been selected.
      const without =
        this.wontGiveData || (!this.citizenIsMandatory && !this.applicant)
      this.setWithoutApplicant(without)
      this.model.without_applicant = without
      this.model.wont_tramit = this.wontGiveData
      if (this.wontGiveData) {
        this.unselect()
      }
    },
  },
  mounted() {
    if (_.isObject(this.value)) {
      this.applicant = this.value
      this.personTypeIndex = this.applicant.social_entity ? 1 : 0
      this.value = this.applicant.id
    } else if (Crm.isCRMCreation(this.$route.query)) {
      this.setInitialFromApplicant(Crm.getApplicatData(this.$route.query))
    }
    this.validate()
  },
  methods: {
    setPersonTypes() {
      if (this.allowNoData) {
        this.personTypes = {
          ...this.personTypes,
          null: {
            id: null,
            type: 'no_personal_data',
            label: 'no_personal_data',
          },
        }
      } else {
        delete this.personTypes['null']
      }
    },
    loadFromInitial() {
      this.personTypeIndex = this.initialApplicantType == 'P' ? 0 : 1
      this.unselect()
      const docParam = this.isCitizen ? 'dni' : 'cif'
      if (!this.initialApplicantDoc) {
        this.startCreateFromInitial()
        return
      }
      this.loadingInitial = true
      this.$axios
        .get(this.url, {
          params: {
            [docParam]: this.initialApplicantDoc,
            applicant_type: this.isCitizen ? 'citizen' : 'social_entity',
          },
        })
        .then(resp => {
          const results = resp.data.results || resp.data
          if (results.length == 0) {
            this.unselect()
            this.startCreateFromInitial()
          } else {
            this.select(results[0])
          }
        })
        .catch(resp => {
          console.error(resp)
        })
        .then(resp => {
          this.loadingInitial = false
        })
    },
    startCreateFromInitial() {
      this.createInitial = {
        dni: this.initialApplicantDoc,
        cif: this.initialApplicantDoc,
        name: this.initialApplicantName,
        contact: this.initialApplicantName,
        social_reason: this.initialApplicantFirstSurname,
        first_surname: this.initialApplicantFirstSurname,
        second_surname: this.initialApplicantSecondSurname,
        birth_year: this.initialApplicantBirthYear,
        doc_type: this.initialApplicantDocType,
        sex: this.initialApplicantSex,
        district: this.initialApplicantDistrict,
        language: this.initialApplicantLang,
        register: this.initialIsRegister,
      }
      this.operation = 'create'
    },
    select(applicant) {
      if (applicant.id != null) {
        this.applicant = applicant
        this.value = applicant.id
      } else {
        // From external channel must edit and save
        this.createInitial = {
          ...applicant,
          ...applicant.citizen,
          ...applicant.social_entity,
        }
        this.operation = 'create'
      }
    },
    selectUpdate(personType) {
      this.applicant[this.personType.type] = personType
      this.applicant = { ...this.applicant }
      this.value = this.applicant.id
    },
    edit() {
      this.operation = 'update'
    },
    unselect() {
      this.value = undefined
      this.applicant = null
      this.operation = 'table'
    },
    validate(calledParent) {
      this.clearValidationErrors()
      if (!this.isReadyForWork) {
        this.$emit('validated', false, [''], this)
      } else if (
        this.wontGiveData ||
        (!this.requireSelection && !this.applicant)
      ) {
        this.$emit('validated', true, '', this)
      } else if (!this.allowNd && this.isGeneric) {
        this.$emit('validated', false, [this.$t('applicant_no_generic')], this)
      } else if (this.value || this.readonly) {
        this.$emit('validated', true, '', this)
      } else {
        this.$emit('validated', false, [this.$t('applicant_must_select')], this)
      }
    },
    cancel() {
      this.operation = 'table'
    },
    create() {
      this.operation = 'create'
    },
    formCreated(response, sentObj) {
      if (!this.isPageComponent) {
        this.select(response.data)
      }
      this.operation = 'table'
    },
    formUpdated(response, sentObj) {
      if (!this.isPageComponent) {
        this.select(response.data)
        this.newApplicant(this.applicant)
      }
      this.operation = 'table'
    },
    emptyResult() {
      if (this.createOnEmpty) {
        this.operation = 'create'
      }
    },
    checkDefaultApplicant() {
      if (this.initialApplicantDoc) {
        return
      }
      if (
        this.applicantType &&
        this.isDefault &&
        this.defaultApplicant &&
        this.isReadyForWork
      ) {
        this.select(this.defaultApplicant)
      } else if (
        this.applicant &&
        this.applicant.id == this.defaultApplicant.id
      ) {
        this.unselect()
      }
    },
    ...mapActions('create', [
      'newApplicant',
      'setInitialFromApplicant',
      'setWithoutApplicant',
      'loadDetail',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.vue-form-generator .form-group {
  margin-bottom: 0;
}

.applicant {
  margin-top: -1rem;
  > div {
    margin-top: 1rem;
  }
  &__citizen,
  &__company {
    display: flex;
    flex-wrap: wrap;
    &__element {
      display: inline-flex;
      padding-bottom: 0.5em;
    }
  }
  &__citizen {
    &__element {
      flex: 0 1 25%;
    }
  }
  &__company {
    &__element {
      flex: 0 1 50%;
    }
  }
  &__buttons {
    display: flex;
    justify-content: flex-end;
    padding-top: 1em;
  }
}
</style>
