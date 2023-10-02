
<template>
  <add-survey-card ref="form" />
</template>

<script>
import AddSurveyCard from '~/components/iris-pages/create/AddSurveyCard.vue'

export default {
  name: 'AddSurveyCardPage',
  layout: 'backoffice',
  components: {
    AddSurveyCard,
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs.form) {
      this.$refs.form.beforeExit(to, from, next)
    } else {
      next()
    }
  },
}
</script>
