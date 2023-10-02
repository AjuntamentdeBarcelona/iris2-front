import _ from 'lodash'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'

export const state = () => ({
  applicant: null,
  applicantId: '',
  applicantType: null,
  channel: null,
  configureAnswer: null,
  copyFilesFrom: null,
  detail: null,
  detailId: null,
  editMode: false,
  error: false,
  initialApplicantBirthYear: '',
  initialApplicantDistrict: '',
  initialApplicantDoc: '',
  initialApplicantDocType: null,
  initialApplicantFirstSurname: '',
  initialApplicantLang: '',
  initialApplicantName: '',
  initialApplicantSecondSurname: '',
  initialApplicantSex: '',
  initialApplicantType: '',
  initialIsRegister: false,
  initialCheckId: 0,
  defaultApplicantType: 0,
  issueText: '',
  loading: false,
  loadingPreviousAnswerData: false,
  loadingPromise: null,
  personType: 'P',
  previousAnswerData: {},
  withoutApplicant: false,
})

export const mutations = {
  resetState(state) {
    state.applicant = null
    state.applicantId = ''
    state.applicantType = null
    state.channel = null
    state.configureAnswer = null
    state.copyFilesFrom = null
    state.detail = null
    state.detailId = null
    state.initialApplicantBirthYear = ''
    state.initialApplicantDistrict = ''
    state.initialApplicantDoc = ''
    state.initialApplicantDocType = null
    state.initialApplicantFirstSurname = ''
    state.initialApplicantLang = ''
    state.initialApplicantName = ''
    state.initialApplicantSecondSurname = ''
    state.initialApplicantSex = ''
    state.initialIsRegister = false
    state.initialCheckId = 0
    state.issueText = ''
    state.previousAnswerData = {}
    state.withoutApplicant = false
  },
  setDetailId(state, detailId) {
    state.detailId = detailId
    if (state.detail && state.detailId != state.detail.id) {
      state.detail = null
    }
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setDefaultApplicantType(state, def) {
    state.defaultApplicantType = def
  },
  setWithoutApplicant(state, without) {
    state.withoutApplicant = without
  },
  setNewDetail(state, data) {
    state.detail = {
      ...data,
      requires_ubication: data.first_instance_response
        ? true
        : data.requires_ubication,
    }
    state.error = false
    state.loading = false
  },
  setChannel(state, data) {
    state.channel = data
    if (
      !state.channel.applicant_types ||
      !state.applicantType ||
      !state.channel.applicant_types.find(
        at => at.applicant_type == state.applicantType.id
      )
    ) {
      if (state.channel.applicant_types) {
        state.applicantType = state.channel.applicant_types.find(
          at =>
            at.id == state.defaultApplicantType ||
            at.applicant_type == state.defaultApplicantType
        )
        if (state.applicantType) {
          state.applicantType.id = state.applicantType.id
            ? state.applicantType.id
            : state.applicantType.applicant_type
        }
      } else {
        state.applicantType = null
      }
    }
    state.configureAnswer = true
  },
  setApplicant(state, applicant) {
    state.applicant = applicant
    state.configureAnswer = true
  },
  setApplicantType(state, applicantType) {
    state.applicantType = {
      ...applicantType,
      id:
        applicantType.id != null
          ? applicantType.id
          : applicantType.applicant_type,
    }
    state.configureAnswer = true
  },
  setConfigureAnswer(state, mustConfigure) {
    state.configureAnswer = mustConfigure
  },
  setError(state, error) {
    state.error = error
  },
  setPromise(state, prom) {
    state.loadingPromise = prom
  },
  setIssueText(state, issueText) {
    state.issueText = issueText
  },
  setApplicantInitial(
    state,
    [
      doc,
      name,
      firstSurname,
      secondSurname,
      applicantType,
      lang,
      district,
      birth_year,
      sex,
      doc_type,
      isRegister,
    ]
  ) {
    state.initialApplicantDoc = '' + doc
    state.initialApplicantName = name
    state.initialApplicantFirstSurname = firstSurname
    state.initialApplicantSecondSurname = secondSurname
    state.initialApplicantType = applicantType
    state.initialApplicantLang = lang
    state.initialApplicantDistrict = district
    state.initialApplicantBirthYear = birth_year
    state.initialApplicantSex = sex
    state.initialApplicantDocType = doc_type
    state.initialIsRegister = isRegister
    state.initialCheckId = state.initialCheckId + 1
  },
  setLoadingPreviousAnswerData(state, loading) {
    state.loadingPreviousAnswerData = loading
  },
  setPreviousAnswerData(state, previousAnswerData) {
    state.previousAnswerData = previousAnswerData
  },
  setCopyFilesFrom(state, copyFrom) {
    if (copyFrom && copyFrom.files.length > 0) {
      state.copyFilesFrom = copyFrom.id
    } else {
      state.copyFilesFrom = null
    }
  },
  setEditMode(state, mode) {
    state.editMode = mode
  },
}

export const getters = {
  applicantTypes(state) {
    return (state.channel ? state.channel.applicant_types || [] : [])
      .map(item => {
        return {
          ...item,
          id: item.id || item.applicant_type,
        }
      })
      .filter(
        item =>
          !state.defaultApplicantType || item.id == state.defaultApplicantType
      )
  },
  isInternalReady(state) {
    return state.internalOperator != null
  },
  readyForConfigureAnswer(state) {
    return (
      [
        state.channel,
        state.applicant,
        state.applicant ? state.applicant.id || null : null,
        state.applicantType,
        state.detail,
      ].indexOf(null) < 0 && !state.loadingPreviousAnswerData
    )
  },
}

export const actions = {
  newChannel({ state, commit, getters, dispatch }, channel) {
    if (_.get(state.channel, 'id', null) != _.get(channel, 'id', null)) {
      commit('setChannel', { ...channel })
      if (getters.applicantTypes.length == 1) {
        commit('setApplicantType', getters.applicantTypes[0])
      }
      dispatch('loadPreviousAnswerData')
    }
  },
  setWithoutApplicant({ commit }, without) {
    commit('setWithoutApplicant', without)
  },
  newApplicantType({ commit, dispatch, state }, applicantType) {
    const newId = _.get(
      applicantType,
      'id',
      _.get(applicantType, 'applicant_type', null)
    )
    if (_.get(state.applicantType, 'id', null) != newId) {
      commit('setApplicantType', { ...applicantType })
      dispatch('loadPreviousAnswerData')
    }
  },
  /**
   * Set the applicant. If not selected has to be null.
   * @param {*} param0
   * @param {*} applicant
   */
  newApplicant({ commit, dispatch, state }, applicant) {
    const oldId = _.get(state.applicant, 'id', null)
    commit('setApplicant', applicant ? { ...applicant } : null)
    if (oldId != _.get(applicant, 'id', null)) {
      dispatch('loadPreviousAnswerData')
    }
  },
  loadDetail({ commit, state }, detailId) {
    if (detailId == state.detailId) {
      return
    }
    commit('setDetailId', detailId)
    if (detailId != null) {
      commit('setLoading', true)
      const promise = this.$axios
        .get('/api/theme/details/' + state.detailId + '/')
        .then(resp => {
          commit('setNewDetail', resp.data)
        })
        .then(resp => {
          commit('setLoading', false)
        })
      promise.catch(error => {
        commit('setError', true)
      })

      commit('setPromise', promise)
    }
  },
  overrideDetail({ commit }, detail) {
    commit('setNewDetail', detail)
    commit('setDetailId', detail.id)
  },
  loadPreviousAnswerData({ commit, state, dispatch }) {
    if (
      state.applicant &&
      state.applicant.id &&
      state.applicantType &&
      state.channel &&
      state.channel.id != null
    ) {
      commit('setLoadingPreviousAnswerData', true)
      this.$axios
        .get(
          `/api/record_cards/applicant_response/${
            state.applicant.id
          }/?applicant_type_id=${state.applicantType.id}&input_channel_id=${
            state.channel.id
          }`
        )
        .then(response => {
          if (!state.editMode) {
            commit('setPreviousAnswerData', response.data)
          }
          commit('setConfigureAnswer', response.data.send_response)
        })
        .catch(e => {
          commit('setConfigureAnswer', true)
        })
        .finally(commit('setLoadingPreviousAnswerData', false))
    } else {
      dispatch('resetPreviousAnswerData')
    }
  },
  resetPreviousAnswerData({ commit, state }) {
    commit('setPreviousAnswerData', {})
  },
  setInitialFromApplicant({ commit, state }, applicant) {
    const person = applicant.citizen
      ? applicant.citizen
      : applicant.social_entity

    commit('setApplicantInitial', [
      person.cif || person.dni,
      person.contact || person.name,
      person.social_reason || person.first_surname,
      person.second_surname || '',
      applicant.citizen ? state.personType : '',
      person.language,
      person.district,
      person.birth_year,
      person.sex,
      person.document_type,
    ])
  },
}
