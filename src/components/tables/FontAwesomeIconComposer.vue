<template>
  <font-awesome-layers
    :class="layersClass"
    :title="icons[0].title"
    class="fa-composer"
  >
    <font-awesome-icon
      v-for="(icon, index) in icons"
      :key="index"
      :icon="[style(icon.icon), faIcon(icon.icon)]"
      :transform="icon.transform || (index === 0 ? 'shrink-8' : 'shrink-12')"
      :class="icon.class"
    />
  </font-awesome-layers>
</template>

<script>
import {
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome'

/**
 * Takes:
 * -An array of objects made of the following keys:
 *    -icon: A string with a FontAwesome style and icon, for example: 'fas fa-frog'
 *    -transform: By default 'shrink-8' for the first icon, 'shrink-12' for the rest
 *    -style: An optional class to further style that icon. Useful to generate a negative shape on solid icons
 *    -title: An string to display on hover. Must be attached to the first icon
 *
 * Renders either:
 * -The corresponding FontAwesome icon
 * -Both of them layered, first one to the background, second one to the front, smaller
 */
export default {
  components: {
    FontAwesomeLayers,
    FontAwesomeLayersText,
  },
  props: {
    icons: {
      type: Array,
      required: true,
    },
    layersClass: {
      type: String,
      default: 'fa-3x',
    },
  },
  methods: {
    style(icon) {
      return icon.split(' ')[0]
    },
    faIcon(icon) {
      return icon.split(' ')[1].slice(3)
    },
    class(icon) {
      return icon.split(' ')[2]
    },
  },
}
</script>

<style lang="scss" scoped>
.fa-composer {
  display: inline-block;
  pointer-events: initial;
  color: $gray-800;
}
</style>
