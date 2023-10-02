
<!-- fieldAwesome.vue -->
<template>
  <div class="detail-selector d-flex">
    <group-select
      v-model="selectValue"
      :disabled="isDisabled || schema.readonly"
      :label="schema.optionLabelAttribute"
      :placeholder="schema.placeholder"
      :filterable="!selectOnSearch"
      :options="groupedOptions"
      :loading="loading"
      :reset-on-options-change="schema.resetOnOptionsChange || false"
      :get-option-label="schema.getOptionLabel || undefined"
      class="mr-2"
      transition="autocomplete"
      type="text"
      @search="selectOnSearch"
    >
      <template slot="no-options">{{ $t('autocomplete_no_options') }}</template>
    </group-select>
    <b-button
      v-if="tree && !schema.readonly"
      class="flex-shrink-0"
      @click.prevent.stop="openTreeModal">
      <slot>
        <font-awesome-icon
          :icon="['fas', 'sitemap']"/>
        {{ $t('create_open_tree') }}
      </slot>
    </b-button>
    <template v-if="tree && !schema.readonly">
      <!-- Tree -->
      <theme-tree-modal
        v-if="!portalModal"
        :status="modalVisibility"
        :application="application"
        :exclude-record-type-id="recordTypeId"
        @select-detail="selectFromTree"
        @close="closeTreeModal"
      />
      <!-- Portaled tree -->
      <MountingPortal
        v-else
        mount-to="body"
        append
      >
        <div class="detail-selector d-flex">
          <theme-tree-modal
            :status="modalVisibility"
            :application="application"
            :exclude-record-type-id="recordTypeId"
            @select-detail="selectFromTree"
            @close="closeTreeModal"
          />
        </div>
      </MountingPortal>
    </template>
  </div>
</template>

<script>
import fieldAutocomplete from './fieldAutocomplete.vue'
import GroupSelect from '~/components/forms/GroupSelect.vue'
import trimAccents from '~/assets/js/utils/string/trimAccents.js'
import ThemeTreeModal from '~/components/iris-pages/themes/ThemeTreeModal'

/**
 * Extra schema options:
 * - portalModal: Wraps the tree modal on a portal, useful when the field is on a modal already
 */
export default {
  components: {
    GroupSelect,
    ThemeTreeModal,
  },
  extends: fieldAutocomplete,
  data() {
    return {
      detailUrl: '/api/theme/details/',
      modalVisibility: false,
    }
  },
  computed: {
    application() {
      return parseInt(this.schema.application)
    },
    recordTypeId() {
      return parseInt(this.schema.exclude_record_type_id)
    },
    tree() {
      return this.schema.tree != undefined ? this.schema.tree : true
    },
    autoOpen() {
      return this.schema.autoOpen
    },
    groupedOptions() {
      var elements = {}
      this.options
        .filter(detail => detail.element != null && detail.element.area != null)
        .forEach(detail => {
          if (!elements[detail.element.id]) {
            elements[detail.element.id] = {
              title: `${detail.element.area.description} / ${
                detail.element.description
              }`,
              options: [],
            }
          }
          elements[detail.element.id].options.push(detail)
        })
      return Object.values(elements).sort((a, b) =>
        a.title.localeCompare(b.title)
      )
    },
    portalModal() {
      return this.schema.portalModal
    },
  },
  mounted() {
    if (this.autoOpen) {
      this.modalVisibility = true
    }
  },
  methods: {
    /**
     * Override for implementing the keyword param transformation
     */
    getQueryParams(search) {
      var params = {
        application: this.application || undefined,
      }
      if (isNaN(parseInt(search))) {
        params.keywords = search
          .split(' ')
          .map(value => trimAccents(value).toUpperCase())
          .filter(value => value)
          .join(',')
      }
      return Object.assign({}, this.forwardParams, params)
    },

    /**
     * If the user introduces an integer number must look for the instance itself.
     */
    getRequestUrl(params, search) {
      if (params.id && this.schema.isRestful) {
        return this.getRestfulUrl(
          _.isObject(params.id) ? { id: params.id.id } : params,
          search
        )
      }
      if (!isNaN(parseInt(search))) {
        return this.schema.url + '?id=' + search
      }
      if (this.schema.getUrlForSearch) {
        return this.schema.getUrlForSearch(this, params, search)
      }
      return this.schema.url
    },
    /**
     * @param {*} params
     * @param {*} search
     * @returns The final url for making the get of the initial value on restful resources
     */
    getRestfulUrl(params, search) {
      return this.detailUrl + params.id + '/'
    },
    selectFromTree(detail) {
      this.value = detail
      this.options = [detail]
      this.closeTreeModal()
    },
    openTreeModal() {
      this.modalVisibility = true
    },
    closeTreeModal() {
      this.modalVisibility = false
    },
  },
}
</script>

<style lang="scss">
.detail-selector {
  > div.dropdown {
    width: 100%;
    padding: 0;
  }
}
.dropdown-menu .active {
  background-color: rgba($primary, 0.75);
}
// .dropdown.v-select.v-select-grouped pr-2 open single searchable
.vue-form-generator .form-group.error.field-detail-selector .field-wrap input {
  border-color: transparent;
}
.vue-form-generator
  .form-group.error.field-detail-selector
  .field-wrap
  .v-select
  .dropdown-toggle {
  border-color: $danger;
}
.vue-form-generator
  .form-group.error.field-detail-selector
  .field-wrap
  .v-select
  .dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba($gray-900, 0.11);
}
.vue-form-generator .form-group.field-detail-selector .dropdown-toggle::after {
  content: none;
}
.vue-form-generator
  .form-group.error.field-detail-selector
  .open-indicator::before {
  border-color: $danger;
}

.vue-form-generator
  .form-group.field-detail-selector
  .autocomplete-enter-active,
.autocomplete-leave-active {
  transition: opacity 0.1s cubic-bezier(0.1, 0.1, 0.1, 0.1);
}
.vue-form-generator .form-group.field-detail-selector .autocomplete-enter,
.autocomplete-leave-to {
  opacity: 0;
}

// STYLES v-select group them TODO: Damià A. Pont
.v-select .dropdown-menu {
  overflow-y: auto;
  li:active,
  li.active {
    a {
      background: $primary;
      color: $white;
    }
  }

  li:hover,
  li:focus,
  li.highlight {
    a {
      background: rgba($primary, 0.5);
    }
    &.active {
      a {
        background: rgba($primary, 0.7);
      }
    }
  }
}
</style>
