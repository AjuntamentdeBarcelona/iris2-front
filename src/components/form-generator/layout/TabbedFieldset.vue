<template lang="pug">
div(:class="group.class", class="tabbed-fieldset")
  div.col-12(v-if='group.legend')
    legend(v-if='group.legend') {{ group.legend }}
  b-tabs(v-model="activeIndex", ref="tabs", @input="onTabChanged", :vertical="vertical")
    b-tab(v-for='group in groups', :title="group.legend || group.title" :key="group.title", :disabled="group.disabled || false"
          :title-link-class="getTabClass(group)" :id="getTabId(group)")
      keep-alive
        component(:ref="group.title", :is="group.component || 'form-fieldset'", :group="group", :vfg="vfg" :errors="errors",
                  :model="internalModel", :options="options", :active="activeGroups[group.title]",
                  @validated="onGroupFieldValidated(group, arguments)", @model-updated="onModelUpdated")
</template>

<script>
import FormFieldset from './FormFieldset.vue'
import _ from 'lodash'

/**
 * FormFieldset which subgroups are rendered inside a Tab from boostrap tabs.
 *
 * This fieldset does not accept fields, only groups.
 * Group may include a tabId and/or tabClass
 */
export default {
  name: 'TabbedFieldset',
  components: {
    'form-fieldset': FormFieldset,
  },
  extends: FormFieldset,
  props: {
    group: {
      type: Object,
      required: true,
      validator(value) {
        if (value.fields != null) {
          console.error(
            'TabbedFieldset component does not accept fields, only groups.'
          )
        }
        if (value.groups == null) {
          console.error('TabbedFieldset component requires groups.')
          return false
        }
        const titles = value.groups.map(group => group.title)
        if (_.uniq(titles).length !== titles.length) {
          console.error(
            'TabbedFieldset does not allow duplicate titles in groups.',
            _.uniq(titles),
            titles
          )
          return false
        }
        return value.fields == null && Array.isArray(value.groups)
      },
    },
  },
  data() {
    return {
      groupErrors: {},
      activeIndex: 0,
    }
  },
  computed: {
    vertical() {
      return _.get(this.group, 'vertical', false)
    },
    groups() {
      return this.group.groups
    },
    activeGroups() {
      const activeG = {}
      for (let group of this.groups) {
        activeG[group.title] = this.isActive(group)
      }
      return activeG
    },
  },
  methods: {
    /**
     * Wrapper function for onFieldValidated method. It tracks which groups have errors.
     * @param {Object} group
     * @param {Array} eventArguments Array with three components: isValid, errors and field.
     */
    onGroupFieldValidated(group, eventArguments) {
      this.onFieldValidated.apply(this, eventArguments)
      this.groupErrors[group.title] = !eventArguments[0]
    },
    /**
     * @param {Object} group
     * @returns CSS class for the given group according to its state
     */
    getTabClass(group) {
      const tabClasses = group.tabClass ? `${group.tabClass} ` : ''
      return this.hasError(group) ? `${tabClasses}error` : tabClasses
    },
    getTabId(group) {
      return group.tabId
    },
    /**
     * @param {Object} group
     * @returns True if the given group has errors
     */
    hasError(group) {
      if (
        this.$refs[group.title] &&
        this.$refs[group.title][0].errorFields &&
        this.$refs[group.title][0].errorFields.length > 0
      ) {
        return true
      }
      return this.groupErrors[group.title] != null
        ? this.groupErrors[group.title]
        : false
    },
    /**
     * @param {Object} group
     * @return True if the given group is active (its tab is selected)
     */
    isActive(group) {
      if (this.activeIndex == null || this.activeIndex < 0) {
        return false
      }
      return this.groups[this.activeIndex].title == group.title && this.active
    },
    /**
     * When a valid tab is selected, the hook method must be called.
     */
    onTabChanged() {
      if (this.activeIndex >= 0) {
        this.tabChanged()
      }
    },
    /**
     * Hook method for tab changes
     */
    tabChanged() {},
  },
}
</script>
