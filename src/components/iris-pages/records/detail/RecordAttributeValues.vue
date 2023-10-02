<template>
  <!-- Special features -->
  <div
    v-show="features.length > 0"
    class="row my-2">

    <button
      v-b-toggle.atributs
      class="col-12 cardi__main-title">
      <h4>{{ $t('record_card_attributes') }}</h4>

      <div class="ml-auto cardi__show-more">
        <small>
          {{ $t('show_more_content') }}
        </small>
        <i class="fas fa-caret-right card-toggle ml-1" />
      </div>
    </button>

    <b-collapse
      id="atributs"
      class="w-100 pt-1"
      visible
    >
      <div class="row no-gutters">
        <div
          v-for="detail_feature in features"
          v-show="detail_feature.is_theme_feature"
          :key="detail_feature.feature.pk"
          class="col-12 col-lg-4 cardi__card"
        >
          <div class="cardi__title">
            {{ detail_feature.feature.description }}
          </div>
          <div class="cardi__description">
            {{ detail_feature.display_value|def }}
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>


<script>
export default {
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  computed: {
    features() {
      if (this.record) {
        let features = this.record.special_features.concat(this.record.features)
        return _.sortBy(features, 'order').map(feature => {
          return {
            ...feature,
            display_value: this.valueForFeature(feature),
          }
        })
      }
      return []
    },
  },
  methods: {
    valueForFeature(recordFeature) {
      if (_.get(recordFeature, 'feature.values_type.values', null) != null) {
        const option = recordFeature.feature.values_type.values
          .filter(value => recordFeature.value == value.id)
          .map(value => value.description)
        if (option.length) {
          return option[0]
        }
      } else {
        return recordFeature.value
      }
    },
  },
}
</script>
