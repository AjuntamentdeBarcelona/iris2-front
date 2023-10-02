<template>
  <div class="row">
    <!-- Videos -->
    <div
      id="video-list"
      class="cards col-12 d-flex flex-wrap justify-content-around"
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
      <b-card
        v-for="video in supportItems"
        v-else
        :key="video.id"
        :title="video.title"
        :img-alt="video.title"
        img-top
        tag="article"
        class="card-item"
        @click="onSelectVideo(video)"
      >
        <template slot="header">
          <b-card-body class="responsive-iframe-container">
            <div class="blocking-layer"/>
            <iframe
              :src="getEmbedLink(video.link)"
              :key="getEmbedLink(video.link)"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </b-card-body>
        </template>

        <b-card-text>
          {{ video.description | truncate(200, true) }}
        </b-card-text>
        <!-- Admin buttons -->
        <edit-delete-buttons
          v-if="adminFeatures"
          :model="video"
          class="mt-1 flex-wrap"
          @click.native.prevent.stop
          @edit-model="onEditModel"
          @delete-model="onDeleteModel"
        />
      </b-card>
    </div>
    <!-- Pagination -->
    <div class="col-12 d-flex justify-content-center">
      <b-pagination
        v-model="currentPage"
        :per-page="itemsPerPage"
        :total-rows="totalItems"
        aria-controls="video-list"
        class="mt-1"
      />
    </div>

    <!-- Modal -->
    <sweet-modal
      v-if="selectedVideo"
      ref="videoModal"
      :alt="$t('alert')"
      aria-describedby="modalDescription"
      role="alertdialog"
      @close="closeVideo"
    >
      <iframe
        :src="getEmbedLink(selectedVideo.link)"
        :key="getEmbedLink(selectedVideo.link)"
        width="560"
        height="315"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <hr>
      <h2>{{ selectedVideo.title }}</h2>
      <p>{{ selectedVideo.description }}</p>
    </sweet-modal>
  </div>
</template>

<script>
import supportInfoLoadMixin from '~/components/iris-pages/support/supportInfoLoadMixin'
import { supportInfoType } from '~/assets/js/iris2/constants'
import EditDeleteButtons from '~/components/forms/buttons/EditDeleteButtons'
import Loader from '~/components/utils/Loader'

export default {
  name: 'VideoSupport',
  components: {
    EditDeleteButtons,
    Loader,
  },
  mixins: [supportInfoLoadMixin],
  props: {
    supportInfoId: {
      type: Number,
      default: supportInfoType().video.id,
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedVideo: {},
    }
  },
  methods: {
    getEmbedLink(videoLink) {
      return videoLink ? videoLink.replace('watch?v=', 'embed/') : null
    },
    onSelectVideo(video) {
      this.selectedVideo = { ...video }
      this.openModal()
    },
    closeVideo() {
      this.selectedVideo = {}
    },
    openModal() {
      this.$refs.videoModal.open()
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
.cards {
  .card-item {
    width: calc(33.33% - 2rem);
    margin: 1rem;
    &:hover {
      cursor: pointer;
    }
    &:last-child {
      margin-right: auto;
    }
    .card-header {
      padding: 0;
      .responsive-iframe-container {
        overflow: hidden;
        // Calculated from the aspect ratio of the content (for 16:9 it's 9/16 = 0.5625)
        padding-top: 56.25%;
        position: relative;
        .blocking-layer {
          z-index: 1;
        }
        .blocking-layer,
        iframe {
          border: 0;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      }
    }
  }
}

/deep/ div.sweet-modal {
  overflow-y: auto;
}
</style>
