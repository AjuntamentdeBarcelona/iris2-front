<template>
  <div class="template-config w-100">
    <b-tabs content-class="mt-3 irisbox">
      <b-tab
        :title="$t('config_admin_templates')"
        active>
        <template-table />
      </b-tab>
      <b-tab :title="$t('config_admin_templates_vars')">
        <configuration
          :category="configType"
          :show-nav="false"
          :success-url-route="$route" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import AnswerTypeList from '~/components/iris-pages/templates/AnswerTypeList.vue'
import RecordTypeList from '~/components/iris-pages/templates/RecordTypeList.vue'
import TemplateTable from '~/components/iris-pages/templates/TemplateTable.vue'
import Configuration from '~/pages/backoffice/admin/configuration.vue'
import Parameters from '~/assets/js/iris2/model/Parameters.js'

export default {
  name: 'TemplateConfig',
  layout: 'backoffice',
  components: { AnswerTypeList, RecordTypeList, TemplateTable, Configuration },
  computed: {
    configType() {
      return Parameters.CATEGORY_TEMPLATES.id
    },
  },
}
</script>
