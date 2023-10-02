<template>
  <div
    v-show="filterLabels.length"
    class="irisbox">
    <span class="tag--title">{{ $t('record_cards_selected_filters') }}</span>
    <span class="tag--action">
      <a
        href
        @click.prevent="clearFilters"
      >{{ $t('record_cards_clean_filters') }}</a>
    </span>
    <custom-vue-tag-selector
      :disabled="true"
      :value="filterLabels"
      @deleted="deletedFilter"
    />
  </div>
</template>

<script>
import CustomVueTagSelector from '~/components/CustomVueTagSelector'
import Feature from '~/assets/js/iris2/model/Feature.js'
import Ca from '~/lang/ca'

/**
 * Given models: values and the field's schemas, renders a list of labels: values that can be clicked for deletion
 */
export default {
  name: 'RecordCardSelectedFilters',
  components: {
    CustomVueTagSelector,
  },
  props: {
    appliedFilters: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filterLabels() {
      if (!this.appliedFilters) {
        return []
      }
      let labels = {}
      return this.appliedFilters
        .filter(value => value != undefined && value.fieldSchema != null)
        .map(value => {
          if (value.fieldSchema.model == 'attributes') {
            const label = value.displayValue
              .filter(attr => attr.value)
              .map(attr => {
                const label = Feature.labelForValue(attr.value, attr)
                return `${attr.description}: ${label}`
              })
              .join(' - ')
            // Attributes
            return label
              ? {
                  ...value,
                  displayValue: label,
                }
              : undefined
          }
          return value
        })
        .filter(item => item != undefined)
    },
  },
  methods: {
    deletedFilter(item) {
      this.$emit('deleted', item.fieldSchema)
    },
    clearFilters() {
      this.$emit('clear-filters')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/ajuntament/base.scss';

div .irisbox {
  min-height: unset;
}

.tag {
  &--title {
    text-transform: uppercase;
    font-weight: bold;
  }
  &--action {
    padding-left: 1.5em;
    text-decoration: underline;
    a {
      color: $gray-600;
    }
  }
}
</style>
