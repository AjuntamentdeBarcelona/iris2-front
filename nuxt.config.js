import { getIrisConfig } from './iris.config'

const authMethod = process.env.AUTH_METHOD || 'oam'
const path = process.env.PUBLIC_PATH || '/_nuxt/'
const mainLang = process.env.MAIN_LANG || 'gl'

let config = getIrisConfig({
  authMethod,
  mainLang,
})

config.build = {
  ...config.build,
  publicPath: path,
}

if (process.env.BASE_ROUTE) {
  config.router.base = process.env.BASE_ROUTE
}

module.exports = config
