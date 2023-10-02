<template>
  <div class="protocol-detail">
    <detail
      v-if="pk"
      ref="detail"
      :pk="pkParams"
      :url="url"
    >
      <template 
        slot="object" 
        slot-scope="{ model }">
        <h5>#{{ model.protocol_id }}</h5>
        <p 
          class="content" 
          v-html="model.description"/>
      </template>
      <div 
        slot="error" 
        class="alert alert-danger">
        {{ $t('protocol_error') }}
      </div>
    </detail>
  </div>
</template>


<script>
import Detail from '~/components/pages/detail/Detail.vue'

export default {
  name: 'Protocol',
  components: {
    Detail,
  },
  props: {
    pk: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
      default: '/api/protocols/',
    },
  },
  computed: {
    pkParams() {
      return this.pk ? [this.pk] : []
    },
  },
}
</script>

<style>
.protocol-detail {
  position: relative;
  min-height: 250px;
}

.protocol-detail p.content {
  max-height: 400px;
  overflow-y: auto;
  padding: 2px;
}
</style>
