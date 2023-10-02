<template>

  <div>
    <div
      v-if="loading"
      class="irisbox"
    >
      <div class="loading-overlay">
        <div class="loader" />
      </div>
    </div>
    <template v-else>
      <template v-if="results.length">
        <div
          v-if="selected !== null"
          class="d-flex align-items-baseline justify-content-center"
        >
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
      </template>
      <template v-else>
        <div class="alert alert-info w-100">{{ $t('record_card_no_similar_record_cards') }}</div>
      </template>
    </template>
  </div>

</template>

<script>
import SimilarRecordsTable from '~/components/iris-pages/records/SimilarRecordsTable'

export default {
  components: {
    SimilarRecordsTable,
  },
  props: {
    extraComponentData: {
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
      return this.extraComponentData.results
    },
    loading() {
      return this.extraComponentData.hasOwnProperty('results') ? false : true
    },
  },
  methods: {
    onSelect(selection) {
      this.selected = selection
      this.$emit('component-event', { selection: this.selected.id })
    },
    unselect() {
      this.selected = null
      this.$emit('component-event', { selection: null })
    },
  },
}
</script>

<style lang="scss" scoped>
.irisbox {
  min-height: 210px;
  padding: 1.5em;
  margin: 0;
}
</style>
