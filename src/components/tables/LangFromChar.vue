<template>
  <span>{{ lang }}</span>
</template>

<script>
export default {
  props: {
    langChar: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Maps back's src/main/utils.py
       */
      langList: {
        es: this.$t('spanish'),
        en: this.$t('english'),
        ca: this.$t('catalan'),
        gl: this.$t('galician'),
      },
    }
  },
  computed: {
    lang() {
      return this.langList[this.langChar]
    },
  },
}
</script>
