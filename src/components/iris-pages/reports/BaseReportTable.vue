<template>
  <div>
    <div>
      <h1>{{ $t('reports_audit') }}</h1>
      <h4
        v-if="title"
        v-html="title"
      />
    </div>
    <b-table
      :fields="fields"
      :items="adaptedData"
      striped
      hover
      bordered
      small
      responsive
    />
    <span>{{ $t('reports_generic_source') }}</span>
  </div>
</template>

<script>
export default {
  name: 'BaseReportTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      excludedFields: [],
      fieldRenames: {},
    }
  },
  computed: {
    fields() {
      return this.excludedFields.length || Object.keys(this.fieldRenames).length
        ? this.getAdaptedFields()
        : []
    },
    adaptedData() {
      return this.data
    },
    title() {
      return ''
    },
  },
  methods: {
    reduceFields(accumulator, currentValue) {
      if (!this.excludedFields.includes(currentValue)) {
        accumulator.push({
          key: currentValue,
          ...(this.fieldRenames[currentValue]
            ? { label: this.fieldRenames[currentValue] }
            : {}),
        })
      }
      return accumulator
    },
    getAdaptedFields() {
      return this.data.length
        ? Object.keys(this.data[0]).reduce(this.reduceFields, [])
        : []
    },
  },
}
</script>
