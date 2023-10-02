<template>
  <section class="container">
    <div>
      <logo />
      
      <h1 class="title">
        IRIS
      </h1>
      <h2 class="subtitle">
        {{ $t('auth_welcome') }}
      </h2>

      <span
        v-if="error"
        v-html="error" />

      <div 
        v-for="method in methods" 
        :key="method.codename">
        <b-button 
          v-if="method.url" 
          :href="method.url">
          {{ method.label }}
        </b-button>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/layout/Logo.vue'

export default {
  components: {
    Logo,
  },

  data() {
    return {
      methods: [],
      error: null,
    }
  },
  mounted() {
    this.loadMethods()
  },
  methods: {
    async loadMethods() {
      console.log(this.$auth.loggedIn)
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
      })
      try {
        // @todo new endpoint
        const resp = await this.$axios.get('api/auth/methods/')
        this.methods = resp.data
      } catch (e) {
        this.error = e.response.data.non_field_errors[0]
      }
      this.$nuxt.$loading.finish()
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
