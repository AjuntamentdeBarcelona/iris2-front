<template>
  <span v-if="ready">
    <b-dropdown
      :text="text"
      right
      class="group-selector-list">
      <b-dropdown-item
        v-for="lang in langs"
        :key="lang"
        @click="select(lang)">
        {{ lang }}
      </b-dropdown-item>
    </b-dropdown>
  </span>
</template>

<script>
export default {
  name: 'LanguageSelector',
  computed: {
    langs() {
      return this.$i18n.locales.map(locale => locale.code)
    },
    ready() {
      return true
    },
    text() {
      return this.$i18n.locale.toUpperCase()
    },
  },
  methods: {
    select(lang) {
      this.$router.push(this.switchLocalePath(lang))
    },
  },
}
</script>
