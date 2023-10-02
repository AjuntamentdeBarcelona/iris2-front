<template>
  <nuxt-link
    v-if="record"
    :to="multirecordAddUrl"
    class="btn btn-outline-secondary d-flex">
    <div class="multifiles-icon">
      <font-awesome-icon
        v-for="index in 3"
        :key="index"
        :icon="['fas', 'file']"/>
    </div>
    {{ $t('multirecord_new') }}
  </nuxt-link>
</template>

<script>
export default {
  name: 'MultiRecordButton',
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  computed: {
    multirecordAddUrl() {
      if (!this.record) {
        return {}
      }
      return this.localePath({
        name: 'backoffice-create',
        query: {
          multirecordFrom:
            this.record.multirecord_from || this.record.normalized_record_id,
          backTo: this.$route.path,
        },
      })
    },
  },
}
</script>
