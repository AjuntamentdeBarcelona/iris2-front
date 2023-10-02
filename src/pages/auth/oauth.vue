<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        IRIS
      </h1>
      <h2 class="subtitle">
        {{ $t('auth_oauth_get_access_token') }}
      </h2>
      <loader />
      <span
        v-if="error"
        v-html="error" />
    </div>
  </section>
</template>

<script>
import Logo from '~/components/layout/Logo.vue'

/***
 * @todo review if it's necessary
 */
export default {
  auth: false,
  components: {
    Logo,
  },
  data() {
    return {
      username: '',
      password: '',
    }
  },

  mounted() {
    this.getAccessToken()
  },

  methods: {
    async getAccessToken() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            ...this.$route.query,
            provider: 'oauth-code',
          },
        })
        this.$router.push('/backoffice/dashboard')
      } catch (e) {
        this.$router.push(this.localePath({ name: 'login' }))
        this.$notify({
          group: 'iris',
          title: this.$t('auth_oauth_error_title'),
          type: 'error',
          text: `${this.$t('auth_oauth_error_description')} ${this.error}`,
        })
      }
    },
  },
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
