export const state = () => ({
  version: '0.20.0',
  lastUpdated: '19/03/2019 11:41',
  applicationId: 0,
  config: {
    issueCollectorEnabled: false,
    issueCollectorUrl:
      'https://jira.ajuntament.bcn/s/31cfbdc70f49b3cf1de7fe024d20c9ac-T/-1uipyd/713000/36d928ab2b666aafd94483a08dd6a0cb/2.0.31/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=es-ES&collectorId=0380ea7a',
    logoutUrl: null,
    env: 'DSV',
    maintenance: '',
  },
  configLoading: false,
  /**
   * Configuration values loaded from the server and visible for everyone.
   */
  parameters: {
    get(key, default_val) {
      return this[key] != undefined ? this[key].valor : default_val
    },
  },
  parameterError: false,
  parameterLoading: false,
})

export const mutations = {
  setConfig(state, config) {
    state.config = Object.assign({}, state.config, config)
  },
  setConfigLoading(state, loading) {
    state.config.loading = loading
  },
  setConfigError(state, error) {
    state.configError = error
  },
  setParameters(state, parameters) {
    state.parameters = Object.assign({}, state.parameters, parameters)
  },
  setParamLoading(state, loading) {
    state.loading = loading
  },
  setParamError(state, error) {
    state.parameterError = error
  },
  setLogoutURL(state, url) {
    state.logoutUrl = url
  },
}

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },

  /**
   * Applicant types that require selecting an applicant.
   */
  applicantTypesRequireApplicant(state) {
    return state.parameters
      .get('TIPUS_SOLICITANT_NO_CARREGA_CIUTADA', '0/1/2')
      .split('/')
      .map(id => parseInt(id))
  },

  config(state) {
    return state.config
  },
}

export const actions = {
  nuxtClientInit({ commit }, context) {
    const configUrl = `${context.base}config.json`
    fetch(configUrl, { credentials: 'same-origin' })
      .then(response => {
        const contentType = response.headers.get('Content-Type')
        if (
          response.ok &&
          contentType &&
          contentType.indexOf('application/json') !== -1
        ) {
          response.json().then(config => {
            if (config.ISSUE_COLLECTOR_ENABLED) {
              config.issueCollectorEnabled = config.ISSUE_COLLECTOR_ENABLED
            }
            if (config.ISSUE_COLLECTOR_URL) {
              config.issueCollectorUrl = config.ISSUE_COLLECTOR_URL
            }
            config.env = config.ENV
            config.maintenance = config.MAINTENANCE
            const recordTypeId = parseInt(config.EXCLUDE_RECORD_TYPE_DEFAULT)
            config.EXCLUDE_RECORD_TYPE_DEFAULT = isNaN(recordTypeId)
              ? null
              : recordTypeId
            commit('setConfig', config)
            commit('setLogoutURL', config.LOGOUT_URL)
          })
        } else {
          console.log('The config file cannot be loaded.')
        }
      })
      .catch(() => {
        console.log('The config file cannot be loaded.')
      })
  },
  loadParams({ commit }) {
    commit('setParamLoading', true)
    return this.$axios
      .get('/api/masters/parameters/visible/')
      .then(resp => {
        const params = resp.data.results || resp.data
        const values = Object.assign.apply({}, [
          {},
          ...params.map(param => {
            const val = {}
            val[param.parameter] = param
            return val
          }),
        ])
        commit('setParameters', values)
        return values
      })
      .catch(error => {
        // Manage error
        commit('setParamError', true)
        return null
      })
      .then(values => {
        commit('setParamLoading', false)
        return values
      })
  },
}
