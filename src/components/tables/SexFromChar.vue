<template>
  <span>{{ sex }}</span>
</template>

<script>
export default {
  props: {
    sexChar: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Maps back's src/record_cards/models.py Citizen SEXES
       */
      sexList: { m: this.$t('male'), f: this.$t('female') },
    }
  },
  computed: {
    sex() {
      return this.sexList[this.sexChar]
    },
  },
}
</script>
