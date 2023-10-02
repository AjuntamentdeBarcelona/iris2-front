<template functional>
  <!-- Modal -->
  <sweet-modal
    v-if="!props.portal"
    :ref="data.ref"
    :class="[data.class, data.staticClass]"
    :style="[data.style, data.staticStyle]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <template slot="box-action">
      <slot name="box-action"/>
    </template>
    <template slot="title">
      <slot name="title"/>
    </template>
    <slot/>
    <template slot="button">
      <slot name="button"/>
    </template>
  </sweet-modal>
  <!-- Portal modal -->
  <MountingPortal
    v-else
    mount-to="body"
    append
  >
    <sweet-modal
      :ref="data.ref"
      :class="[data.class, data.staticClass]"
      :style="[data.style, data.staticStyle]"
      v-bind="data.attrs"
      v-on="listeners"
    >
      <template slot="box-action">
        <slot name="box-action"/>
      </template>
      <template slot="title">
        <slot name="title"/>
      </template>
      <slot/>
      <template slot="button">
        <slot name="button"/>
      </template>
    </sweet-modal>
  </MountingPortal>
</template>

<script>
/**
 * Fully transparent wrapper that renders a sweet modal with or without portal
 * Default allows for a direct replacement of any existant sweet modal
 */
export default {
  name: 'PortalModal',
  inheritAttrs: false,
  props: {
    portal: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
