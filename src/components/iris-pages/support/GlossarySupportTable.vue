<script>
import Table from '~/components/pages/list/table'
import { equalCharacters } from '~/assets/js/helpers'
import { supportEndpoint } from '~/assets/js/iris2/constants'
import { debounce } from 'lodash'

export default {
  name: 'GlossarySupportTable',
  extends: Table,
  props: {
    url: {
      type: String,
      default: supportEndpoint,
    },
    queryParams: {
      type: Object,
      required: true,
    },
    listResultType: {
      type: String,
      default: 'list_result_type.term',
    },
    adminFeatures: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      allResultsCharacter: this.$t('all'),
      columns: [
        'title',
        'description',
        ...(this.adminFeatures ? ['external-actions'] : []),
      ],
      options: {
        headings: {
          title: this.$t('support_glossary_term'),
          description: this.$t('support_glossary_definition'),
          ...(this.adminFeatures
            ? { 'external-actions': this.$t('actions') }
            : {}),
        },
        sortable: ['title', 'description'],
      },
    }
  },
  watch: {
    queryParams(value, oldVal) {
      this.debouncedRefresh()
    },
  },
  created() {
    this.debouncedRefresh = debounce(this.refresh, 250)
  },
}
</script>
