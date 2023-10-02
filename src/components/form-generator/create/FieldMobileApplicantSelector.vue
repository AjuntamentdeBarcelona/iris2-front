<script>
import fieldApplicantSelector from '~/components/form-generator/create/fieldApplicantSelector.vue'
import MobileApplicantSearch from '~/components/iris-pages/create/MobileApplicantSearch.vue'

export default {
  name: 'FieldMobileApplicantSelector',
  extends: fieldApplicantSelector,
  computed: {
    applicantSearchComponent() {
      return MobileApplicantSearch
    },
  },
}
</script>

<style lang="scss">
.mobile-layout {
  .applicantSelector {
    .footer-buttons {
      position: static;
    }
  }
}
</style>
