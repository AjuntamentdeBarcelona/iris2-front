/**
 * Store for sharing the main record files of a workflow.
 * This store is meant for selecting files on unirecords, in which many
 * answer editor components are placed for editing all the answers at once.
 */
export const state = () => ({
  mainRecord: {},
  loading: false,
  error: null,
})

export const mutations = {
  setError(state, error) {
    state.error = error
    if (error) {
      state.mainRecord = {}
    }
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setMain(state, main) {
    state.mainRecord = main
    state.error = null
  },
  setFiles(state, files) {
    state.mainRecord = { ...state.mainRecord, files: files }
    state.error = null
  },
}

export const getters = {}

export const actions = {
  async retrieveMainRecord({ commit }, id) {
    const promise = this.$axios.get(
      `api/record_cards/record_cards/retrieve/${id}/`
    )
    commit('setLoading', true, promise)
    promise
      .then(resp => {
        commit('setMain', resp.data)
      })
      .catch(e => {
        commit('setError', e)
      })
      .then(() => {
        commit('setLoading', false)
      })
    await promise
  },
  reset({ commit }) {
    commit('setMain', null)
  },
  newFiles({ commit }, files) {
    commit('setFiles', files)
  },
}
