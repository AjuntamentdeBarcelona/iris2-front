<template>
  <div 
    v-if="isAllowed"
    class="groups">
    <header class="contentwrapper__header">
      <h1
        class="title-line"
      >{{ $t('navigation_groups') }}</h1>
      <nuxt-link
        v-if="canAddGroups"
        :to="localePath(getAddUrl())"
        class="btn btn-outline-secondary add"
      >
        <font-awesome-icon icon="plus" />
        {{ $t('add') }}
      </nuxt-link>
    </header>

    <div
      v-if="loading"
      class="irisbox">
      <div
        class="loading-overlay"
      >
        <div class="loader" />
      </div>
    </div>
    <div
      v-else
      class="irisbox">
      <div class="d-flex pb-2">
        <div class="form-group col-4 p-0">
          <span class="input-group">
            <input
              v-model="internalSearch"
              :placeholder="$t('search')"
              type="text"
              class="form-control">
          </span>
        </div>
      </div>
      <group-tree
        :show-children="!!search"
        :group="filteredGroups"
        :detail-url="detailUrl"
        @on-delete="onDelete"
      />
    </div>

    <!-- Deletion Modal -->
    <modal-form
      ref="deleteConfirm"
      :modal-text-content="modalTextContent"
      :form-component="formComponent"
      :form-props="formProps"
      @form-saved="onDeleted"
    />
  </div>
  <unauthorized-page v-else />
</template>


<script>
import GroupTree from '~/components/iris-pages/groups/GroupTree'
import DeleteConfirm from '~/components/pages/list/DeleteConfirm'
import ModalForm from '~/components/forms/modals/ModalForm'
import GroupDeletion from '~/components/iris-pages/groups/GroupDeletion'
import { mapActions, mapGetters } from 'vuex'
import trimAccents from '~/assets/js/utils/string/trimAccents.js'
import _ from 'lodash'
import AdminMixin from '~/pages/backoffice/admin/AdminMixin.js'
import Permissions from '~/assets/js/iris2/Permissions.js'
import UnauthorizedPage from '~/components/pages/authorization/UnauthorizedPage.vue'

export default {
  name: 'GroupTreePage',
  layout: 'backoffice',
  components: {
    GroupTree,
    DeleteConfirm,
    ModalForm,
    UnauthorizedPage,
  },
  mixins: [AdminMixin],
  data() {
    return {
      loading: true,
      formComponent: GroupDeletion,
      addUrl: {
        name: 'backoffice-admin-access-groups-group',
      },
      detailUrl: {
        name: 'backoffice-admin-access-groups-id',
      },
      deleteGroup: null,
      hasChildren: null,
      delSuccessMessageTitle: this.$t('delete_success_title'),
      internalSearch: '',
      search: '',
      groups: [],
    }
  },
  computed: {
    ...mapGetters('groups', ['hasPermission']),
    isAllowed() {
      return this.hasPermission(Permissions.APP.ADMIN)
    },
    formProps() {
      return {
        'delete-id': _.get(this, 'deleteGroup.id'),
      }
    },
    modalTextContent() {
      const group = this.deleteGroup ? this.deleteGroup.name : ''
      return `${this.$t('groups_delete_group')}: <b>${group}</b>`
    },
    canAddGroups() {
      return true
    },
    delSuccessMessage() {
      return this.hasChildren
        ? this.$t('delete_success_message_2')
        : this.$t('delete_success_message')
    },
    filteredGroups() {
      let groups = this.filterGroups(
        this.groups,
        trimAccents(this.search.toLowerCase().trim())
      )
      return groups
    },
  },
  watch: {
    internalSearch() {
      this.debouncedSetSearch()
    },
  },
  created() {
    this.debouncedSetSearch = _.debounce(this.setSearch, 500)
  },
  mounted() {
    this.load()
  },
  methods: {
    ...mapActions('masters', ['retrieveGroups']),
    load() {
      this.loading = true
      const promise = this.$axios
        .get('api/profiles/groups/tree/')
        .then(resp => {
          this.groups = resp.data
        })
      promise.catch(() => {}).then(() => {
        this.loading = false
      })
    },
    onDelete(group, hasChildren) {
      this.deleteGroup = group
      this.hasChildren = hasChildren
      this.$refs.deleteConfirm.open()
    },
    onDeleted() {
      this.$refs.deleteConfirm.close()
      this.deleteGroup = null
      this.refresh()
      this.showSuccessMessage()
      this.hasChildren = null
    },
    refresh() {
      this.load()
    },
    showSuccessMessage() {
      this.$notify({
        group: 'iris',
        title: this.delSuccessMessageTitle,
        type: 'error',
        text: this.delSuccessMessage,
      })
    },
    getAddUrl() {
      return Object.assign({}, this.addUrl, {
        query: this.getRequestParams(),
      })
    },
    getRequestParams(data) {
      return Object.assign({}, data, this.queryParams)
    },
    setSearch() {
      this.search = this.internalSearch
    },
    filterGroups(group, search) {
      group = group || this.groups
      const filteredChilds = group.childrens
        .map(child => this.filterGroups(child, search))
        .filter(child => child != null)
      if (
        !search ||
        trimAccents(group.name)
          .toLowerCase()
          .indexOf(search) >= 0 ||
        filteredChilds.length > 0
      ) {
        return {
          ...group,
          childrens: _.sortBy(filteredChilds, ['name']),
        }
      }
      return null
    },
  },
}
</script>
