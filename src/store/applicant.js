export const state = () => ({
  defaultApplicant: null,
  loading: false,
  promise: null,
  error: false,
})

export const mutations = {
  setDefaultApplicant(state, defaultApplicant) {
    state.error = false
    state.defaultApplicant = defaultApplicant
  },
  setLoading(state, loading, promise) {
    state.loading = loading
    state.promise = promise
  },
  setError(state, error) {
    state.error = error
    state.stateMap = {}
  },
}

export const actions = {
  async loadDefault({ commit, state }) {
    const promise = this.$axios.get('api/record_cards/default-applicant/')
    commit('setLoading', true, promise)
    promise
      .then(resp => {
        commit('setDefaultApplicant', resp.data)
      })
      .catch(() => {
        commit('setError', true)
      })
      .then(() => {
        commit('setLoading', false, null)
      })
  },
}
