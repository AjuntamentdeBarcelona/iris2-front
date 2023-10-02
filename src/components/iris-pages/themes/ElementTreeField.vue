<template>
  <div class="element-tree-selector">
    <span
      v-if="value"
      class="title">
      {{ value.area.description }} / {{ value.description }}
    </span>
    <span
      v-else
      class="title">
      {{ $t('tree_select') }}
    </span>
    <MountingPortal
      mount-to="body"
      append
    >
      <theme-tree-modal
        :status="status"
        :tree-component="component"
        @select-detail="selectFromTree"
        @close="closeTreeModal"
      />
    </MountingPortal>
    <b-button
      class="flex-shrink-0"
      @click.prevent.stop="openTreeModal">
      <slot>
        <font-awesome-icon
          :icon="['fas', 'sitemap']"/>
        {{ $t('create_open_tree') }}
      </slot>
    </b-button>
  </div>
</template>


<script>
import ElementTreeSelector from '~/components/iris-pages/themes/ElementTreeSelector.vue'
import ThemeTreeModal from '~/components/iris-pages/themes/ThemeTreeModal.vue'
import { abstractField } from 'vue-form-generator'

export default {
  name: 'ElementTreeField',
  components: {
    ElementTreeSelector,
    ThemeTreeModal,
  },
  extends: abstractField,
  data() {
    return {
      status: false,
    }
  },
  computed: {
    component() {
      return ElementTreeSelector
    },
  },
  methods: {
    selectFromTree(element) {
      this.value = {
        ...element,
        area: {
          ...element.area,
          elements: undefined,
        },
        details: undefined,
      }
      this.status = false
    },
    openTreeModal() {
      this.status = true
    },
    closeTreeModal() {
      this.status = false
    },
  },
}
</script>

<style lang="scss" scoped>
.element-tree-selector {
  width: 100%;
  .title {
    font-weight: bolder;
    font-size: 1.3em;
  }
  button {
    float: right;
  }
}
</style>
