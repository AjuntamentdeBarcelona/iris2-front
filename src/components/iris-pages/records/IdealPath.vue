<template>
  <ul>
    <li 
      v-for="step in path" 
      :key="step.transition"
      :class="{active: step.active, ready: step.ready}">
      {{ $t(step.title) }}
    </li>
  </ul>
</template>

<script>
/**
 * Renders the given IdealPath, that is, the actions and state transitions needed for
 * solving the request reprensented by the RecordCard and its process.
 */
export default {
  name: 'IdealPath',
  props: {
    path: {
      type: Array,
      required: true,
    },
    currentStep: {
      type: String,
      required: true,
    },
  },
}
</script>
