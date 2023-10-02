<template>
  <div
    v-if="!loading"
    class="template-assignation">
    <h4>{{ title }}</h4>
    <div
      v-show="!createActive"
      class="template-select table-templates">
      <strong>{{ $t('template_assign') }}</strong>
      <p>{{ $t('template_select_explanation') }}</p>
      <div class="row justify-content-md-center">
        <template-item
          v-for="template in templates"
          :key="template.id"
          :item="template"
          class="col-3 btn btn-outline-secondary"
          @selected="assign(template)" />
      </div>
      <button 
        v-show="!createActive" 
        class="btn btn-outline-danger"
        @click="exit">
        {{ $t('template_assigning_cancel') }}
      </button>
      <button 
        v-show="!createActive" 
        class="btn btn-outline-secondary"
        @click="createNew">
        {{ $t('templates_add_explanation') }}
      </button>
    </div>
    <div
      v-show="createActive"
      class="template-add row">
      <template-form
        :title="$t('templates_add')"
        :record-type="recordType"
        :answer-type="answerType"
        :record-type-editable="false"
        class="col-12"
        @form-saved="ready" 
        @exit="exit" />
    </div>
  </div>
  <div 
    v-else 
    class="loading">
    {{ loadingMessage }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TemplateItem from './TemplateItem.vue'
import TemplateForm from './TemplateForm.vue'

export default {
  name: 'TemplateAssignation',
  components: {
    TemplateItem,
    TemplateForm,
  },
  props: {
    answerType: {
      type: Object,
      required: true,
    },
    recordType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      manualCreate: false,
      loadingMessage: '',
    }
  },
  computed: {
    templates() {
      return this.getTemplates(this.answerType.id)
    },
    title() {
      return this.$t('template_assign_for')
        .replace('{record}', this.recordType.description)
        .replace('{answer}', this.answerType.description)
    },
    createActive() {
      return this.templates.length == 0 || this.manualCreate
    },
    ...mapGetters('templates', { getTemplates: 'getAnswerTypeTemplates' }),
  },
  methods: {
    assign(template) {
      this.setLoading(true, this.$t('template_assigning'))
      this.$axios
        .patch('api/templates/templates/' + template.id + '/', {
          response_type_id: this.answerType.id,
          record_types: [
            ...template.record_types,
            {
              record_type: this.recordType.id,
            },
          ],
        })
        .then(resp => {
          this.$emit('ready')
        })
        .catch(error => {
          this.$emit('error', error)
          this.$notify({
            group: 'iris',
            title: this.$t('template_assigning_error'),
            type: 'error',
            text: '',
          })
        })
        .then(() => {
          this.setLoading(false)
        })
    },
    createNew() {
      this.manualCreate = true
      this.$emit('create-mode')
    },
    ready() {
      this.$emit('ready')
    },
    exit() {
      this.$emit('exit')
    },
    setLoading(loading, message = '') {
      this.loading = loading
      this.loadingMessage = message
    },
  },
}
</script>

<style>
.template-assignation .table-templates .template {
  margin: 3px;
  border: 1px solid;
  margin-bottom: 10px;
}
</style>
