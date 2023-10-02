<template>
  <div class="theme-tree">
    <div
      v-if="loading"
      class="loading-overlay d-flex justify-content-center align-items-center">
      <div class="loader" />
    </div>
    <ul
      v-if="!loading"
      class="list-unstyled pl-2 pt-2">
      <li
        v-for="area in displayTree"
        :key="area.id"
      >
        <span
          v-b-toggle="`c-area-${area.id}`"
          :id="`area-${area.id}`"
          class="font-weight-bold"
        >
          {{ area.description }}
          <font-awesome-icon
            icon="caret-down caret"
            class="ml-1"
          />
        </span>
        <b-collapse
          :id="`c-area-${area.id}`"
          visible
        >
          <ul
            class="list-unstyled text-muted pl-2"
          >
            <li
              v-for="element in area.elements"
              :key="element.id"
              class="element">
              <span
                v-b-toggle="`c-element-${element.id}`"
                :id="`element-${element.id}`"
              >
                {{ element.description }}

                <button 
                  class="btn btn-outline-secondary"
                  @click="selectElement(element)">{{ $t('select') }}
                  <font-awesome-icon icon="forward"/>
                </button>
                <font-awesome-icon
                  icon="caret-down"
                  class="ml-1 fa-xs caret"
                />
              </span>
              <b-collapse
                :id="`c-element-${element.id}`"
                :visible="search !== ''"
              >
                <ul class="elements">
                  <li
                    v-for="detail in element.details"
                    v-show="isVisible(detail) || canSeeHidden"
                    :key="detail.id"
                  >
                    <span
                      :id="`detail-${detail.id}`"
                      class="disabled"
                    >
                      {{ detail.description }}
                      <b v-show="!isVisible(detail)">({{ $t('hidden') }})</b>
                    </span>
                  </li>
                </ul>
              </b-collapse>
            </li>
          </ul>
        </b-collapse>
      </li>
    </ul>
  </div>
</template>

<script>
import detailMixin from '~/components/pages/detail/detailMixin.js'
import trimAccents from '~/assets/js/utils/string/trimAccents.js'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import ThemeTreeSelector from '~/components/iris-pages/themes/ThemeTreeSelector.vue'

export default {
  name: 'ElementTreeSelector',
  extends: ThemeTreeSelector,
  computed: {
    /**
     * Addapt tree to a better structure for display.
     */
    canSeeHidden() {
      return true
    },
  },
  methods: {
    selectElement(element) {
      this.$emit('select-detail', element)
    },
    detailIsInSearch(detail) {
      return true
    },
    isActive(detail) {
      if (detail.active) {
        if (!detail.activation_date) {
          return true
        }
        return moment(detail.activation_date, 'YYYY-MM-DD') <= moment()
      }
      return false
    },
    isVisible(detail) {
      if (detail.visible) {
        if (!detail.visible_date) {
          return true
        }
        return moment(detail.visible_date, 'YYYY-MM-DD') <= moment()
      }
      return false
    },
  },
}
</script>

<style lang="scss">
.theme-tree {
  .element {
    padding: 5px;
  }
}
</style>
