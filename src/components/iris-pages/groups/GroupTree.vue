<template>
  <li
    v-if="!isEmpty"
    :class="{'list-group-item--parent':hasChildren}"
    class="list-group-item"
  >
    <div class="d-flex align-items-center justify-content-between">
      <a
        :class="{'link--parent':hasChildren}"
        class="link"
        @click="toggleShow"
      >
        ({{ group.id }}) {{ group.name }}
        <font-awesome-icon
          v-if="hasChildren"
          icon="caret-down"
          class="ml-1"
        />
      </a>

      <span
        v-if="detailUrl"
        class="buttons"
      >
        <nuxt-link
          :to="localePath(getDetailUrl(group.id))"
          class="btn btn-outline-secondary white-bg"
        >
          <font-awesome-icon icon="edit" />
        </nuxt-link>

        <span
          v-b-popover.hover="hasChildren ? disabledDeleteMessage : ''"
          variant="outline-success"
        >
          <b-button
            :disabled="hasChildren"
            class="white-bg"
            variant="outline-danger"
            @click="onDelete(group, hasChildren)"
          >
            <font-awesome-icon icon="trash" />
          </b-button>
        </span>
      </span>
    </div>

    <b-collapse
      :id="collapseCode"
      v-model="visible"
      tag="ul"
      class="list-group list-group--child"
    >
      <group-tree
        v-for="group in children"
        :key="group.id"
        :group="group"
        :detail-url="detailUrl"
        :level="level + 1"
        :show-children="showChildren"
        class="list-group-item--child"
        @on-delete="onDelete"
      />
    </b-collapse>
  </li>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'GroupTree',
  props: {
    group: {
      type: Object,
      required: true,
    },
    showChildren: {
      type: Boolean,
      default: false,
      required: false,
    },
    level: {
      type: Number,
      default: 0,
      required: false,
    },
    detailUrl: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      delete_id: null,
      disabledDeleteMessage: this.$t('delete_related_message'),
      children: [],
    }
  },
  computed: {
    uniqueRef() {
      return this.group.id + 'children'
    },
    hasChildren() {
      if (this.isEmpty) {
        return false
      }
      return this.group.childrens && this.group.childrens.length > 0
    },
    collapseCode() {
      return this.group.id + 'collapse'
    },
    isEmpty() {
      return _.isEmpty(this.group)
    },
  },
  watch: {
    group() {
      if (this.visible) {
        this.children = this.group ? this.group.childrens : []
      }
    },
    showChildren: {
      handler() {
        this.visible = this.showChildren || this.level == 0
        if (this.visible) {
          this.children = this.group ? this.group.childrens : []
        }
      },
      immediate: true,
    },
  },
  methods: {
    toggleShow() {
      this.visible = !this.visible
      if (this.visible && this.group.childrens != this.children) {
        this.children = this.group ? this.group.childrens : []
      }
    },
    getDetailUrl(groupId) {
      return Object.assign({}, this.detailUrl, {
        params: { id: groupId },
      })
    },
    onDelete(group_id, hasChildren) {
      this.$emit('on-delete', group_id, hasChildren)
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .list-group--child {
  padding-left: 1.5em;

  .list-group-item {
    font-size: 0.95em;
    background: rgba($gray-600, 0.05);
    padding: 0.75rem 0;
    border: none;
    .link {
      position: relative;
      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        content: '';
        width: 0.8rem;
        margin-left: -1rem;
        height: 2px;
        background-color: $gray-600;
      }
    }
  }
}

.white-bg:not(:active):not(:visited):not(:hover):not(:focus):not(:focus-within) {
  background-color: $white;
}

.link--parent {
  cursor: pointer !important;
}

.buttons {
  padding-right: 0.5rem;
}
.list-group-item--parent > div > .buttons {
  padding-bottom: 0.5rem;
}

.list-group-item.list-group-item--child {
  position: relative;
  &:before {
    content: '';
    height: 100%;
    position: absolute;
    left: 1rem;
    top: 0;
    margin-left: -2rem;
    width: 2px;
    background-color: $gray-600;
  }
  &:last-child:before {
    height: 50%;
  }
  &.list-group-item--parent:last-child:before {
    height: calc(0.7rem + 1.8em);
  }
}
</style>
