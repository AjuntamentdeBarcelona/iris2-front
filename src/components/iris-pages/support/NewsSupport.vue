<template>
  <div class="irisbox support_news">
    <h3>{{ $t('support_news') }}</h3>

    <loader v-if="loading"/>
    <div
      v-else-if="loadingError"
      class="col-12 alert alert-warning d-flex justify-content-center"
    >
      <h5
        class="mb-0"
        v-text="$t('error_loading_data_explanation')"
      />
    </div>
    <div
      v-else-if="noItems"
      class="col-12 alert alert-info d-flex justify-content-center"
    >
      <h5
        class="mb-0"
        v-text="$t('support_no_elements')"
      />
    </div>
    <div
      v-else
      id="news-list"
    >
      <article
        v-for="item of supportItems"
        :key="item.id"
        class="support-article "
        @click="select(item)"
      >
        <div class="d-flex justify-content-between align-items-center flex-wrap">
          <span class="title">{{ item.created_at|date('Y') }} - {{ item.title }}</span>
          <edit-delete-buttons
            v-if="adminFeatures"
            :model="item"
            @click.native.prevent.stop
            @edit-model="onEditModel"
            @delete-model="onDeleteModel"
          />
        </div>
        <p>{{ item.description | truncate(400, true) }}</p>

      </article>
    </div>
    <!-- Pagination -->
    <div class="col-12 d-flex justify-content-center">
      <b-pagination
        v-model="currentPage"
        :per-page="itemsPerPage"
        :total-rows="totalItems"
        limit="1"
        aria-controls="video-list"
        class="mt-1"
      />
    </div>
    <!-- Modal -->
    <sweet-modal
      v-if="selected"
      ref="newsModal"
      :alt="$t('alert')"
      aria-describedby="modalDescription"
      role="alertdialog"
    >
      <h2>{{ selected.title }}</h2>
      <p>{{ selected.description }}</p>
    </sweet-modal>
  </div>
</template>

<script>
import supportInfoLoadMixin from '~/components/iris-pages/support/supportInfoLoadMixin'
import { supportInfoType } from '~/assets/js/iris2/constants'
import EditDeleteButtons from '~/components/forms/buttons/EditDeleteButtons'
import Loader from '~/components/utils/Loader'

export default {
  name: 'NewsSupport',
  components: {
    Loader,
    EditDeleteButtons,
  },
  mixins: [supportInfoLoadMixin],
  props: {
    supportInfoId: {
      type: Number,
      default: supportInfoType().news.id,
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      itemsPerPage: 4,
      selected: null,
    }
  },
  methods: {
    getParams() {
      return {
        ordering: '-created_at',
      }
    },
    async select(item) {
      this.selected = item
      await this.$nextTick()
      this.$refs.newsModal.open()
    },
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
$spacer: 0.5rem;
.support-article {
  cursor: pointer;
  margin: #{-$spacer} #{-$spacer} $spacer;
  padding: $spacer;
  padding-bottom: 2 * $spacer;
  transition: background-color 0.3s ease-in-out;
  border-radius: $border-radius;
  word-break: break-all;
  &:hover {
    background-color: rgba($primary, 0.1);
  }
  .title {
    font-weight: bold;
    font-size: 1.1rem;
  }
}
</style>
