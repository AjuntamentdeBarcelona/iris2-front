<template>
  <div>
    <component
      :is="formComponent"
      :enable-visualization="Boolean(tableComponent)"
      @visualize-data="onVisualizeData"
      @reset="reset"
    />

    <div
      v-if="tableComponent"
      class="irisbox"
    >
      <div class="row">
        <div class="col-12">
          <component
            v-if="requestData && requestData.length"
            :is="tableComponent"
            :data="requestData"
            :params="requestObj.data"
          />

          <span
            v-else
            v-text="requestData ? $t('reports_access_no_data') : $t('reports_access_select_filters')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseReport',
  props: {
    formComponent: {
      type: Object,
      required: true,
    },
    tableComponent: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      requestObj: null,
      requestData: null,
    }
  },
  methods: {
    async onVisualizeData(requestObj) {
      this.requestObj = requestObj
      this.$nuxt.$loading.start()
      try {
        const response = await this.$axios(requestObj)
        this.requestData = response.data
      } catch (e) {
      } finally {
        this.$nuxt.$loading.finish()
      }
    },
    reset() {
      this.requestData = null
    },
  },
}
</script>
