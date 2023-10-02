<template>
  <span>
    <span v-if="!loading && model">{{ model }}</span>
    <span v-else-if="model === null">-</span>
    <span v-else>({{ $t('loading') }})</span>
  </span>
</template>

<script>
import { modelFromId } from '~/assets/js/helpers'

export default {
  props: {
    modelId: {
      type: Number,
      required: true,
    },
    modelAttribute: {
      type: String,
      default: undefined,
    },
    storeModule: {
      type: String,
      required: true,
    },
    storeAttribute: {
      type: String,
      required: true,
    },
    storeAction: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      models: [],
      model: undefined,
    }
  },
  mounted() {
    this.loadModels().then(() => {
      this.setModels()
      this.findModel()
      this.loading = false
    })
  },
  methods: {
    loadModels() {
      return this.$store.dispatch(`${this.storeModule}/${this.storeAction}`)
    },
    setModels() {
      this.models = this.$store.state[this.storeModule][this.storeAttribute]
    },
    findModel() {
      if (this.modelId !== null) {
        this.model = modelFromId(this.modelId, this.models, this.modelAttribute)
      } else {
        this.model = this.modelId
      }
    },
  },
}
</script>
