<template>
  <div class="detail file-detail">
    <slot
      v-if="error"
      :model="model"
      name="error"
    >
      <http-error :error="error" />
    </slot>
    <slot
      v-if="loading"
      name="loading"
    >
      <div class="loading-overlay">
        <div class="loader" />
      </div>
    </slot>
    <slot
      v-if="!loading && !notFound && isAuthorized"
      name="title"
    >
      <h1 v-if="title">{{ title }}</h1>
    </slot>
    <slot
      v-if="!loading && !notFound && isAuthorized"
      :model="model"
      name="object"
    />
  </div>
</template>

<script>
import detailMixin from './detailMixin.js'
import AuthorizationMixin from '~/components/pages/authorization/AuthorizationMixin.js'
import UnauthorizedPage from '~/components/pages/authorization/UnauthorizedPage.vue'
import HttpError from '~/components/pages/HttpError.vue'
import '~/assets/css/loading.scss'

export default {
  name: 'Detail',
  layout: 'backoffice',
  components: {
    UnauthorizedPage,
    HttpError,
  },
  mixins: [detailMixin, AuthorizationMixin],
}
</script>
