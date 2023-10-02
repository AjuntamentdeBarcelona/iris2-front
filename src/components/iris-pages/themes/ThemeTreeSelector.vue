<template>
  <div class="theme-tree">
    <div
      v-if="loading"
      class="loading-overlay d-flex justify-content-center align-items-center">
      <div class="loader" />
    </div>
    <span 
      class="input-group">
      <input
        v-model="search"
        placeholder="Cerca per paraula clau, per descripció..."
        type="text"
        class="form-control">
    </span>
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
            icon="caret-down"
            class="ml-1 caret"
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
              :key="element.id">
              <span
                v-b-toggle="`c-element-${element.id}`"
                :id="`element-${element.id}`"
              >
                {{ element.description }}
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
                      @click="selectDetail(detail)"
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
import Permissions from '~/assets/js/iris2/Permissions.js'

export default {
  name: 'ThemeTreeSelector',
  extends: detailMixin,
  props: {
    url: {
      type: String,
      default: 'api/theme/tree/',
    },
    application: {
      type: Number,
      default: null,
      required: false,
    },
    excludeRecordTypeId: {
      type: Number,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      search: '',
    }
  },
  computed: {
    trimmedSearch() {
      return trimAccents(this.search.toLocaleUpperCase())
    },
    themes() {
      return this.model ? this.model : {}
    },
    /**
     * Addapt tree to a better structure for display.
     */
    displayTree() {
      let tree = []
      for (let area_id in this.themes) {
        let area = { id: parseInt(area_id), ...this.themes[area_id] }
        let elements = []
        for (let element_id in area.elements) {
          const element = {
            id: parseInt(element_id),
            area: area,
            ...area.elements[element_id],
          }
          let details = []
          for (let detail_id in element.details) {
            const detail = element.details[detail_id]
            if (this.detailIsInSearch(detail)) {
              details.push({
                ...element.details[detail_id],
                id: parseInt(detail_id),
                area: area,
                area_id: area_id,
                element_id: element_id,
                element: element,
              })
            }
          }
          element.details = details.sort(
            (a, b) => a.description > b.description
          )
          if (!_.isEmpty(details)) {
            elements.push(element)
          }
        }
        area.elements = elements.sort((a, b) => a.description > b.description)
        if (!_.isEmpty(elements)) {
          tree.push(area)
        }
      }
      return tree.sort((a, b) => a.description > b.description)
    },
    canSeeHidden() {
      return this.hasPermission(
        Permissions.RECORD.RECORD_CREATE_THEME_NOVISIBLE
      )
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
  },
  methods: {
    selectDetail(detail) {
      this.$emit('select-detail', detail)
    },
    getPkPath() {
      return []
    },
    /**
     * Filter which details has to appear in tree. Three criteria:
     * - Number search for theme code
     * - Keyword
     * - Description
     */
    detailIsInSearch(detail) {
      if (
        this.application &&
        detail.applications.indexOf(this.application) < 0
      ) {
        return false
      }
      if (
        this.excludeRecordTypeId &&
        this.excludeRecordTypeId == detail.record_type_id
      ) {
        return false
      }
      if (this.isActive(detail)) {
        if (this.search && this.search != '') {
          return (
            trimAccents(detail.description.toLocaleUpperCase()).indexOf(
              this.trimmedSearch
            ) >= 0 || detail.keywords.indexOf(this.trimmedSearch) >= 0
          )
        }
        return true
      }
      return false
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

<style lang="scss" scoped>
.theme-tree {
  li {
    cursor: default;
  }
  li > span {
    line-height: 1.5em;
    svg {
      transition: transform 0.3s ease-out;
    }
    &.collapsed svg.caret {
      transform: rotate(-90deg);
    }
  }
  .elements li span:not(.disabled) {
    display: inline-block;
    min-width: 5rem;
    min-height: 1ch;
    cursor: pointer !important;
  }
}
</style>
