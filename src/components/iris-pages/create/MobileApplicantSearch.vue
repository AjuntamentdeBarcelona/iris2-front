<template>
  <div class="mobile-applicant-search">
    <div class="search-filters form-group">
      <form class="applicant-form row">
        <div
          class="form-group field-radio d-flex flex-wrap col-12">
          <div
            v-for="(value, key) in applicantSearchFilters"
            :key="key"
            class="form-check ml-1 mr-2">
            <label
              v-if="value"
              :class="{mw: true}"
              class="form-check-label">
              <input
                :id="key"
                :value="key"
                v-model="applicantSearchFilter"
                type="radio"
                class="form-check-input"
              >
              {{ $t(value.label) }}
            </label>
          </div>
        </div>
        <template v-if="applicantSearchFilter == 'id'">
          <div class="form-group col-8">
            <label for="citizen_dni">{{ $t('identity_card') }}</label>
            <input
              id="citizen_dni"
              v-model.trim="formData.id.dni"
              :placeholder="$t('id_card')"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search" >
          </div>
        </template>
        <template v-if="applicantSearchFilter == 'name'">
          <div class="form-group col-8">
            <label for="citizen_name">{{ $t('name') }}</label>
            <input
              id="citizen_name"
              :placeholder="$t('name')"
              v-model.trim="formData.name.name"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search"
            >
          </div>
          <div class="form-group col-8">
            <label for="citizen_first_surname">{{ $t('first_surname') }}</label>
            <input
              id="citizen_first_surname"
              :placeholder="$t('first_surname')"
              v-model.trim="formData.name.first_surname"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search"
            >
          </div>
          <div class="form-group col-8">
            <label for="citizen_second_surname">{{ $t('second_surname') }}</label>
            <input
              id="citizen_second_surname"
              :placeholder="$t('second_surname')"
              v-model.trim="formData.name.second_surname"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search"
            >
          </div>
        </template>
        <template v-if="applicantSearchFilter == 'full_name'">
          <div class="form-group col-8">
            <label for="citizen_full_name">{{ $t('full_name') }}</label>
            <input
              id="citizen_full_name"
              :placeholder="$t('full_name')"
              v-model.trim="formData.full_name.full_normalized_name"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search"
            >
          </div>
        </template>
        <template v-if="applicantSearchFilter == 'cif'">
          <div class="form-group col-8">
            <label for="company_cif">{{ $t('cif') }}</label>
            <input
              id="company_cif"
              v-model.trim="formData.id.cif"
              :placeholder="$t('cif')"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search"
            >
          </div>
        </template>
        <template v-if="applicantSearchFilter == 'social_reason'">
          <div class="form-group col-8">
            <label for="company_social_reason">{{ $t('social_reason') }}</label>
            <input
              id="company_social_reason"
              :placeholder="$t('social_reason')"
              v-model.trim="formData.social_reason.social_reason"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search"
            >
          </div>
        </template>
        <div 
          class="span-search d-flex pb-1"
        >
          <div class="mt-auto ml-auto d-flex">
            <button
              v-if="applicantSearchFilter"
              :disabled="ndError"
              class="btn btn-primary mr-1"
              @click.prevent="search"
            >
              <font-awesome-icon
                :icon="['fas', 'search']"
                class="mr-1"/>
              {{ $t('search') }}
            </button>
            <slot name="extra-buttons" />
          </div>
        </div>
        <div
          v-if="ndError"
          class="alert alert-danger col-12">
          {{ $t('user_cant_select_nd_user') }}
        </div>
      </form>
    </div>

    <div class="table">
      <keep-alive>
        <mobile-applicant-table
          v-if="showTable"
          ref="mobile-table"
          :applicant-type="detectedApplicantType"
          :query-params="queryParams"
          :url="url"
          :is-selectable="isSelectable"
          :enable-dowload-excel="isPageComponent"
          :inherited-detail-url="detailUrl"
          :is-page-component="isPageComponent"
          :allow-delete="isPageComponent"
          @select="select($event)"
          @loaded="onLoaded"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import CitizenSearch from '~/components/iris-pages/create/CitizenSearch.vue'
import MobileApplicantTable from '~/components/iris-pages/create/MobileApplicantTable.vue'
import { citizenSearchFilter } from '~/components/iris-pages/create/CitizenSearch.vue'
import { companySearchFilter } from '~/components/iris-pages/create/CompanySearch.vue'

export default {
  name: 'MobileApplicantSearch',
  components: {
    'mobile-applicant-table': MobileApplicantTable,
  },
  extends: CitizenSearch,
  data() {
    let filters = {
      ...citizenSearchFilter,
      id: {
        id: 0,
        label: 'identity_card_short',
      },
      cif: companySearchFilter.id,
      social_reason: companySearchFilter.social_reason,
      name: undefined,
    }
    return {
      applicantSearchFilters: filters,
      applicantSearchFilter: Object.keys(citizenSearchFilter)[0],
      formData: {
        cif: {
          cif: '',
        },
        social_reason: {
          social_reason: '',
        },
      },
    }
  },
  computed: {
    detectedApplicantType() {
      return citizenSearchFilter[this.applicantSearchFilter] ? 0 : 1
    },
  },
}
</script>

<style lang="scss">
.mobile-applicant-search {
  .search-filters {
    .form-check.mw {
      min-width: 40%;
    }
  }
  .table {
    .irisbox {
      padding: 0px;
      thead {
        display: none;
      }
    }
  }
}
</style>
