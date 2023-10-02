<template>
  <div>
    <div class="alert alert-info">
      {{ $t('groups_tree_cannot_solve') }}
      <button
        v-if="!opened"
        class="btn btn-primary ml-auto"
        @click="go">
        {{ $t('groups_tree_change_proceed') }}
      </button>
    </div>
    <record-theme-change
      v-if="opened"
      :model="process"
      @theme-changed="refresh"
    />
  </div>
</template>

<script>
import RecordThemeChange from '~/components/iris-pages/records/RecordThemeChange.vue'
export default {
  name: 'RequireThemeChange',
  components: {
    RecordThemeChange,
  },
  props: {
    process: {
      type: Object,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      opened: false,
    }
  },
  methods: {
    refresh() {
      this.$emit('form-saved')
    },
    go() {
      this.opened = true
    },
  },
}
</script>
