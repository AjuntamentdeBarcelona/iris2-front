import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vuex from 'vuex'
import Vue from 'vue'
import * as groupStore from './groups.js'
import * as indexStore from './index.js'

export const fakeGroup = {
  description: 'GRUP1',
  profile_ctrl_user_id: 'GRUP1',
  dist_sect_id: 0,
  email: '',
  signature: '',
  citizen_nd: false,
  id: 1,
}
export const fakeGroups = {
  username: 'demo',
  current_group: fakeGroup,
  permissions: [],
  groups: [
    fakeGroup,
    {
      id: 2,
      description: 'GRUP2',
      profile_ctrl_user_id: 'GRUP2',
      dist_sect_id: 0,
      email: '',
      signature: '',
      citizen_nd: false,
    },
  ],
}

export function getGroupStore(axiosMockAdapter) {
  Vue.use(Vuex)
  const store = new Vuex.Store({
    ...indexStore,
    modules: {
      groups: { ...groupStore, namespaced: true },
    },
  })
  store.$axios = getGroupAxiosMock(axiosMockAdapter).axiosInstance
  return store
}

export function getGroupAxiosMock(axiosMockAdapter) {
  const axiosMock = axiosMockAdapter || new MockAdapter(axios)
  axiosMock.onGet('/api/profiles/user-groups/').reply(200, fakeGroups)
  axiosMock.onPost('/api/profiles/user-groups/set/').reply(200, fakeGroups)
  return axiosMock
}

describe('Groups Store', () => {
  it('should load group state', done => {
    const store = getGroupStore()
    store.dispatch('groups/loadGroups').then(() => {
      done()
    })
  })
  it('should not be ready if not loaded', () => {
    const store = getGroupStore()
    expect(store.state.groups.ready).toEqual(false)
  })
})
