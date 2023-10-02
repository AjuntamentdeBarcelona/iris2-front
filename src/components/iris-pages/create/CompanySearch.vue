<template>
  <div>
    <div class="search-filters form-group">
      <form class="applicant-form row">
        <div class="col-3 col-sm-4">
          <label for="company_search_method">{{ $t('create_search_method') }}</label>
          <select
            id="company_search_method"
            v-model="applicantSearchFilter"
            class="form-control"
          >
            <option
              v-for="(value, key) in applicantSearchFilters"
              :key="key"
              :value="key"
            >
              {{ $t(value.label) }}
            </option>
          </select>
        </div>
        <template v-if="applicantSearchFilter == 'id'">
          <div class="form-group col-3 col-sm-4">
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
          <div class="form-group col-3 col-sm-4">
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
          :class="[isPageComponent ? 'col-lg-3 col-sm-12' : 'col-3 col-sm-4']"
          class="span-search d-flex pb-1"
        >
          <div class="mt-auto ml-auto d-flex">
            <button
              v-if="applicantSearchFilter"
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
      </form>
      <div class="mt-1 mb-1">
        <span
          v-if="hasMore"
          class="alert alert-info p-1">
          {{ $t('applicant_company_search_has_more') }}
        </span>
      </div>
    </div>

    <div class="table">
      <keep-alive>
        <applicant-table
          v-if="showTable"
          ref="companyTable"
          :applicant-type="applicantType"
          :url="url"
          :query-params="queryParams"
          :default-order-by="defaultOrderBy"
          :is-selectable="isSelectable"
          :enable-dowload-excel="isPageComponent"
          :inherited-detail-url="detailUrl"
          :is-page-component="isPageComponent"
          :allow-delete="isPageComponent"
          @select="select($event)"
          @loaded="onLoaded"
          @empty-result="emptyResult"
        />
      </keep-alive>
    </div>
  </div>
</template>


<script>
import ApplicantTable from '~/components/iris-pages/create/ApplicantTable.vue'

export const companySearchFilter = {
  id: {
    id: 0,
    label: 'cif',
  },
  social_reason: {
    id: 1,
    label: 'social_reason',
  },
}

export default {
  name: 'CompanySearch',
  components: {
    ApplicantTable,
  },
  props: {
    'applicant-type': {
      type: Number,
      required: true,
    },
    isPageComponent: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasMore: false,
      isSelectable: this.isPageComponent ? false : true,
      showTable: false,
      applicantSearchFilters: { ...companySearchFilter },
      applicantSearchFilter: Object.keys(companySearchFilter)[0],
      detailUrl: this.isPageComponent
        ? {
            name: 'backoffice-admin-applicant-entity-id',
          }
        : null,
      formData: {
        id: {
          cif: '',
        },
        social_reason: {
          social_reason: '',
        },
      },
      queryParams: { applicant_type: 'social_entity' },
      defaultOrderBy: {
        column: 'social_entity.social_reason',
        ascending: true,
      },
    }
  },
  created() {
    if (this.isPageComponent) {
      this.search()
    }
  },
  methods: {
    search(event) {
      this.showTable = true
      this.queryParams = Object.assign(
        {},
        this.formData[this.applicantSearchFilter],
        { applicant_type: 'social_entity' }
      )
    },
    select(applicant) {
      this.$emit('select', applicant)
    },
    onLoaded(response) {
      if (response.count === 1) {
        if (!this.isPageComponent) {
          this.select(response.data[0])
        }
      }
      this.hasMore = response.count == 10
    },
    emptyResult() {
      this.$emit('empty-result')
    },
  },
}
</script>

<style lang="scss" scoped>
.applicant-form {
  padding-top: 0.25rem;
  margin-top: 1rem;
  border-top: 1px solid $gray-500;
}
.form-group:not(.field-checkbox) {
  margin-bottom: 0;
  padding-bottom: 0.5rem;
}
</style>
