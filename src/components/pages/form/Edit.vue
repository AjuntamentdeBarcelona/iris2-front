<template>
  <div
    :class="{ loading: loading }"
    class="row"
  >
    <slot name="beforeForm" />
    <div
      v-if="error"
      class="col-12">
      <http-error :error="error" />
    </div>
    <component
      v-if="!showLoading && !error"
      ref="form"
      :is="formComponent || dataFormComponent"
      :initial="formData"
      :method="method"
      :url="saveUrl"
      :definition="definition"
      :success-url="successUrl"
      :is-new-model="false"
      :title="pageTitle"
      :permission="editPermission"
      v-bind="formProps"
      class="col-12 module"
      @form-saved="successSignal"
    />
    <component
      v-if="showLoading && !error"
      ref="empty"
      :is="loadingComponent || dataFormComponent"
      :definition="loadingDefinition"
      :initial="{}"
      :method="method"
      :url="saveUrl"
      :is-new-model="false"
      :title="pageTitle"
      :show-loading="true"
      :permission="editPermission"
      class="col-12 module loading-form"
    />
    <slot
      :pkParams="pkParams"
      :saveUrl="saveUrl"
      :getUrl="getUrl"
      :model="model"
      :loading="showLoading"
      name="afterForm"
    />
  </div>
</template>

<script>
import detailMixin from '../detail/detailMixin.js'
import '~/assets/css/loading.scss'
import FormDefinition from '~/assets/js/forms/formDefinition.js'
import SchemaForm from '~/components/pages/form/schemaForm.vue'
import HttpError from '~/components/pages/HttpError.vue'

export default {
  name: 'FormEdit',
  layout: 'backoffice',
  components: {
    HttpError,
  },
  mixins: [detailMixin],
  props: {
    method: {
      type: String,
      default: 'patch',
    },
    formComponent: {
      type: [Object, String],
      default: () => '',
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    successUrl: {
      type: [String, undefined],
      required: false,
      default: undefined,
    },
    permission: {
      type: String,
      required: false,
      default: null,
    },
    emptyLoadingDef: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      definition: undefined,
      dataFormComponent: null,
      loadingDefinition: this.getLoadingDefinition(),
      model: {},
      formData: {},
    }
  },
  computed: {
    editPermission() {
      return this.permission
    },
    saveUrl() {
      return (this.url + this.getPkPath()).replace('//', '/')
    },
    pageTitle() {
      return this.title
    },
    loadingComponent() {
      if (this.emptyLoadingDef) {
        return SchemaForm
      }
      return this.formComponent
    },
  },
  beforeRouteLeave(to, from, next) {
    this.beforeExit(to, from, next)
  },
  watch: {
    pkParams() {
      this.loadInstance()
    },
  },
  methods: {
    getLoadingDefinition() {
      if (this.emptyLoadingDef) {
        return new FormDefinition({}, {})
      }
      return this.definition
    },
    beforeLoad(requestConfig) {
      this.formData = {}
    },
    afterLoad(instance) {
      this.setFormData()
    },
    setFormData() {
      this.formData = {
        ...this.model,
        ...this.getFormExtraParams(),
      }
    },
    getFormExtraParams() {
      return {}
    },
    beforeExit(to, from, next) {
      if (this.$refs.form) {
        this.$refs.form.beforeExit(to, from, next)
      } else {
        next()
      }
    },
    successSignal(params) {
      this.$emit('form-saved', params)
    },
  },
}
</script>
