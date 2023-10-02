<template>
  <sweet-modal
    ref="tree"
    :title="$t('create_theme_tree')"
    :enable-mobile-fullscreen="true"
    class="modal-fixed-scroll theme-tree"
    aria-describedby="modalDescription"
    role="alertdialog"
    @close="$emit('close')"
  >
    <component
      :is="treeComponent"
      :application="application"
      :exclude-record-type-id="excludeRecordTypeId"
      @select-detail="$emit('select-detail', $event)"
    />
  </sweet-modal>
</template>

<script>
import ThemeTreeSelector from './ThemeTreeSelector'

export default {
  components: {
    ThemeTreeSelector,
  },
  props: {
    treeComponent: {
      type: Object,
      default() {
        return ThemeTreeSelector
      },
    },
    status: {
      type: Boolean,
      required: true,
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
  watch: {
    status() {
      if (this.status) {
        this.showModal()
      } else {
        this.closeModal()
      }
    },
  },
  methods: {
    showModal() {
      this.$refs.tree.open()
    },
    closeModal() {
      this.$refs.tree.close()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .sweet-modal {
  height: 100%;
  .sweet-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sweet-content {
    align-items: flex-start;
  }
  .sweet-modal {
    .sweet-content-content {
      text-align: left;
    }
  }
}

.modal-fixed-scroll.theme-tree {
  /deep/ .sweet-modal {
    overflow-y: auto !important;
  }
}
</style>
