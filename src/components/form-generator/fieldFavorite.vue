<template>
  <span>
    <p-check
      :id="schema.id"
      :checked="value"
      class="p-icon p-smooth p-plain"
      color="warning-o"
      toggle
      @change="modelUpdated"
    >
      <font-awesome-icon
        slot="off-extra"
        :icon="['far', 'star']"/>
      <font-awesome-icon
        slot="extra"
        :icon="['fas', 'star']"/>
    </p-check>
  </span>
</template>


<script>
import irisField from './irisField.js'
import { abstractField } from 'vue-form-generator'
import PrettyCheck from 'pretty-checkbox-vue/check'

export default {
  name: 'FieldFavorite',
  components: {
    'p-check': PrettyCheck,
  },
  mixins: [irisField, abstractField],
  methods: {
    modelUpdated(value) {
      this.value = value
    },
  },
}
</script>

<style lang="scss" scoped>
.p-plain {
  padding-top: 0.6em;
  padding-bottom: 0.6em;
}
</style>
<style lang="scss">
@import 'pretty-checkbox/src/pretty-checkbox.scss';
.pretty.p-icon .state .icon {
  position: relative;
}
.state.p-warning-o {
  width: 1.2em;
}
.state.p-warning-o label {
  height: 1rem;
}
.pretty .state label:after,
.pretty .state label:before {
  top: initial;
  bottom: 0;
}
</style>
