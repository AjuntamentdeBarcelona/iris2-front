<template>
  <span
    v-if="data.ans_limit_date"
    :class="{'ansLimitDate--expired' : isExpired(data.ans_limit_date)}"
    class="ansLimitDate">
    {{ expirationDate(data.ans_limit_date) }}
  </span>
  <span
    v-else
    class="ansLimitDate">
    -
  </span>
</template>

<script>
import moment from 'moment'
export default {
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

  methods: {
    expirationDate(date) {
      return moment().to(moment(date))
    },
    isExpired(date) {
      const today = moment()
      return moment(date).isBefore(today)
    },
  },
}
</script>

<style lang="scss">
.ansLimitDate {
  font-weight: bolder;
  &--expired {
    color: $danger;
  }
}
</style>
