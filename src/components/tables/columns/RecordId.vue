<template>
  <nuxt-link
    v-b-popover.hover.right="description"
    :to="detailUrl"
  >
    {{ recordId }}
  </nuxt-link>
</template>

<script>
import { truncate } from '~/assets/js/helpers'
import _ from 'lodash'

export default {
  name: 'RecordId',
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
  },
  computed: {
    detailUrl() {
      return this.localePath(this.getDetailUrl())
    },
    description() {
      return this.dataSource.description
        ? this.truncate(this.dataSource.description, 500)
        : null
    },
    dataSource() {
      if (
        this.data.description &&
        this.data.normalized_record_id &&
        this.data.id
      ) {
        return this.data
      } else {
        return this.data[this.column]
      }
    },
    recordId() {
      if (_.isObject(this.dataSource)) {
        return this.dataSource.normalized_record_id
      } else {
        return this.dataSource
      }
    },
  },
  methods: {
    truncate(text, length) {
      return truncate(text, length, true)
    },
    getDetailUrl() {
      return {
        name: 'backoffice-records-id',
        params: { id: this.recordId },
        query: { fromList: this.$route.path },
      }
    },
  },
}
</script>
