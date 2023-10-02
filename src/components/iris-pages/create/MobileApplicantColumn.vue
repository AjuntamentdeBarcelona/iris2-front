<template>
  <span class="applicant-column">
    <strong>{{ display }}</strong>
    <p>{{ document }}</p>
  </span>
</template>

<script>
import _ from 'lodash'

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
  computed: {
    display() {
      if (this.data.citizen) {
        const cit = this.data.citizen
        return `${cit.name} ${cit.first_surname} ${cit.second_surname}`
      } else if (this.data.social_entity) {
        return this.data.social_entity.social_reason
      } else {
        return ''
      }
    },
    document() {
      if (this.data.citizen) {
        return this.data.citizen.dni
      } else if (this.data.social_entity) {
        return this.data.social_entity.cif
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss">
span.applicant-column {
  white-space: pre;
  strong {
    width: 100%;
  }
  p {
    padding: 5px 0px;
    margin: 0px;
  }
}
</style>
