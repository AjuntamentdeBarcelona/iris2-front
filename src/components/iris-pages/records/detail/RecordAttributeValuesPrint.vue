<template>
  <!-- Special features -->
  <div
    v-show="features.length > 0">
    <div class="printrecord__main-title">
      <h3>{{ $t('record_card_attributes') }}</h3>
    </div>
    <hr>
    <div
      v-for="detail_feature in features"
      v-show="detail_feature.is_theme_feature"
      :key="detail_feature.feature.pk"
      class="printrecord__card"
    >
      <div class="printrecord__title">
        {{ detail_feature.feature.description }}
      </div>
      <div class="printrecord__description">
        {{ detail_feature.display_value|def }}
      </div>
    </div>
    
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
