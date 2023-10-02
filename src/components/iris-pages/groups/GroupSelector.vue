<template>
  <span v-if="ready">
    <b-dropdown
      :text="text"
      :class="classes"
      right
      class="group-selector-list">
      <b-dropdown-item
        v-for="group in selectableGroups"
        :key="group.selectableGroups"
        :class="classes"
        @click="workAsGroup(group)">
        {{ group.description }}
      </b-dropdown-item>
    </b-dropdown>
  </span>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { compareFnByDescriptionAsc } from '~/assets/js/helpers'

/**
 * This component checks if the groups and auth has been loaded successfully.
 * In case of error it displays an error modal with options for retry the operation.
 */
export default {
  name: 'GroupSelector',
  props: {
    classes: {
      type: [Object, String],
      default: '',
      required: false,
    },
  },
  computed: {
    ...mapState('groups', {
      ready: state => state.ready,
      selected: state => state.selectedGroup,
      groups: state => state.groups,
    }),
    selectableGroups() {
      return this.groups
        .filter(group => group.id != this.selected.id)
        .sort(compareFnByDescriptionAsc)
    },
    isAnonymous() {
      return this.selected.description == 'AnonymousGroup'
    },
    text() {
      return this.isAnonymous ? this.$t('no_groups') : this.selected.description
    },
  },
  methods: {
    ...mapActions('groups', ['workAsGroup']),
  },
}
</script>

<style>
.group-selector-list .dropdown-menu {
  overflow-y: auto;
  max-height: 220px;
}
</style>
