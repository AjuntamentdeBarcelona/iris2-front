<template>
  <unauthorized-page v-if="!isAuthorized" />
  <div v-else>
    <authorization-error ref="authorizationError" />
    <base-report
      :form-component="formComponent"
      :table-component="tableComponent"
    />
  </div>
</template>

<script>
import BaseReport from '~/components/iris-pages/reports/BaseReport'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'
import AuthorizationError from '~/components/pages/authorization/AuthorizationError.vue'
import UnauthorizedPage from '~/components/pages/authorization/UnauthorizedPage.vue'

export default {
  name: 'BaseReportPage',
  components: {
    AuthorizationError,
    UnauthorizedPage,
    BaseReport,
  },
  mixins: [AuthorizationMixin],
  layout: 'backoffice',
  props: {
    formComponent: {
      type: Object,
      required: true,
    },
    tableComponent: {
      type: Object,
      default: () => undefined,
    },
  },
}
</script>
