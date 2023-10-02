import trimAccents from '~/assets/js/utils/string/trimAccents.js'
import _ from 'lodash'
import moment from 'moment'
import { mapGetters } from 'vuex'
import Permissions from '~/assets/js/iris2/Permissions.js'
import RecordType from '~/assets/js/iris2/model/RecordType.js'
import { mapState } from 'vuex'
import { pad } from '~/assets/js/helpers'

/**
 * Mixin with helper functions for working with the detail tree, including filtering.
 */
export default {
  props: {
    schema: {
      type: Object,
      default() {
        return {
          application: null,
          excludeRecordTypeId: null,
        }
      },
    },
  },
  data() {
    return {
      keywords: [],
      empty: false,
    }
  },
  computed: {
    ...mapState({
      backApp: 'applicationId',
      defaultExcludeRecordType: state =>
        state.config.EXCLUDE_RECORD_TYPE_DEFAULT,
    }),
    minSearchLength() {
      return 1
    },
    minKeywordLength() {
      return 1
    },
    minKeywordCount() {
      return 1
    },
    application() {
      const app = _.get(this.schema, 'application', undefined)
      return app !== undefined
        ? app == null
          ? app
          : parseInt(app)
        : this.backApp
    },
    /**
     * By default it's required to ignore RecordType.CONSULTA on creation.
     * @returns
     */
    excludeRecordTypeId() {
      return _.get(
        this.schema,
        'excludeRecordTypeId',
        this.defaultExcludeRecordType
      )
    },
    initialFilter() {
      return _.get(this.schema, 'initialFilter', item => true)
    },
    canSeeHidden() {
      if (this.schema.noHidden) {
        return false
      }
      return this.hasPermission(
        Permissions.RECORD.RECORD_CREATE_THEME_NOVISIBLE
      )
    },
    ...mapGetters('groups', { hasPermission: 'hasPermission' }),
  },
  methods: {
    displayTree() {
      const claimTree = this.buildTree(
        item => item.record_type_id != RecordType.CONSULTA
      )
      const queryTree = this.buildTree(
        item => item.record_type_id == RecordType.CONSULTA
      )
      return [
        {
          label: this.$t('tree_claims'),
          areas: claimTree,
          query: false,
        },
        {
          label: this.$t('tree_query'),
          areas: queryTree,
          query: true,
        },
      ].filter(item => item.areas.filter(area => area.visible).length)
    },
    /**
     * Addapt tree to a better structure for display.
     * Apply the filters that don't depend on user input.
     */
    buildTree(detailFilter) {
      let tree = []
      let visible = false
      for (let area_id in this.options) {
        visible = false
        let area = { id: parseInt(area_id), ...this.options[area_id] }
        let elements = []
        for (let element_id in area.elements) {
          const element = {
            id: parseInt(element_id),
            ...area.elements[element_id],
            visible: false,
          }
          let details = []
          for (let detail_id in element.details) {
            const detail = element.details[detail_id]
            if (
              this.isActive(detail) &&
              this.initialFilter(detail, element, area) &&
              this.isRecordTypeActive(detail) &&
              detailFilter(detail)
            ) {
              detail.hidden = !this.isVisible(detail)
              if (!detail.hidden || this.canSeeHidden) {
                visible = true
                element.visible = true
              }
              details.push({
                ...detail,
                id: parseInt(detail_id),
                search_id: detail.detail_code.trim()
                  ? detail.detail_code.trim()
                  : detail.id,
                display_id: detail.detail_code.trim()
                  ? detail.detail_code.trim()
                  : pad(detail.id, 7),
                area: { ...area, elements: null },
                area_id: area_id,
                element_id: element_id,
                canSee: this.canSeeHidden,
                element: { ...element, details: null },
              })
            }
          }
          element.details = this.sort(details, 'description')
          if (!_.isEmpty(details)) {
            elements.push(element)
          }
        }
        area.elements = this.sort(elements, 'description')
        area.autoopen = area.elements.length == 1
        area.visible = visible || this.canSeeHidden
        if (!_.isEmpty(elements)) {
          tree.push(area)
        }
      }
      return this.sort(tree, 'description')
    },
    sort(ordered, attr) {
      return ordered.sort((a, b) => {
        if (a.order == b.order) {
          return a[attr].localeCompare(b[attr])
        } else if (a.order > b.order) {
          return 1
        } else {
          return -1
        }
      })
    },
    filterTree(search) {
      let trimmedSearch = null
      trimmedSearch = search ? trimAccents(search).toLocaleUpperCase() : null
      this.keywords = search
        .split(/[\s,]+/)
        .filter(w => w.length >= this.minKeywordLength)
      let empty = true
      let tree = []
      for (let block of this.mutableOptions) {
        const areas = []
        for (let area of block.areas) {
          let elements = []
          for (let element of area.elements) {
            let details = []
            for (let detail of element.details) {
              if (this.detailIsInSearch(detail, trimmedSearch)) {
                empty = false
                details.push(detail)
              }
            }
            if (details.length > 0) {
              elements.push({
                ...element,
                details: details,
              })
            }
          }
          if (elements.length > 0) {
            areas.push({
              ...area,
              elements: elements,
            })
          }
        }
        tree.push({
          ...block,
          areas: areas,
        })
      }
      this.empty = empty
      return tree
    },
    detailIsInSearch(detail, search) {
      if (search && search != '') {
        return (
          trimAccents(detail.description.toLocaleUpperCase()).indexOf(search) >=
            0 ||
          this.keywordCheck(search, detail.keywords) ||
          detail.detail_code.includes(search)
        )
      }
      return true
    },
    isApplicationActive(detail) {
      return (
        this.application == null ||
        detail.applications.indexOf(this.application) >= 0
      )
    },
    isRecordTypeActive(detail) {
      return (
        this.excludeRecordTypeId == null ||
        this.excludeRecordTypeId != detail.record_type_id
      )
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
      if (detail.visible && this.isApplicationActive(detail)) {
        if (!detail.visible_date) {
          return true
        }
        return moment(detail.visible_date, 'YYYY-MM-DD') <= moment()
      }
      return false
    },
    /**
     * All keywords must be matched
     * @param {*} search
     * @param {*} detailKeywords
     */
    keywordCheck(search, detailKeywords) {
      return !this.keywords.find(w => {
        return detailKeywords.indexOf(trimAccents(w).toLocaleUpperCase()) < 0
      })
    },
  },
}
