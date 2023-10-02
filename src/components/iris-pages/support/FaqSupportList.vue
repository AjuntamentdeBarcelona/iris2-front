<template>
  <div class="cardi cardi--files">
    <!-- Faq list -->
    <div
      id="faq-list"
      class="row"
    >
      <loader v-if="loading"/>
      <div
        v-else-if="loadingError"
        class="col-12 alert alert-warning d-flex justify-content-center"
      >
        <h4
          class="mb-0"
          v-text="$t('error_loading_data_explanation')"
        />
      </div>
      <div
        v-else-if="noItems"
        class="col-12 alert alert-info d-flex justify-content-center"
      >
        <h4
          class="mb-0"
          v-text="$t('support_no_elements')"
        />
      </div>
      <div
        v-for="item of supportItems"
        v-else
        :key="item.id"
        class="col-12"
      >
        <div
          v-b-toggle="item.id.toString()"
          class="faq__main-title"
        >
          <div class="d-flex align-items-center">
            <h4>{{ item.title }}</h4>
          </div>
          <i class="fas fa-caret-right" />
        </div>
        <b-collapse
          :id="item.id.toString()"
          class="w-100"
        >
          <!-- Admin buttons -->
          <edit-delete-buttons
            v-if="adminFeatures"
            :model="item"
            :buttons-text="true"
            class="mt-1"
            @edit-model="onEditModel"
            @delete-model="onDeleteModel"
          />
          <div class="row no-gutters faq__text">
            {{ item.description }}
          </div>
        </b-collapse>
      </div>
    </div>
    <!-- Pagination -->
    <div class="row d-flex justify-content-center">
      <b-pagination
        v-model="currentPage"
        :per-page="itemsPerPage"
        :total-rows="totalItems"
        aria-controls="faq-list"
        class="mt-1"
      />
    </div>
  </div>
</template>

<script>
import supportInfoLoadMixin from '~/components/iris-pages/support/supportInfoLoadMixin'
import { supportInfoType } from '~/assets/js/iris2/constants'
import EditDeleteButtons from '~/components/forms/buttons/EditDeleteButtons'
import Loader from '~/components/utils/Loader'

export default {
  name: 'FaqSupportList',
  components: {
    EditDeleteButtons,
    Loader,
  },
  mixins: [supportInfoLoadMixin],
  props: {
    supportInfoId: {
      type: Number,
      default: supportInfoType().faq.id,
    },
  },
  methods: {
    onEditModel(model) {
      this.$emit('edit-model', model)
    },
    onDeleteModel(model) {
      this.$emit('delete-model', model)
    },
  },
}
</script>

<style lang="scss" scoped>
.faq__main-title {
  color: $gray-600;
  border-bottom: 1px solid $gray-600;
  padding: 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    margin-bottom: 0px;
  }
  .fa-caret-right {
    text-align: right;
  }
}
.faq__text {
  padding: 15px 10px;
}
</style>
