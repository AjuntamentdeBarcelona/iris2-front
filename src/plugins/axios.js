import axios from 'axios'

export default async function({ $axios, base }, inject) {
  const configUrl = `${base}config.json`
  const configPromise = fetch(configUrl, {
    credentials: 'same-origin',
  })
  const config_app = await (await configPromise).json()
  inject('irisConfig', config_app)

  // 409 Action
  $axios.interceptors.response.use(
    function(response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    function(error) {
      // 409 errors need a notification explaining other has made a change before
      if (!axios.isCancel(error) && error.response.status == 409) {
        $nuxt.$notify({
          group: 'iris',
          title: $nuxt.$t('error_409_title'),
          type: 'error',
          text: $nuxt.$t('error_409_description'),
          duration: 1000000000,
        })
      }
      if (error.response.status == 401) {
        $nuxt.$auth.logout(null)
        $nuxt.$router.push({ name: 'login' })
      }
      return Promise.reject(error)
    }
  )

  const BASE_PATH = config_app.API_BASE_URL.replace(/^(?:\/\/|[^\/]+)*/, '')
  const DOMAIN = /^(?:\/\/|[^\/]+)*/.exec(config_app.API_BASE_URL)[0]
  $axios.onRequest(config => {
    if (config.url === '/session/info') {
      config.baseURL = ''
    } else if (config.url.startsWith(BASE_PATH)) {
      config.baseURL = DOMAIN
    } else {
      config.baseURL = config_app.API_BASE_URL
    }
  })
}
