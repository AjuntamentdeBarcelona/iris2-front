const pkg = require('./package')
const _ = require('lodash')

const OAM = 'oam'
const DEFAULT = ''
const OAUTH = 'oauth'

const AUTH_METHODS = {
  [DEFAULT]: {},
  [OAM]: {
    redirect: {
      login: '/',
      logout: '/',
      callback: '/backoffice/dashboard',
      home: '/backoffice/dashboard',
    },
    strategies: {
      local: {
        endpoints: {
          user: {
            url: '/session/info',
            method: 'get',
            propertyName: 'user',
          },
          logout: false,
        },
        tokenRequired: false,
      },
    },
  },
  [OAUTH]: {
    strategies: {
      local: {
        scheme: 'local',
        endpoints: {
          login: {
            url: '/api/oauth/login/iris-oidc/',
            method: 'post',
            propertyName: 'token',
          },
          user: {
            url: '/api/me/',
            method: 'get',
            propertyName: 'user_id',
          },
          logout: false,
        },
        tokenType: 'Token',
        tokenName: 'Authorization',
      },
    },
  },
}

export function getAuth(authMethod = DEFAULT) {
  const BASE_SETTINGS = {
    redirect: {
      login: '/login',
      home: '/backoffice/dashboard',
    },
  }
  return _.merge(BASE_SETTINGS, AUTH_METHODS[authMethod])
}

export function getIrisConfig({ authMethod, mainLang }) {
  const auth = getAuth(authMethod)
  return {
    mode: 'spa',
    srcDir: 'src/',
    /*
    ** Headers of the page
    */
    head: {
      title: 'IRIS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: pkg.description },
      ],
      script: [
        {
          src:
            'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.4/polyfill.min.js',
        },
        {
          src: 'https://polyfill.io/v3/polyfill.min.js?features=fetch',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      ],
      bodyAttrs: {
        class: 'bg-light with-sidebar gaudi-body',
      },
    },
    /*
    ** Customize the progress-bar color
    */
    loading: '~/components/loading.vue',
    /*
    ** Global CSS
    */
    css: [
      '@/assets/css/ajuntament/base.scss',
      '@fortawesome/fontawesome-svg-core/styles.css',
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
      '~/plugins/fontawesome.js',
      '~/plugins/axios',
      '~/plugins/portals',
      '~/plugins/formGenerator.js',
      '~/plugins/awesomeNotifications.js',
      '~/plugins/toggleButton.js',
      '~/plugins/filters.js',
      '~/plugins/i18n.js',
      ...(authMethod == 'oam' ? ['~/plugins/oam.js'] : []),
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
      // Doc: https://github.com/nuxt-community/axios-module#usage
      '@nuxtjs/axios',
      // Doc: https://auth.nuxtjs.org/
      '@nuxtjs/auth',
      // Doc: https://bootstrap-vue.js.org/docs/
      ['bootstrap-vue/nuxt', { css: false }],
      // Doc: https://github.com/potato4d/nuxt-client-init-module
      'nuxt-client-init-module',
      // Doc: https://github.com/nuxt-community/moment-module
      [
        '@nuxtjs/moment',
        { locales: [mainLang, 'es'], defaultLocale: mainLang },
      ],
      // https://nuxt-community.github.io/nuxt-i18n/options-reference.html
      [
        'nuxt-i18n',
        {
          locales: [
            { code: mainLang, file: mainLang + '.js' },
            { code: 'es', file: 'es.js' },
          ],
          lazy: true,
          langDir: 'lang/',
          defaultLocale: mainLang,
          seo: false,
          detectBrowserLanguage: false,
          vueI18n: {
            fallbackLocale: 'es',
          },
        },
      ],
      // https://github.com/WilliamDASILVA/nuxt-trailingslash-module
      'nuxt-trailingslash-module',
      '@nuxtjs/style-resources',
    ],
    styleResources: {
      scss: [
        '@/assets/css/ajuntament/_variablesglobal.scss',
        // './assets/vars/*.scss',
        // './assets/abstracts/_mixins.scss' // use underscore "_" & also file extension ".scss"
      ],
    },
    /*
    ** Axios module configuration
    */
    axios: {
      // See https://github.com/nuxt-community/axios-module#options
    },
    /*
    ** Auth module configuration
    */
    auth,
    /*
    ** Build configuration
    */
    build: {
      // presets: ['@nuxt/babel-preset-app', 'es2015-ie'],
      // transpile: ['sweet-modal', 'vue-pikaday-directive'],
      /*
      ** You can extend webpack config here
      */
      extend(config, ctx) {
        // Run ESLint on save
        if (ctx.isDev && ctx.isClient) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/,
          })
        }
      },
    },
    /*
    ** Router configuration
    */
    router: {
      middleware: ['auth'],
    },
  }
}
