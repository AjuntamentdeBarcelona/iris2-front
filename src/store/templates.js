/**
 * Common state for template edition functions.
 */
export const state = () => ({
  answerTypes: [],
  templates: {}, // Templates indexed by answer type
  loading: 0,
  errorTemplates: false,
  errorAnswerTypes: false,
})

export const mutations = {
  setErrorTemplates(state, error) {
    state.errorTemplates = error
    if (errorTemplates) {
      state.templates = {}
    }
  },
  setErrorAnswerTypes(state, error) {
    state.errorAnswerTypes = error
    if (errorTemplates) {
      state.answerTypes = []
    }
  },
  setLoading(state, loading) {
    state.loading += loading ? 1 : -1
  },
  setAnswerTypes(state, rTypes) {
    state.answerTypes = rTypes
  },
  setTemplates(state, templates) {
    state.templates = templates.map(temp => {
      return {
        ...temp,
        preview_text: temp.write_medium_catalan || temp.sms_medium_catalan,
      }
    })
  },
}

export const getters = {
  isLoading(state) {
    return state.loading > 0
  },
  hasError(state) {
    return state.errorAnswerTypes || state.errorTemplates
  },
  getTemplates(state) {
    return state.templates
  },
  getAnswerTypeTemplates: state => answerType => {
    const answerTypeId = isNaN(answerType) ? answerType.id : answerType
    return state.templates.filter(item => item.response_type_id == answerTypeId)
  },
}

export const actions = {
  async retrieveAnswerTypes({ commit }) {
    const promise = this.$axios.get('api/templates/response_types/')
    commit('setLoading', true, promise)
    promise
      .then(resp => {
        commit('setAnswerTypes', resp.data.results)
      })
      .catch(() => {
        commit('setError', true)
      })
      .then(() => {
        commit('setLoading', false, null)
      })
    await promise
  },
  async retrieveTemplates({ commit }) {
    const promise = this.$axios.get('api/templates/templates/')
    commit('setLoading', true, promise)
    promise
      .then(resp => {
        commit('setTemplates', resp.data.results)
      })
      .catch(() => {
        commit('setError', true)
      })
      .then(() => {
        commit('setLoading', false, null)
      })
    await promise
  },
}
