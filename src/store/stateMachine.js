export const state = () => ({
  stateMap: {},
  loading: false,
  promise: null,
  error: false,
})

export const mutations = {
  setMap(state, map) {
    state.error = false
    state.stateMap = map
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
  async loadMap({ commit, state }) {
    const promise = this.$axios.get('api/record_cards/state-machine/map/')
    commit('setLoading', true, promise)
    promise
      .then(resp => {
        commit('setMap', resp.data)
      })
      .catch(() => {
        commit('setError', true)
      })
      .then(() => {
        commit('setLoading', false, null)
      })
  },
}
