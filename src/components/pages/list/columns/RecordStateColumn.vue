<template>
  <span
    :class="classBadge">
    {{ record_state.description }}
  </span>
</template>


<script>
export default {
  name: 'RecordStateColumn',
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
    record_state() {
      return _.get(this.data, this.column)
    },

    classBadge() {
      return [
        'badge',
        this.record_state.acronym
          ? `badge-${this.acronymUnderScored(this.record_state.acronym)}`
          : '',
      ]
    },
  },
  methods: {
    acronymUnderScored(acronym) {
      if (acronym) {
        const acronymUnderscored = acronym.replace(' ', '-')
        return acronymUnderscored.toLowerCase()
      }
    },
  },
}
</script>
