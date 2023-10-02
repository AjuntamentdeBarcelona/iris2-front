<template>
  <span 
    v-if="data.is_query" 
    class="badge badge-success">
    {{ $t('element_query') }}
  </span>
  <span v-else/>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
  },
}
</script>
