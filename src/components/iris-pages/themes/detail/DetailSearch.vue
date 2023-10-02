<template>
  <theme-tree-v-select
    v-model="selectValue"
    :loading="loading"
    :options="themes"
    :schema="schema"
    :placeholder="placeholder"
    :always-open="alwaysOpen"
    :no-collapse="noCollapse"
    :group-by-type="groupByType"
    @input="selectDetail"
  >
    <template slot="no-options">{{ $t('autocomplete_no_options') }}</template>
  </theme-tree-v-select>
</template>

<script>
import detailMixin from '~/components/pages/detail/detailMixin.js'
import trimAccents from '~/assets/js/utils/string/trimAccents.js'
import ThemeTreeVSelect from './ThemeTreeVSelect.vue'
import detailListToTree from './DetailTree.js'
import { mapState } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { mapActions } from 'vuex'

export default {
  name: 'DetailSearch',
  components: {
    ThemeTreeVSelect,
  },
  extends: detailMixin,
  props: {
    url: {
      type: String,
      default: 'api/theme/tree/',
    },
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
      search: '',
      opened: false,
      selected: null,
      selectValue: { ...this.value },
    }
  },
  computed: {
    ...mapState('create', ['detail']),
    ...mapState('create', { loadingDetail: 'loading' }),
    placeholder() {
      return this.selectValue && this.selectValue.id
        ? this.selectValue.description
        : this.$t('search_record_placeholder')
    },
    trimmedSearch() {
      return trimAccents(this.search.toLocaleUpperCase())
    },
    getUrl() {
      return this.schema.url ? this.schema.url : this.url
    },
    themes() {
      return this.model ? this.convertToTree(this.model) : {}
    },
    syncstore() {
      return _.get(this.schema, 'syncstore', true)
    },
    alwaysOpen() {
      return _.get(this.schema, 'alwaysOpen', false)
    },
    noCollapse() {
      return _.get(this.schema, 'noCollapse', false)
    },
    groupByType() {
      return _.get(this.schema, 'groupByType', true)
    },
  },
  watch: {
    detail() {
      if (!this.loadingDetail && this.syncstore) {
        this.selectValue = this.detail
      }
    },
  },
  methods: {
    ...mapActions('create', ['loadDetail']),
    selectDetail() {
      if (this.syncstore) {
        if (
          _.get(this.detail, 'id', null) != _.get(this.selectValue, 'id', null)
        ) {
          this.loadDetail(_.get(this.selectValue, 'id', null))
        }
      }
      this.$emit('model-updated', this.selectValue, this.schema.model)
      this.$emit('validated', true, [], this)
    },
    /**
     * If is a list, must be converted to tree.
     */
    convertToTree(model) {
      if (Array.isArray(model)) {
        return detailListToTree(model)
      } else if (Array.isArray(model.results)) {
        return detailListToTree(model.results)
      }
      return model
    },
    getPkPath() {
      return []
    },
    detailIsInSearch(detail) {
      if (this.search && this.search != '') {
        return (
          trimAccents(detail.description.toLocaleUpperCase()).indexOf(
            this.trimmedSearch
          ) >= 0 || this.keywordCheck(this.trimmedSearch, detail.keywords)
        )
      }
      return false
    },
    keywordCheck(search, keywords) {
      for (let word of search.split(/[\s,]+/)) {
        if (keywords.indexOf(this.trimmedSearch) < 0) {
          return false
        }
      }
      return true
    },
    onFocus(focus) {
      this.opened = focus
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
    &.collapsed svg {
      transform: rotate(-90deg);
    }
  }
  .elements li span {
    display: inline-block;
    min-width: 5rem;
    min-height: 1ch;
    cursor: pointer !important;
  }
}
</style>
