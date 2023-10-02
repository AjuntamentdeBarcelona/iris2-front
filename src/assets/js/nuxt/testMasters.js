import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import * as masterStore from '~/store/masters.js'
import * as indexStore from '~/store/index.js'
import MockAdapter from 'axios-mock-adapter'
import nuxtShallowMount from './testUtils.js'

export const recordTypes = [
  {
    id: 1,
    description: 'Incidencia',
  },
  {
    id: 2,
    description: 'Queixa',
  },
]

export const responseChannels = [
  {
    id: 1,
    description: 'Email',
  },
  {
    id: 2,
    description: 'SMS',
  },
  {
    id: 3,
    description: 'Carta',
  },
]
export const parameters = {
  count: 15,
  next: null,
  previous: null,
  results: [
    {
      id: 2,
      user_id: '22',
      created_at: '2019-02-13T01:00:00+01:00',
      updated_at: '2019-02-13T01:00:00+01:00',
      parameter: 'IRIS_TEXT_VALIDACIO',
      valor: '8,2',
      description:
        'Validar en IRIS, Queixes i Consultis els textos de comentaris: Mínim de lletres, Mínim de paraules; 0: No validar',
      name: 'Caràcters per validar en IRIS i Web',
      original_description:
        'Validar en IRIS, Queixes i Consultis els textos de comentaris: Mínim de lletres, Mínim de paraules; 0: No validar',
      show: true,
      data_type: false,
      visible: true,
    },
    {
      id: 222,
      user_id: '22',
      created_at: '2019-02-13T01:00:00+01:00',
      updated_at: '2019-02-13T01:00:00+01:00',
      parameter: 'LINK_BI_IRIS',
      valor: 'http://test2.com',
      description: '',
      name: 'LINK BI',
      original_description: '',
      show: true,
      data_type: false,
      visible: true,
    },
    {
      id: 222,
      user_id: '22',
      created_at: '2019-02-13T01:00:00+01:00',
      updated_at: '2019-02-13T01:00:00+01:00',
      parameter: 'LINK_BI',
      valor: 'http://test.com',
      description: '',
      name: 'LINK BI',
      original_description: '',
      show: true,
      data_type: false,
      visible: true,
    },
    {
      id: 2222,
      user_id: '22',
      created_at: '2019-02-13T01:00:00+01:00',
      updated_at: '2019-02-13T01:00:00+01:00',
      parameter: 'VISUALITZACIO_BI',
      valor: '1',
      description: '',
      name: 'VISUALITZACIO_BI',
      original_description: '',
      show: true,
      data_type: false,
      visible: true,
    },
    {
      id: 2587,
      user_id: 'DX9154',
      created_at: '2005-04-15T02:00:00+02:00',
      updated_at: '2019-03-19T15:41:22.521477+01:00',
      parameter: 'NUMPERPAGPETIT',
      valor: '7',
      description: '',
      name: 'Nombre de registres per consulta',
      original_description: 'Nombre de registres per consulta',
      show: true,
      data_type: false,
      visible: true,
    },
  ],
  _get(param) {
    return this.results.filter(p => p.parameter == param)[0].valor
  },
}

const localVue = createLocalVue()

localVue.use(Vuex)

export function getMasterStore(axios) {
  let store = new Vuex.Store({
    ...indexStore,
    modules: {
      masters: { namespaced: true, ...masterStore },
    },
  })
  store.$axios = axios
  return store
}

export function shallowMountWithMasterStore(component, props, mocks = {}) {
  const axiosMock = new MockAdapter(axios)
  axiosMock
    .onGet('/api/masters/record_types/')
    .reply(200, { results: recordTypes })
  axiosMock
    .onGet('/api/masters/response_channels/')
    .reply(200, { results: responseChannels })
  axiosMock.onGet('/api/masters/parameters/visible/').reply(200, parameters)

  let store = getMasterStore(axios)

  return shallowMount(component, {
    localVue,
    store,
    propsData: {
      ...props,
    },
    mocks: {
      $axios: axios,
      $vuex: getMasterStore(),
      $t: val => val,
      ...mocks,
    },
  })
}
