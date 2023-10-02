<template>
  <div class="record-theme">
    <h4
      v-if="showLabel"
      class="text-dark">{{ label }} ({{ element }} >> {{ area }})</h4>
    <dynamic-tag-modal
      v-if="canPerform && showButton"
      ref="$button"
      :show-scroll="true"
      reset-on-close
      width="90%"
      class="btn btn-primary float-right">
      <font-awesome-icon icon="random"/>
      {{ $t('record_card_theme_change_button') }}
      <template slot="modal">
        <record-theme-change @theme-changed="themeChanged" />
      </template>
    </dynamic-tag-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal.vue'
import RecordThemeChange from '~/components/iris-pages/records/RecordThemeChange.vue'
/**
 * Component that displays the current detail for the record.
 * If the user can perform the action, a button offering the theme change will appear,
 * presenting the user a modal with the theme change flow.
 */
export default {
  name: 'RecordThemeLabel',
  components: {
    DynamicTagModal,
    RecordThemeChange,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    /**
     * If true, the button to change theme will be shown
     */
    showButton: {
      type: Boolean,
      default: false,
      required: false,
    },
    /**
     * If true, the button to change theme will be shown
     */
    showLabel: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  computed: {
    canPerform() {
      return _.get(this.model, 'actions.theme-change.can_perform', false)
    },
    label() {
      return _.get(this.model, 'element_detail_id.description')
    },
    element() {
      return _.get(this.model, 'element_detail_id.element.description')
    },
    area() {
      return _.get(this.model, 'element_detail_id.element.area.description')
    },
  },
  methods: {
    themeChanged() {
      this.$emit('theme-changed')
    },
  },
}
</script>
