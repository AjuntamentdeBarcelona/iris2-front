import { compareFn } from '~/assets/js/helpers'

export const state = () => ({
  groupTree: null,
  groupList: [],
  loading: false,
  error: true,
  promise: null,
})

function treeToList(tree) {
  let groups = []
  for (let group of tree) {
    groups.push(group)
    if (group.childrens.length) {
      groups = groups.concat(treeToList(group.childrens))
    }
  }
  return groups
}

export const mutations = {
  setTree(state, tree) {
    state.groupTree = tree
    state.error = false
    const groups = treeToList([tree])
    groups.sort((a, b) => compareFn(a.name, b.name))
    state.groupList = groups
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
  },
  setPromise(state, promise) {
    state.promise = promise
  },
}

export const getters = {}

export const actions = {
  loadTree({ commit, state }, forceReload) {
    if (!forceReload && state.promise != null) {
      return state.promise
    }
    commit('setLoading', true)
    const promise = this.$axios.get('/api/profiles/groups/tree/')
    promise
      .then(resp => {
        commit('setTree', resp.data)
      })
      .catch(error => {
        commit('setError', true)
      })
      .then(resp => {
        commit('setLoading', false)
      })
    commit('setPromise', promise)
    return state.promise
  },
}
