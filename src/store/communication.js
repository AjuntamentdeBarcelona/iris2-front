/**
 * Common state for template edition functions.
 */
export const state = () => ({
  header: '',
  footer: '',
  answerBody: '',
  simpleBody: '',
  loading: null,
  error: null,
})

function adjustBr(str) {
  return str.replace('<br>', '</p><p>')
}

export const mutations = {
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  },
  setData(state, data) {
    state.header = adjustBr(data.header)
    state.footer = adjustBr(data.footer)
    state.answerBody = adjustBr(data.answer_body)
    state.simpleBody = adjustBr(data.simple_body)
    state.answerTag = data.answer_tag
  },
}

export const getters = {
  isLoading(state) {
    return state.loading != null
  },
  getSimple(state) {
    if (!state.simpleBody) {
      return ''
    }
    return `<p>${state.header}</p>${state.simpleBody}<p>${state.footer}</p>`
  },
  getRequireAnswer(state) {
    if (!state.answerBody) {
      return ''
    }
    return `<p>${state.header}</p>${state.answerBody}<p>${state.footer}</p>`
  },
}

export const actions = {
  loadTemplates({ commit, state }, recordId) {
    if (state.loading) {
      return state.loading
    }
    const promise = this.$axios.get(
      `api/templates/record-card/${recordId}/communications/`
    )
    commit('setLoading', promise)
    promise
      .then(resp => {
        commit('setData', resp.data)
      })
      .catch(e => {
        commit('setError', resp.error)
      })
      .then(() => {
        commit('setLoading', null)
      })
  },
  wrapTemplate({ state }, template) {
    return `<p>${state.header}</p>${template}<p>${state.footer}</p>`
  },
}
