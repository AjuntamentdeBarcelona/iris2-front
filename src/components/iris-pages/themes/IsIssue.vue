<template>
  <span 
    v-if="data.is_issue" 
    class="badge badge-danger">
    {{ $t('element_issue') }}
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
