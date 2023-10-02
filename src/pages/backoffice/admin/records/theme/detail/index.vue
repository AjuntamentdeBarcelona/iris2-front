<template>
  <div>
    <!-- Table -->
    <select-table>
      <template
        slot="before-table"
        slot-scope="{ selected }"
      >
        <filtered-list
          ref="filteredList"
          :filter-form-definition="filterFormDefinition"
          :list-component="elementDetailTable"
          :list-props="listProps"
          :list-event-handlers="{'delete-request': onDeleteRequest}"
          title="detail_details"
        >
          <template
            slot="titleButtons"
          >
            <div
              class="mb-1"
            >
              <!-- Add button -->
              <nuxt-link
                :to="localePath(getAddUrl())"
                class="btn btn-outline-secondary"
              >
                <font-awesome-icon icon="plus"/>
                {{ $t('add') }}
              </nuxt-link>
              <!-- Activation button -->
              <b-button
                :disabled="!selected.length"
                @click="onActivationRequest(selected)"
              >
                <font-awesome-icon icon="clock"/>
                {{ `${$t('detail_activate')} (${selected.length})` }}
              </b-button>
            </div>
          </template>

          <template
            slot="beforeActions"
            slot-scope="slotProps"
          >
            <!-- Clone button -->
            <b-button
              :title="$t('detail_copy_detail')"
              variant="outline-secondary"
              @click="onCopyRequest(slotProps.row)"
            >
              <font-awesome-icon icon="clone"/>
            </b-button>
          </template>
        </filtered-list>
      </template>
    </select-table>

    <!-- Modal -->
    <modal-form
      ref="modalForm"
      v-bind="modalFormProps"
      @form-saved="onModalFormSaved"
      @modal-closed="onModalClosed"
    />
  </div>
</template>

<script>
import AdminMixin from '~/pages/backoffice/admin/AdminMixin'
import SelectTable from '~/components/pages/list/SelectTable'
import FilteredList from '~/components/pages/list/FilteredList'
import ElementDetailTable from '~/components/iris-pages/themes/ElementDetailTable'
import ModalForm from '~/components/forms/modals/ModalForm'
import DetailDeleteForm from '~/components/iris-pages/themes/DetailDeleteForm'
import DetailCloneForm from '~/components/iris-pages/themes/DetailCloneForm'
import DetailBulkActivateForm from '~/components/iris-pages/themes/DetailBulkActivateForm'
import FormDefinition from '~/assets/js/forms/formDefinition'
import { validators } from 'vue-form-generator'

const getDateFieldSchema = vm => ({
  type: 'pikaday',
  format: 'DD/MM/YYYY',
  placeholder: vm.$t('select_a_date'),
  pikadayOptions: {
    format: 'DD/MM/YYYY',
  },
  styleClasses: 'col-lg-3',
  validator: validators.date,
})

const filterFormDefinition = vm =>
  new FormDefinition(
    {
      search: {
        type: 'input',
        inputType: 'text',
        min: 1,
        maxlength: 20,
        label: vm.$t('filter_title'),
        placeholder: vm.$t('search'),
        validator: validators.string,
        styleClasses: 'col-lg-4',
      },
      active: {
        type: 'select',
        values: [
          { id: true, name: vm.$t('yes') },
          { id: false, name: vm.$t('no') },
        ],
        selectOptions: {
          noneSelectedText: '-',
        },
        label: vm.$t('detail_active_detail'),
        styleClasses: 'col-lg-2',
      },
      activation_date_ini: {
        ...getDateFieldSchema(vm),
        label: vm.$t('detail_activation_from'),
      },
      activation_date_end: {
        ...getDateFieldSchema(vm),
        label: vm.$t('detail_activation_to'),
      },
    },
    {
      groups: [
        {
          fields: [
            'search',
            'active',
            'activation_date_ini',
            'activation_date_end',
          ],
        },
      ],
    }
  )

export default {
  name: 'DetailTable',
  components: {
    SelectTable,
    FilteredList,
    ModalForm,
  },
  mixins: [AdminMixin],
  props: {
    queryParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      detail: null,
      details: [],
      mode: '',
      addUrl: {
        name: 'backoffice-admin-records-theme-detail-add',
      },
    }
  },
  computed: {
    listProps() {
      return {
        disableAdd: true,
        queryParams: { ...this.queryParams, ...{ id: undefined } },
        orderUrl: '/api/theme/details',
      }
    },
    modalFormProps() {
      return this.modalFormModes[this.mode]
    },
    modalFormModes() {
      return {
        delete: {
          'form-component': DetailDeleteForm,
          'form-props': { 'delete-id': this.detailId },
          'modal-text-content': `${this.$t('detail_delete_detail')}: <b>${
            this.detailDescription
          }</b>`,
        },
        clone: {
          'form-component': DetailCloneForm,
          'form-props': this.detail
            ? {
                url: `/api/theme/details/${this.detailId}/copy/`,
                initial: {
                  element_id: this.detail.element,
                  area_id: this.detail.element.area,
                  description_ca: this.detail.description_ca,
                  description_es: this.detail.description_es,
                  description_en: this.detail.description_en,
                },
              }
            : {},
          'modal-text-content': `${this.$t('detail_copy_detail')}: <b>${
            this.detailDescription
          }</b>`,
        },
        activate: {
          'form-component': DetailBulkActivateForm,
          'form-props': {
            details: this.details,
          },
          'modal-text-content': this.$t('detail_bulk_activation_title'),
        },
      }
    },
    detailId() {
      return this.detail && !Array.isArray(this.detail) ? this.detail.id : null
    },
    detailDescription() {
      return this.detail ? this.detail.description : null
    },
  },
  created() {
    this.elementDetailTable = ElementDetailTable
    this.filterFormDefinition = filterFormDefinition
  },
  methods: {
    onDeleteRequest(detail) {
      this.detail = detail
      this.mode = 'delete'
      this.openModal()
    },
    onCopyRequest(detail) {
      this.detail = detail
      this.mode = 'clone'
      this.openModal()
    },
    onActivationRequest(details) {
      this.details = details
      this.mode = 'activate'
      this.openModal()
    },
    onModalFormSaved() {
      this.refreshTable()
      this.closeModal()
    },
    onModalClosed() {
      this.detail = null
      this.details = []
      this.mode = ''
    },
    openModal() {
      this.$refs.modalForm.open()
    },
    closeModal() {
      this.$refs.modalForm.close()
    },
    refreshTable() {
      this.$refs.filteredList.refreshList()
    },
    getAddUrl() {
      return Object.assign({}, this.addUrl, {
        query: this.queryParams,
      })
    },
  },
}
</script>
