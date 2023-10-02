<template>
  <div class="support-section">
    <h1 v-text="$t('navigation_support')"/>

    <!-- Layout 1 (filter results) -->
    <div v-if="filter">
      <support-filter
        v-model="filter"
        :selection="selection"
        @unselect="onUnselect"
      />
      <filter-results-table
        :query-params="resultsTableQueryParams"
        class="irisbox"
        @item-selected="onSearchItemSelected"
      />
    </div>

    <!-- Layout 2 (result selection) -->
    <template
      v-else-if="selectedItem"
    >
      <!-- Filter component -->
      <support-filter
        v-model="filter"
        :selection="selection"
        @unselect="onUnselect"
      />

      <!-- Selection result -->

      <div class="irisbox">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h2
            class="mb-0"
            v-text="selectedItemDisplayComponent.title"
          />
          <!-- <button
              v-if="selection"
              class="btn btn-primary"
              @click="onUnselect"
              v-text="$t('support_unselect')"
            /> -->
        </div>
        <component
          ref="filterResultSupportComponent"
          :is="selectedItemDisplayComponent.component"
          :prop-data="[selectedItem]"
          :admin-features="userHasAdminPermission"
          @edit-model="onEditModel"
          @delete-model="onDeleteModel"
        />
      </div>
    </template>

    <!-- Layout 3 (type tabs) -->
    <div
      v-else
      class="row"
    >
      <!-- Left block (filter + tabs) -->
      <div class="col-12 col-lg-9">

        <!-- Filter component -->
        <support-filter
          v-model="filter"
          :selection="selection"
          @unselect="onUnselect"
        />

        <!-- Tabs -->
        <b-tabs
          v-model="selectedTabIndex"
          nav-class="fullexpand"
          class="irisbox mb-0"
          lazy
        >
          <b-tab
            v-for="(componentGroup, index) in supportDisplayComponents"
            :key="index"
            :title="componentGroup.title"
            :title-link-class="getTabLinkClasses(index)"
          >
            <component
              :ref="`supportComponent_type_${componentGroup.id}`"
              :is="componentGroup.component"
              :admin-features="userHasAdminPermission"
              @edit-model="onEditModel"
              @delete-model="onDeleteModel"
            />
          </b-tab>
        </b-tabs>

      </div>

      <!-- Right block -->
      <div class="col-12 col-lg-3 mb-0 mt-3 mt-lg-0">
        <!-- News -->
        <news-support
          ref="news"
          :admin-features="userHasAdminPermission"
          @edit-model="onEditModel"
          @delete-model="onDeleteModel"/>

        <!-- Create element -->
        <support-item-form
          v-if="userHasAdminPermission"
          :key="creationFormRenderKey"
          :reset-default-button="true"
          v-on="formEventHandlers"
        />
      </div>

    </div>

    <!-- Edit/Delete Modal -->
    <MountingPortal
      mount-to="body"
      append
    >
      <!-- Edition modal -->
      <sweet-modal
        v-if="editModalOpened"
        ref="editModal"
        class="edit-modal"
        blocking
        enable-mobile-fullscreen
        @open="onEditModalOpen"
      >
        <support-item-form
          v-bind="formProps"
          :key="modalFormRenderKey"
          title="support_edit_support_item"
          class="save-btn-right"
          v-on="formEventHandlers"
        />
      </sweet-modal>

      <!-- Deletion modal -->
      <delete-confirm
        v-if="deleteModalOpened"
        ref="deleteModal"
        :url="saveUrl"
        @on-deleted="onFormSaved"
      />

      <!-- Uploading modal -->
      <sweet-modal
        v-if="uploadingModalOpened"
        ref="uploadingModal"
        :hide-close-button="true"
        class="uploading-modal"
        icon="success"
        blocking
        enable-mobile-fullscreen
      >
        <span class="title">
          {{ $t('support_save_success_title') }}
        </span>

        <div
          v-if="uploadData.success === null"
          class="alert alert-info"
        >{{ $t('record_card_files_uploading') }}
          <font-awesome-icon
            icon="spinner"
            class="fa-pulse"
          />
        </div>
        <template v-else>
          <div
            v-if="uploadData.success === false"
            class="alert alert-warning"
          >{{ $t('support_file_error') }}</div>
          <div
            v-else-if="uploadData.success === true"
            class="alert alert-success"
          >{{ $t('record_card_files_success') }}</div>
          <div class="sweet-buttons">
            <button
              slot="button"
              class="btn btn-primary"
              autofocus
              @click="closeUploadingModal"
            >
              <font-awesome-icon icon="sign-out-alt" />
              {{ $t('close_and_continue') }}
            </button>
          </div>
        </template>
      </sweet-modal>
    </MountingPortal>
  </div>
</template>

<script>
import FaqSupportList from '~/components/iris-pages/support/FaqSupportList'
import GlossarySupport from '~/components/iris-pages/support/GlossarySupport'
import DocsSupport from '~/components/iris-pages/support/DocsSupport'
import VideoSupport from '~/components/iris-pages/support/VideoSupport'
import NewsSupport from '~/components/iris-pages/support/NewsSupport'
import SupportItemForm from '~/components/iris-pages/support/SupportItemForm'
import SupportFilter from '~/components/iris-pages/support/SupportFilter'
import FilterResultsTable from '~/components/iris-pages/support/FilterResultsTable'
import Permissions from '~/assets/js/iris2/Permissions.js'
import { supportInfoType, supportEndpoint } from '~/assets/js/iris2/constants'
import DeleteConfirm from '~/components/pages/list/DeleteConfirm'
import { mapGetters } from 'vuex'

