import { arrayToObject } from '~/assets/js/utils.js'

export const state = () => ({
  loading: false,
  loadingPromise: null,
  ready: false,
  permissionsReady: false,
  error: false,
  errorStatus: 0,
  groups: [],
  permissions: [],
  selectedGroup: null,
  allowNd: null,
  username: null,
})

export const mutations = {
  setGroupConfig(state, groupData) {
    state.groups = groupData[0]
    state.permissions = arrayToObject(groupData[2], 'codename')
    state.permissionsReady = true
    state.selectedGroup = groupData[1]
    state.allowNd = state.selectedGroup.citizen_nd
    state.username = groupData[3]
    state.ready = true
    state.error = state.groups.length == 0 || state.permissions.length == 0
    state.errorStatus = 0
  },
  setPermissions(state, permissions) {
    state.permissions = arrayToObject(permissions, 'codename')
    state.permissionsReady = true
  },
  startLoad(state) {
    state.loading = true
  },
  setLoadingPromise(state, loadingPromise) {
    state.loadingPromise = loadingPromise
  },
  loaded(state) {
    state.loading = false
  },
  setError(state, status) {
    state.error = true
    state.ready = false
    state.errorStatus = status
    state.permissionsReady = false
  },
}

function loadOperation({ state, commit }, store, url, method, params = {}) {
  if (!state.loading) {
    commit('startLoad')
    const loadingPromise = store.$axios[method](url, params)
    commit('setLoadingPromise', loadingPromise)
    loadingPromise
      .then(resp => {
        commit('setGroupConfig', [
          resp.data.groups,
          resp.data.current_group,
          resp.data.permissions,
          resp.data.username,
        ])
      })
      .catch(error => {
        commit('setError', error.response ? error.response.status : 500)
      })
      .then(() => {
        commit('loaded')
      })
  } else {
    return state.loadingPromise
  }
}

export const getters = {
  hasPermission: state => permission => {
    return state.permissions[permission] != null
  },
}

export const actions = {
  loadGroups(context, forceRefresh = false) {
    if ((!context.state.ready && !context.state.error) || forceRefresh) {
      return loadOperation(context, this, '/api/profiles/user-groups/', 'get')
    }
  },
  workAsGroup(context, group) {
    return loadOperation(
      context,
      this,
      '/api/profiles/user-groups/set/',
      'post',
      {
        // backwards compatibility with old backends
        profile_ctrl_user_id: group.profile_ctrl_user_id,
        // new api version
        group_id: group.id,
      }
    )
  },
  reloadPermissions({ commit }) {
    return this.$axios
      .get('/api/profiles/user-permissions/')
      .then(resp => {
        commit('setPermissions', resp.data)
      })
      .catch(e => {
        commit('setError')
      })
  },
}
