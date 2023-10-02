<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        IRIS
      </h1>
      <h2 class="subtitle">
        Identificat per començar a fer feina
      </h2>

      <span
        v-if="error"
        v-html="error" />

      <form
        method="post"
        @submit.prevent="login">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
        >
        <input
          v-model="password"
          type="password"
          required
        >
        <button type="submit">Identificació</button>
      </form>

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
      username: '',
      password: '',
      error: null,
    }
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password,
          },
        })

        this.$router.push('/backoffice/dashboard')
      } catch (e) {
        console.log(e)
        this.error = e.response.data.non_field_errors[0]
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
