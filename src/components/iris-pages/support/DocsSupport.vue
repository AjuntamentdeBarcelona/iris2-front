<template>
  <div>
    <b-nav
      v-if="!propData"
      pills
      fill
    >
      <b-nav-item
        :active="selectedCategoryId === undefined"
        @click="filterTableByCategory(undefined)"
      >{{ $t('support_docs_all') }}</b-nav-item>
      <b-nav-item
        v-for="category in categories"
        :key="category.id"
        :active="selectedCategoryId === category.id"
        @click="filterTableByCategory(category.id)"
      >
        {{ category.shortName }}
      </b-nav-item>
    </b-nav>

    <docs-support-table
      ref="table"
      :query-params="tableQueryParams"
      :prop-data="propData"
      :admin-features="adminFeatures"
    >
      <template
        v-if="adminFeatures"
        slot="external-actions"
        slot-scope="props"
      >
        <edit-delete-buttons
          :model="props.row"
          @edit-model="onEditModel"
          @delete-model="onDeleteModel"
        />
      </template>
    </docs-support-table>
  </div>
</template>

<script>
import DocsSupportTable from '~/components/iris-pages/support/DocsSupportTable'
import EditDeleteButtons from '~/components/forms/buttons/EditDeleteButtons'
import {
  supportInfoType,
  supportInfoCategory,
} from '~/assets/js/iris2/constants'

const defaultQueryParams = {
  type: supportInfoType().documentation.id,
  category: undefined,
}

export default {
  name: 'DocsSupport',
  components: {
    DocsSupportTable,
    EditDeleteButtons,
  },
  props: {
    propData: {
      type: Array,
      default: () => undefined,
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedCategoryId: undefined,
    }
  },
  computed: {
    tableQueryParams() {
      return {
        ...defaultQueryParams,
        category: this.selectedCategoryId,
      }
    },
  },
  created() {
    this.categories = Object.values(supportInfoCategory(this))
  },
  methods: {
    onEditModel(model) {
      this.$emit('edit-model', model)
    },
    onDeleteModel(model) {
      this.$emit('delete-model', model)
    },
    async filterTableByCategory(categoryId) {
      this.selectedCategoryId = categoryId
      await this.$nextTick()
      this.refresh()
    },
    refresh() {
      this.$refs.table.refresh()
    },
  },
}
</script>
