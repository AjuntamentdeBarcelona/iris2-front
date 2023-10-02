<template>
  <select-table>
    <template
      slot="before-table"
      slot-scope="{ selected }"
    >
      <record-card-search-list
        ref="table"
        :url="url"
        :show-user-plate="true"
      >
        <template slot="extra-buttons">
          <!-- Reassign -->
          <selected-actions
            slot="extra-buttons"
            :selected="selected"
            :get-url="getReassignUrl"
            :form-component="reassignFormComponent"
            confirm-title-key="record_card_reassign_bulk_confirm_title"
            confirm-text-key="record_card_reassign_bulk_confirm_text"
            success-message-key="record_card_reassign_bulk_success"
            error-title="record_card_reassign_error"
            error-message-key="record_card_reassign_bulk_error"
            class="ml-auto my-2"
            @action-done="actionCompleted"
          />
          <!-- Validate -->
          <selected-actions
            slot="extra-buttons"
            :selected="selected"
            :get-url="getValidateUrl"
            confirm-title-key="record_card_validate_bulk"
            confirm-text-key="record_card_validate_bulk_confirm_text"
            success-message-key="record_card_validated_bulk"
            error-title="record_card_validate_error"
            error-message-key="record_card_validate_error_bulk"
            class="ml-2 my-2"
            @action-done="actionCompleted"
          />
        </template>
      </record-card-search-list>
    </template>
  </select-table>
</template>

<script>
import RecordCardSearchList from '~/components/iris-pages/records/RecordCardSearchList.vue'
import SelectTable from '~/components/pages/list/SelectTable.vue'
import SelectedActions from '~/components/pages/actions/SelectedActions.vue'
import RecordCardReassignmentBulk from '~/components/iris-pages/records/RecordCardReassignmentBulk'

export default {
  name: 'PendingRecordCardList',
  components: {
    SelectTable,
    RecordCardSearchList,
    SelectedActions,
  },
  layout: 'Tasks',
  props: {
    url: {
      type: String,
      default: '/api/record_cards/record_cards/pending-validation/',
    },
  },
  created() {
    this.reassignFormComponent = RecordCardReassignmentBulk
  },
  methods: {
    getValidateUrl(row) {
      if (row.similar_process) {
        return null
      }
      if (row.actions.validate && row.actions.validate.action_url) {
        return row.actions.validate.action_url
      }
      return row.actions.validate
    },
    getReassignUrl(row) {
      if (row.actions.reasign && row.actions.reasign.can_perform) {
        return {
          url: row.actions.reasign.action_url,
          data: { record_card: row.id },
        }
      }
      return null
    },
    actionCompleted() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .sweet-modal {
  overflow: initial;
  .sweet-content-content .vue-form-generator {
    text-align: left;
  }
}
</style>
