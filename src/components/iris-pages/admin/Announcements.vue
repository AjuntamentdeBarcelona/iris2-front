<template>
  <div
    :class="{ loading: loading }"
    class="announcements list"
  >
    <slot name="head">
      <header class="announcements-header col-12">
        <span>
          {{ $t('announcements') }}
        </span>
        <span v-if="showOpinion">
          <nuxt-link
            :to="localePath('backoffice-create-survey')"
          >
            <font-awesome-icon icon="edit" />
            {{ $t('record_card_create_survey') }}
          </nuxt-link>
        </span>
      </header>
    </slot>
    <div
      v-if="items.length"
      class="list-content row"
    >
      <slot
        v-for="item in items"
        :item="item"
        name="list-items"
      >
        <div
          :key="item.id"
          class="list-content-item col-12 col-md-6 col-lg-3 col-xs-12"
        >

          <div
            :class="{ important: item.important }"
            class="announcements-item border"
          >
            <div class="flag">
              <div class="flag--element">
                <font-awesome-icon icon="exclamation-circle" />
              </div>
            </div>
            <header class="announcements-itemTitle">
              {{ item.title }}
            </header>
            <div class="announcements-itemDescription">
              {{ item.description }}
            </div>
            <footer class="announcements-itemFooter">
              <i class="fas fa-info" />
              {{ formatDate(item.created_at) }}
            </footer>
          </div>
        </div>
        <read-confirm
          v-if="item.important && !item.seen"
          ref="readModal"
          :item="item"
        />
      </slot>
    </div>
    <div
      v-else
      class="list-content"
    >
      <slot name="list-items">
        <p>{{ no_announcements_message }}</p>
      </slot>
      <div
        v-if="loading"
        class="loading-overlay"
      >
        <div class="loader" />
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import List from '~/components/pages/list/List.vue'
import ReadConfirm from '~/components/pages/list/ReadConfirm.vue'
import { dateHourMinute } from '~/assets/js/helpers.js'

export default {
  components: { 'read-confirm': ReadConfirm },
  extends: List,
  props: {
    url: {
      type: String,
      default: '/api/masters/announcements/',
    },
    showOpinion: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      no_announcements_message: this.$t('dashboard_no_announcements_message'),
    }
  },
  methods: {
    formatDate(dateStr) {
      if (dateStr) {
        return dateHourMinute(dateStr)
      }
      return '-'
    },
  },
}
</script>

<style lang="scss">
.announcements {
  .list {
    &-content {
      padding: 0 1rem;
      &-item {
        padding: 1rem;
      }
    }
  }
  .flag {
    display: none;
  }
  .important {
    .flag {
      display: block;
      background-color: $primary;
      position: absolute;
      top: -1rem;
      right: -4rem;
      transform: rotate(30deg) translateY(1.5rem);
      width: 10rem;
      text-align: center;
      &--element {
        transform: rotate(-30deg);
        color: $white;
        .svg-inline--fa {
          margin: 0.3em;
        }
      }
    }
    header {
      color: $primary !important;
    }
    border: 3px solid $primary !important;
  }
  &-header {
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    background: none;
  }
  &-item {
    position: relative;
    overflow: hidden;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    margin-bottom: 1.5rem;
  }
  &-itemTitle {
    height: initial;
    padding-left: 0;
    padding-right: 0;
    font-weight: 700;
    background: none;
  }
  &-itemFooter {
    margin-top: auto;
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border: none !important;
    .fa-info {
      width: 1.6em;
      height: 1.6em;
      display: flex;
      padding: 0.3em 0.6em;
      background-color: $gray-400;
      border-radius: 1rem;
      margin-right: 0.8em;
    }
  }
}
</style>
