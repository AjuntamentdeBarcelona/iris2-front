<template>
  <div>
    <slot name="beforeModules" />
    <form-edit
      ref="form"
      :url="url"
      :permission="permission"
      :method="method"
      :pk="pk"
      :title="title"
      :related-filter-attr-name="relatedFilterAttrName"
      :list-filters="listFilters"
      :form-component="formComponent"
      :success-url="successUrl"
    >
      <div
        v-if="isAuthorized"
        slot="afterForm"
        slot-scope="{ pkParams, loading, model }"
        class="modules col-12"
      >
        <div
          v-for="listComp in listComponents"
          :key="listComp.name"
          class="module"
        >
          <component
            :is="listComp"
            :disable-add="loading"
            :query-params="listQueryFilters(pkParams, model)"
          />
        </div>
      </div>
    </form-edit>
    <slot name="afterModules" />
  </div>
</template>

<script>
import Edit from './Edit.vue'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'

export default {
  layout: 'backoffice',
  components: {
    'form-edit': Edit,
  },
  mixins: [AuthorizationMixin],
  props: {
    url: {
      type: String,
      default: null,
      required: true,
    },
    method: {
      type: String,
      default: 'patch',
    },
    pk: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    relatedFilterAttrName: {
      type: String,
      default: '',
    },
    listFilters: {
      type: Object,
      default: () => {},
    },
    formComponent: {
      type: [Object, String],
      default: () => '',
      required: true,
    },
    listComponents: {
      type: Array,
      default: () => [],
    },
    successUrl: {
      type: [String, undefined],
      required: false,
      default: undefined,
    },
  },
  beforeRouteLeave(to, from, next) {
    this.beforeExit(to, from, next)
  },
  methods: {
    listQueryFilters(pkParams, model) {
      let params = {}
      if (this.relatedFilterAttrName) {
        params[this.relatedFilterAttrName] = pkParams[0]
      }
      return Object.assign(params, this.listFilters)
    },
    beforeExit(to, from, next) {
      if (this.$refs.form) {
        this.$refs.form.beforeExit(to, from, next)
      } else {
        next()
      }
    },
  },
}
</script>
