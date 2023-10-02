<template>
  <span
    :style="styleObject"
    class="unread-badge"
  >{{ unread }}</span>
</template>

<script>
export default {
  name: 'UnreadBadge',
  props: {
    unread: {
      type: Number,
      required: true,
    },
  },
  computed: {
    styleObject() {
      return {
        'background-color': this.unread ? 'red' : '#1c7778',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $white;
  font-weight: 700;
  border-radius: 1em;
  line-height: 1;
  min-width: 1.6em;
  height: 1.6em;
  padding: 0.3em;
}
</style>
