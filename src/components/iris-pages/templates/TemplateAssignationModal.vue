<template>
  <sweet-modal
    ref="modal"
    :alt="$t('template_assign')"
    :aria-describedby="$t('template_assign')"
    :width="width"
    role="alertdialog"
    @close="onClosed"
  >
    <template-assignation
      v-if="opened && assign"
      :answer-type="answerType"
      :record-type="recordType"
      @ready="ready"
      @create-mode="setWide"
      @exit="close" />
    <template-edit 
      v-if="opened && item"
      :pk="editPk"
      @form-saved="ready"
    />
  </sweet-modal>
</template>

<script>
import TemplateAssignation from './TemplateAssignation.vue'
import TemplateEdit from './TemplateEdit.vue'
export default {
  name: 'TemplateAssignationModal',
  components: {
    TemplateAssignation,
    TemplateEdit,
  },
  data() {
    return {
      assign: false,
      opened: false,
      item: null,
      answerType: null,
      recordType: null,
      width: null,
    }
  },
  computed: {
    editPk() {
      if (this.item) {
        return [this.item.id]
      }
      return []
    },
  },
  methods: {
    open(recordType, answerType, item = null) {
      this.assign = item == null
      this.item = item
      this.opened = true
      this.recordType = recordType
      this.answerType = answerType
      this.setWide()
      this.$refs.modal.open()
    },
    onClosed() {
      this.opened = false
      this.recordType = null
      this.answerType = null
      this.item = null
      this.width = null
    },
    close() {
      this.$refs.modal.close()
      this.onClosed()
    },
    setWide() {
      this.width = '80%'
    },
    ready() {
      this.$emit('ready')
      this.close()
    },
  },
}
</script>
