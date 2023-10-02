<template>
  <div :id="schema.id"/>
</template>

<script>
import { abstractField } from 'vue-form-generator'

export default {
  name: 'FieldPortalTarget',
  extends: abstractField,
}
</script>
