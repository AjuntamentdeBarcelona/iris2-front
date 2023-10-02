<template>
  <ApplicantSelector
    ref="selector"
    :schema="{}"
    :model="{}"
    :is-page-component="true"
    class="irisbox"
  />
</template>

<script>
import ApplicantSelector from '~/components/form-generator/create/fieldApplicantSelector'
export default {
  components: {
    ApplicantSelector,
  },
  layout: 'backoffice',
}
</script>
