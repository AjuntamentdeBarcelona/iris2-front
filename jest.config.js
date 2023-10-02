const { Nuxt } = require('nuxt')

const config = require('./nuxt.config.js')
const nuxt = new Nuxt(config)
const rootDir = nuxt.options.rootDir

module.exports = {
  testURL: 'http://localhost',
  // Nuxtjs
  moduleNameMapper: {
    '^@/(.*)$': rootDir + '/src/$1',
    '^~/(.*)$': rootDir + '/src/$1',
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.js$': './node_modules/babel-jest',
    '.*\\.(vue)$': './node_modules/vue-jest',
    '.*\\.(scss)$': './node_modules/vue-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(bootstrap-vue|vue-plugin-load-script)/)',
  ],
  testPathIgnorePatterns: ['/test/', '/nuxt/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/components/**/*.{js,vue}',
    '**/pages/**/*.{js,vue}',
    '**/assets/js/**/*.{js,vue}',
    '!**/node_modules/**',
  ],
  coverageReporters: ['html', 'text-summary'],
}
