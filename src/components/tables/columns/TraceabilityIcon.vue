<template>
  <span class="icon-layer">
    <font-awesome-layers class="fa-2x">
      <font-awesome-icon :icon="['far', 'circle']"/>
      <font-awesome-icon-composer
        :icons="icons"
        layers-class=""
      />
    </font-awesome-layers>
  </span>
</template>

<script>
import {
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome'
import FontAwesomeIconComposer from '~/components/tables/FontAwesomeIconComposer'

export default {
  components: {
    FontAwesomeLayers,
    FontAwesomeLayersText,
    FontAwesomeIconComposer,
  },
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
  computed: {
    icons() {
      return this.data.icons
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/ajuntament/base.scss';

.icon-layer {
  display: inline-block;
  background-color: #fff;
  svg {
    color: $gray-800;
  }
  & > .fa-layers {
    display: flex;
  }
}
</style>
