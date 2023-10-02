<template>
  <a
    :href="detailUrl"
    @click.prevent="open">
    <slot>{{ recordId }}</slot>
    <MountingPortal
      mount-to="body"
      append
    >
      <sweet-modal
        ref="modal"
        :blocking="true"
        width="90%"
      >
        <record-card
          v-if="hasBeenOpened"
          :id="recordId"
          :manage-version="false" />

        <b-button
          variant="outline-dark"
          @click="close"
        >{{ $t('cancel') }}</b-button>
      </sweet-modal>
    </MountingPortal>
  </a>
</template>

<script>
import RecordCard from '~/pages/backoffice/records/_id.vue'

export default {
  name: 'RecordCardModal',
  components: {
    RecordCard,
  },
  props: {
    recordId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasBeenOpened: false, // Only load on first time the modal is opened
    }
  },
  computed: {
    detailUrl() {
      return this.localePath(this.getDetailUrl())
    },
  },
  methods: {
    open() {
      this.hasBeenOpened = true
      this.$refs.modal.open()
    },
    close() {
      this.$refs.modal.close()
    },
    getDetailUrl() {
      return {
        name: 'backoffice-records-id',
        params: { id: this.recordId },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .sweet-modal {
  min-height: 300px;
}
</style>
