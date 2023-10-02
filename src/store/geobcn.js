/**
 * Store for managing the GeoBCN external library loading.
 */
import LoadScript from 'vue-plugin-load-script'
import Vue from 'vue'
Vue.use(LoadScript)

export const state = () => ({
  loaded: false,
  loading: false,
  loadingPromise: null,
  error: false,
  geoBCN: null,
})

export const mutations = {
  /**
   * Sets the loading state.
   */
  setLoadingState: (state, promise) => {
    state.loading = true
    state.loaded = false
    state.error = false
    state.loadingPromise = promise
  },
  setLoadedState: (state, geoBCN) => {
    state.error = false
    state.loading = false
    state.loaded = true
    state.geoBCN = geoBCN
  },
  setErrorState: state => {
    state.loaded = false
    state.loading = false
    state.error = true
  },
}

export const actions = {
  /**
   * Loads geoBCN and returns a promise for handling the process and start the components.
   * @param {*} force Force reload
   * @return {Promise} Promise for handling the process and start the components.
   */
  geoBCN({ commit, state }, force = false) {
    if (state.loading) {
      return state.loadingPromise
    } else if (!force && state.loaded) {
      return new Promise(resolve => resolve(state.geoBCN))
    }

    const promise = new Promise((resolve, reject) => {
      // https://w33.bcn.cat/geoBCN/js/api/latest/ca
      Vue.loadScript('https://w33.bcn.cat/geoBCN/js/api/?v=0.5&f=jsapi.js')
        .then(() => {
          geoBCN.usHTML = true
          geoBCN.esMobil = false
          geoBCN.isLoaded = true
          geoBCN.ready = () => {
            commit('setLoadedState', geoBCN)
            resolve(geoBCN)
          }
        })
        .catch(e => {
          console.log(e)
          reject(e)
          commit('setErrorState')
        })
    })
    commit('setLoadingState', promise)
    return promise
  },
}
