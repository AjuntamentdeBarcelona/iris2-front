<template>
  <div>
    <div class="search-filters form-group">
      <form class="applicant-form row">
        <div class="col-3 col-sm-4">
          <label for="citizen_search_method">{{ $t('create_search_method') }}</label>
          <select
            id="citizen_search_method"
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
            <label for="citizen_dni">{{ $t('identity_card') }}</label>
            <input
              id="citizen_dni"
              v-model.trim="formData.id.dni"
              :placeholder="$t('id_card_citizen')"
              type="text"
              class="form-control"
              @keydown.enter.prevent.stop="search" >
          </div>
        </template>
        <template v-if="applicantSearchFilter == 'name'">
          <div class="form-group col-3 col-sm-4">
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
          <div class="form-group col-3 col-sm-4">
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
          <div class="form-group col-3 col-sm-4">
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
          <div class="form-group col-9 col-sm-8">
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
        <div
          :class="[isPageComponent ? 'col-lg-3 col-sm-12' : 'col-3 col-sm-4', { 'max-width': applicantSearchFilter === 'full_name' }]"
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
      <div class="mt-1 mb-1">
        <span
          v-if="hasMore"
          class="alert alert-info p-1">
          {{ $t('applicant_search_has_more') }}
        </span>
      </div>
    </div>
    <div class="table">
      <keep-alive>
        <applicant-table
          v-if="showTable"
          ref="citizenTable"
          :applicant-type="applicantType"
          :query-params="queryParams"
          :default-order-by="defaultOrderBy"
          :url="url"
          :is-selectable="isSelectable"
          :enable-dowload-excel="isPageComponent"
          :inherited-detail-url="detailUrl"
          :is-page-component="isPageComponent"
          :allow-delete="isPageComponent"
          @empty-result="emptyResult"
          @select="select($event)"
          @loaded="onLoaded"
        />
      </keep-alive>
    </div>
  </div>
</template>


<script>
import ApplicantTable from '~/components/iris-pages/create/ApplicantTable.vue'

export const citizenSearchFilter = {
  id: {
    id: 0,
    label: 'identity_card',
  },
  name: {
    id: 1,
    label: 'name_and_surnames',
  },
  full_name: {
    id: 2,
    label: 'full_name',
  },
}

export default {
  name: 'CitizenSearch',
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
    allowNd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasMore: false,
      isSelectable: this.isPageComponent ? false : true,
      showTable: false,
      applicantSearchFilters: { ...citizenSearchFilter },
      applicantSearchFilter: Object.keys(citizenSearchFilter)[0],
      detailUrl: this.isPageComponent
        ? {
            name: 'backoffice-admin-applicant-citizen-id',
          }
        : null,
      formData: {
        id: {
          dni: '',
        },
        name: {
          name: '',
          first_surname: '',
          second_surname: '',
        },
        full_name: {
          full_normalized_name: '',
        },
      },
      queryParams: { applicant_type: 'citizen' },
      defaultOrderBy: {
        column: 'citizen.first_surname',
        ascending: true,
      },
    }
  },
  computed: {
    ndError() {
      return this.formData.id.dni == 'ND' && !this.allowNd
    },
  },
  created() {
    if (this.isPageComponent) {
      this.search()
    }
  },
  methods: {
    search(event) {
      if (!this.ndError) {
        this.queryParams = Object.assign(
          {},
          this.formData[this.applicantSearchFilter],
          { applicant_type: 'citizen' }
        )
        this.showTable = true
      }
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
.max-width {
  max-width: 100%;
  flex: 0 0 100%;
}
</style>
