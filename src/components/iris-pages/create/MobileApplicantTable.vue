<script>
import ApplicantTable from '~/components/iris-pages/create/ApplicantTable.vue'
import MobileApplicantColumn from '~/components/iris-pages/create/MobileApplicantColumn.vue'

export default {
  name: 'MobileApplicantTable',
  extends: ApplicantTable,
  methods: {
    setColumns() {
      const columnName = this.applicantType ? 'cif' : 'dni'
      this.headings = {
        [columnName]: this.$t('id_card'),
        actions: this.$t('actions'),
      }
      this.columns = [columnName, 'actions']
      this.options = {
        ...this.options,
        templates: {
          [columnName]: MobileApplicantColumn,
        },
      }
    },
  },
}
</script>
