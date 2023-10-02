<template>

  <div v-if="results.length">
    <div
      v-if="selected !== null"
      class="d-flex align-items-baseline justify-content-center"
    >
      <!-- Add element detail decription to the title -->
      <h1
        :title="selected.description"
        class="title-line">{{ $t("record_card_selected_record_card") }}: {{ selected.normalized_record_id }}
      </h1>

      <button
        class="btn btn-primary ml-2 py-1 px-2 rounded-0"
        @click.prevent="unselect"
      >{{ $t('unselect') }}
      </button>
    </div>
    <template v-else>
      <div class="alert alert-warning w-100">{{ $t('record_card_similar_record_cards') }}</div>
      <similar-records-table
        :prop-data="results"
        :is-selectable="true"
        @select="onSelect"
      />
    </template>
  </div>
  <div
    v-else
    class="alert alert-info w-100"
  >{{ $t('record_card_no_similar_record_cards') }}</div>

</template>

<script>
import SimilarRecordsTable from '~/components/iris-pages/records/SimilarRecordsTable'
import _ from 'lodash'

export default {
  name: 'SimilarRecordCardsChecker',
  components: {
    SimilarRecordsTable,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    checkResponse: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selected: null,
    }
  },
  computed: {
    results() {
      return _.get(this, 'checkResponse.possible_similar', [])
    },
  },
  methods: {
    onSelect(selection) {
      this.selected = selection
      this.$emit('check-action', { similar: this.selected.id })
    },
    unselect() {
      this.selected = null
      this.$emit('check-action', { similar: null })
    },
  },
}
</script>
