import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vuex from 'vuex'
import Vue from 'vue'
import * as createStore from './create.js'
import * as indexStore from './index.js'

export function getCreateStore(axiosMockAdapter, applicantId, data) {
  Vue.use(Vuex)
  const store = new Vuex.Store({
    ...indexStore,
    modules: {
      create: { ...createStore, namespaced: true },
    },
  })
  store.$axios = getGroupAxiosMock(
    axiosMockAdapter,
    applicantId,
    data
  ).axiosInstance
  return store
}

export function getGroupAxiosMock(axiosMockAdapter, applicantId, data) {
  const axiosMock = axiosMockAdapter || new MockAdapter(axios)
  axiosMock
    .onGet(`/api/record_cards/applicant_response/${applicantId}/`)
    .reply(200, data)
  return axiosMock
}