export default {
  name: 'SupportPage',
  layout: 'backoffice',
  components: {
    NewsSupport,
    SupportFilter,
    FilterResultsTable,
    SupportItemForm,
    DeleteConfirm,
  },
  data() {
    return {
      modalFormRenderKey: 0,
      creationFormRenderKey: 0,
      selectedTabIndex: 0,
      filter: '',
      selectedItem: null,
      adminItem: null,
      supportDisplayComponents: [
        {
          id: supportInfoType(this).faq.id,
          title: this.$t('support_faq_questions'),
          component: FaqSupportList,
        },
        {
          id: supportInfoType(this).glossary.id,
          title: this.$t('support_glossary'),
          component: GlossarySupport,
        },
        {
          id: supportInfoType(this).documentation.id,
          title: this.$t('support_docs'),
          component: DocsSupport,
        },
        {
          id: supportInfoType(this).video.id,
          title: this.$t('support_videos'),
          component: VideoSupport,
        },
      ],
      editModalOpened: false,
      deleteModalOpened: false,
      uploadingModalOpened: false,
      uploadData: { success: null, files: [] },
    }
  },
  computed: {
    resultsTableQueryParams() {
      return this.filter ? { search: this.filter } : {}
    },
    selection() {
      return Boolean(this.selectedItem)
    },
    /**
     * Follows src/assets/js/iris2/constants.js supportInfoType id's order
     */
    allSupportComponents() {
      return [
        ...this.supportDisplayComponents,
        {
          id: supportInfoType(this).news.id,
          title: this.$t('support_news'),
          component: NewsSupport,
        },
      ]
    },
    selectedItemDisplayComponent() {
      return this.allSupportComponents[this.selectedItem.type] || null
    },
    formProps() {
      return {
        initial: this.adminItem,
        isNewModel: false,
        url: this.saveUrl,
        method: 'put',
      }
    },
    saveUrl() {
      return supportEndpoint + this.adminItem.id + '/'
    },
    userHasAdminPermission() {
      return this.hasPermission(Permissions.SUPPORT.ADMIN)
    },
    ...mapGetters('groups', ['hasPermission']),
  },
  created() {
    this.formEventHandlers = {
      'form-saved': this.onFormSaved,
      'open-uploading-modal': this.onOpenUploadingModal,
      'upload-done': this.onUploadDone,
    }
  },
  methods: {
    getTabLinkClasses(tabIndex) {
      const tabClasses = 'rounded-0 text-uppercase text-center'
      return tabIndex === this.selectedTabIndex
        ? tabClasses
        : tabClasses + ' bg-white'
    },
    onSearchItemSelected(item) {
      this.resetFilter()
      this.selectItem(item)
    },
    resetFilter() {
      this.filter = ''
    },
    selectItem(item) {
      this.selectedItem = item
    },
    onUnselect() {
      this.selectedItem = null
    },
    onDeleteModel(item) {
      this.adminItem = item
      this.openDeleteModal()
    },
    onEditModel(item) {
      this.adminItem = item
      this.openEditModal()
    },
    async openEditModal() {
      this.editModalOpened = true
      await this.$nextTick()
      this.$refs.editModal.open()
    },
    async openDeleteModal() {
      this.deleteModalOpened = true
      await this.$nextTick()
      this.$refs.deleteModal.open()
    },
    async onOpenUploadingModal() {
      this.uploadingModalOpened = true
      await this.$nextTick()
      this.$refs.uploadingModal.open()
    },
    closeUploadingModal() {
      this.$refs.uploadingModal.close()
      this.uploadData = { success: null, files: [] }
      this.onFormSaved()
    },
    onUploadDone(data) {
      this.uploadData.files = data.files
      this.uploadData.success = data.success
    },
    closeModals(modal) {
      if (this.$refs.editModal) this.$refs.editModal.close()
      if (this.$refs.deleteModal) this.$refs.deleteModal.close()
      this.selectedItem = null
    },
    onEditModalOpen() {
      this.resetModalFormState()
    },
    onModalClosed() {},
    resetModalFormState() {
      this.modalFormRenderKey += 1
    },
    resetCreationFormState() {
      this.creationFormRenderKey += 1
    },
    onFormSaved(response, sentObj) {
      if (this.selectedItem) {
        const component = this.$refs.filterResultSupportComponent
          ? this.$refs.filterResultSupportComponent
          : this.$refs[`supportComponent_type_${this.adminItem.type}`][0]

        component.refresh()
      } else {
        this.resetCreationFormState()
        this.refreshAll()
      }
      this.closeModals('editModal')
    },
    refreshAll() {
      this.$refs.news.refresh()
      Object.entries(this.$refs)
        .filter(
          ([key, components]) =>
            key.includes('supportComponent_type_') && components.length
        )
        .forEach(([key, components]) => components[0].refresh())
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-modal /deep/ .sweet-modal {
  .sweet-content-content {
    text-align: left;
  }
  .save-btn-right {
    .footer-buttons {
      justify-content: flex-end;
    }
  }
}

.uploading-modal /deep/ .title {
  color: $primary;
  font-weight: bold;
  font-size: 1.5rem;
}
</style>
