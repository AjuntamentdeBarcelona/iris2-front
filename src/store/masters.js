export const state = () => ({
  recordTypes: [],
  mediaTypes: [],
  responseChannels: [],
  applications: [],
  processes: [],
  districts: [],
  profiles: [],
  resolutionTypes: [],
  recordStates: [],
  protocols: [],
  externalServices: [],
  reasons: [],
  cancelReasons: [],
  reassignReasons: [],
  states: [],
  applicantTypes: [],
  supports: [],
  themeGroups: [],
  groups: [],
  permissions: [],
  communicationMedias: [],
  templateVars: [],
  batchTypes: [],
  gestactProtocols: [],
  zones: [],
})

export const getters = {
  /**
   * Finds the required fields for an element detail for this process in order
   * to work and create valid records.
   */
  processRequires: state => process => {
    const p = state.processes.find(p => p.id == process)
    if (p) {
      return p.requires || []
    }
    return []
  },
  /**
   * Finds the disabled fields for an element detail for this process in order
   * to work and create valid records.
   */
  processDisabled: state => process => {
    const p = state.processes.find(p => p.id == process)
    if (p) {
      return p.disabled || []
    }
    return []
  },
}

export const mutations = {
  loadResponseChannels: (state, responseChannels) => {
    state.responseChannels = responseChannels
  },
  loadApplications: (state, responseChannels) => {
    state.applications = responseChannels
  },
  loadProcesses: (state, processes) => {
    state.processes = processes
  },
}

export const actions = {
  async retrieveResponseChannels({ commit, state }) {
    return loadMaster(
      this,
      commit,
      state,
      'responseChannels',
      'loadResponseChannels',
      '/api/masters/response_channels/'
    )
  },
  async retrieveApplications({ commit, state }) {
    loadMaster(
      this,
      commit,
      state,
      'applications',
      'loadApplications',
      '/api/masters/applications/'
    )
  },
  retrieveProcesses({ commit, state }) {
    const promise = loadMaster(
      this,
      commit,
      state,
      'processes',
      'loadProcesses',
      '/api/masters/process/'
    )
    return promise ? promise : new Promise(resolve => resolve())
  },
}

addMaster('recordTypes', '/api/masters/record_types/')
addMaster('districts', '/api/masters/districts/')
addMaster('profiles', '/api/profiles/groups/')
addMaster('resolutionTypes', '/api/masters/resolution-types/')
addMaster('recordStates', '/api/masters/record_states/')
addMaster('protocols', '/api/protocols/', values => {
  return values.map(value => {
    return {
      full_description: `${value.protocol_id} - ${value.short_description}`,
      ...value,
    }
  })
})
addMaster('reasons', '/api/masters/reasons/')
addMaster('cancelReasons', '/api/masters/cancel-reasons/')
addMaster('reassignReasons', '/api/masters/reasign-reasons/')
addMaster('states', '/api/masters/record_states/')
addMaster('applicantTypes', '/api/masters/applicant_types/')
addMaster('supports', '/api/masters/supports/')
addMaster('themeGroups', '/api/theme/theme_groups/')
addMaster('externalServices', '/api/masters/external-service/')
addMaster('groups', '/api/profiles/groups/')
addMaster('permissions', '/api/profiles/permissions/')
addMaster('communicationMedias', '/api/masters/communication_medias/')
addMaster('mediaTypes', '/api/masters/media_types/')
addMaster('templateVars', '/api/templates/variables/')
addMaster('batchTypes', '/api/integrations/task-types/')
addMaster('gestactProtocols', '/api/integrations/gestact-protocols/')
addMaster('zones', '/api/theme/zones/')

export function loadMaster(
  store,
  commit,
  state,
  attribute,
  commitName,
  endpoint,
  force
) {
  if (!state[attribute].length || force) {
    return store.$axios
      .get(endpoint)
      .then(response => {
        commit(
          commitName,
          Array.isArray(response.data) ? response.data : response.data.results
        )
      })
      .catch(error => {
        console.log(error)
        console.log('App cannot start properly.')
      })
  }
}

/**
 * @todo Add cache time
 * @param {*} attribute
 * @param {*} url
 */
function addMaster(attribute, url, processValues = null) {
  const action = attribute.charAt(0).toUpperCase() + attribute.substring(1),
    actionName = `retrieve${action}`,
    mutation = `load${action}`,
    loadStateName = `${attribute}LoadPromise`,
    loadStateMutation = `set${action}Promise`

  state[loadStateName] = null

  mutations[mutation] = function(state, values) {
    state[attribute] = processValues != null ? processValues(values) : values
  }
  mutations[loadStateMutation] = function(state, values) {
    state[loadStateName] = values
  }
  actions[actionName] = async function({ commit, state }, force) {
    if (!state[loadStateName] || force) {
      commit(
        loadStateMutation,
        loadMaster(this, commit, state, attribute, mutation, url, force)
      )
    }
    return state[loadStateName]
  }
}
