<template>
  <dynamic-tag-modal
    ref="masterModal"
    :show-scroll="true"
    :component-props="{variant:'outline-secondary'}"
  >
    <font-awesome-icon icon="list"/>
    {{ $t('templates_select') }}
    <template slot="modal">
      <answer-master
        :record="record"
        @selected-template-text="selectedText" />
    </template>
  </dynamic-tag-modal>

</template>


<script>
import AnswerMaster from '~/components/iris-pages/templates/AnswerMaster.vue'
import DynamicTagModal from '~/components/pages/actions/DynamicTagModal'
import { mapActions } from 'vuex'

export default {
  name: 'ComsMasterTemplate',
  components: {
    AnswerMaster,
    DynamicTagModal,
  },
  props: {
    model: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    recordCard: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    record() {
      return this.model.record ? this.model.record : this.recordCard
    },
  },
  methods: {
    ...mapActions('communication', ['wrapTemplate']),
    async selectedText(text, template) {
      this.model.text = await this.wrapTemplate(text.text)
      this.$emit('model-updated')
      this.$emit('new-text', this.model.text)
      this.$refs.masterModal.close()
    },
  },
}
</script>
