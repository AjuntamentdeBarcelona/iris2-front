import { getCreateStore } from '~/store/create.test.js'
import nuxtShallowMount from '~/assets/js/nuxt/testUtils.js'
import AnswerConfig from './AnswerConfig.vue'
import ResponseChannel from '~/assets/js/iris2/model/ResponseChannel.js'

describe('AnswerConfig', () => {
  const APPLICANT_ID = 1
  const ALL_RESPONSE_CHANNELS = ResponseChannel.getAll({
    $t: a => a,
  }).map(val => {
    return {
      responsechannel: val.id,
    }
  })

  function factory(applicantData, responseChannels = ALL_RESPONSE_CHANNELS) {
    const store = getCreateStore(undefined, APPLICANT_ID, applicantData)
    store.dispatch('create/loadPreviousAnswerData', APPLICANT_ID)
    return nuxtShallowMount(
      AnswerConfig,
      {
        detail: {
          immeditate_response: false,
          response_channels: responseChannels,
        },
      },
      {
        $store: store,
      }
    )
  }

  describe('AnswerConfig previous applicant data', () => {
    describe('When detail accepts all response channels', () => {
      describe('when there is no data', () => {
        const w = factory(getApplicantTestData(APPLICANT_ID, {}))
        it('should not have data', () => {
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({})
        })
      })
      describe('when has only email', () => {
        const testData = getApplicantTestData(APPLICANT_ID, { email: true })
        const w = factory(testData)
        it('should have email', () => {
          w.vm.response_channel = null
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({ address_mobile_email: testData.email })
          expect(w.vm.response_channel).toBe(ResponseChannel.EMAIL)
        })
      })
      describe('when has only phone', () => {
        const testData = getApplicantTestData(APPLICANT_ID, { phone: true })
        const w = factory(testData)
        it('should have phone', () => {
          w.vm.response_channel = null
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({
            address_mobile_email: testData.phone_number,
          })
          expect(w.vm.response_channel).toBe(ResponseChannel.TELEPHONE)
        })
      })
      describe('when has only sms', () => {
        const testData = getApplicantTestData(APPLICANT_ID, { mobile: true })
        const w = factory(testData)
        it('should have sms', () => {
          w.vm.response_channel = null
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({
            address_mobile_email: testData.mobile_number,
          })
          expect(w.vm.response_channel).toBe(ResponseChannel.SMS)
        })
      })
      describe('when has only letter', () => {
        const testData = getApplicantTestData(APPLICANT_ID, { letter: true })
        const w = factory(testData)
        it('should have letter', () => {
          w.vm.response_channel = null
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel.postal_code).toBeTruthy()
          expect(w.vm.response_channel).toBe(ResponseChannel.LETTER)
        })
      })
      describe('when has all', () => {
        const testData = getApplicantTestData(APPLICANT_ID, {
          email: true,
          mobile: true,
          letter: true,
          phone: true,
        })
        const w = factory(testData)
        it('should have email', () => {
          w.vm.response_channel = null
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({ address_mobile_email: testData.email })
          expect(w.vm.response_channel).toBe(ResponseChannel.EMAIL)
        })
      })
      describe('when has sms and letter', () => {
        const testData = getApplicantTestData(APPLICANT_ID, {
          mobile: true,
          letter: true,
        })
        const w = factory(testData)
        it('should have sms', () => {
          w.vm.response_channel = null
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({
            address_mobile_email: testData.mobile_number,
          })
          expect(w.vm.response_channel).toBe(ResponseChannel.SMS)
        })
      })
      describe('when response channel is set on mail and theres email data', () => {
        const testData = getApplicantTestData(APPLICANT_ID, {
          email: true,
        })
        const w = factory(testData)
        it('should have email', () => {
          w.setData({ response_channel: ResponseChannel.EMAIL })
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({ address_mobile_email: testData.email })
          expect(w.vm.response_channel).toBe(ResponseChannel.EMAIL)
        })
      })
      describe('when response channel is set on mail and theres no email but sms', () => {
        const testData = getApplicantTestData(APPLICANT_ID, {
          mobile: true,
        })
        const w = factory(testData)
        it('should have sms', () => {
          w.setData({ response_channel: ResponseChannel.EMAIL })
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({
            address_mobile_email: testData.mobile_number,
          })
          expect(w.vm.response_channel).toBe(ResponseChannel.SMS)
        })
      })
      describe('when response channel is set on sms and theres sms and letter', () => {
        const testData = getApplicantTestData(APPLICANT_ID, {
          mobile: true,
          letter: true,
        })
        const w = factory(testData)
        it('should have sms', () => {
          w.setData({ response_channel: ResponseChannel.SMS })
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({
            address_mobile_email: testData.mobile_number,
          })
          expect(w.vm.response_channel).toBe(ResponseChannel.SMS)
        })
      })
      describe('when response channel is set on sms and theres letter and phone', () => {
        const testData = getApplicantTestData(APPLICANT_ID, {
          letter: true,
          phone: true,
        })
        const w = factory(testData)
        it.skip('should have letter', () => {
          w.setData({ response_channel: ResponseChannel.SMS })
          const formModel = w.vm.getPreviousAnswerData()
          expect(formModel).toEqual({
            address_mobile_email: testData.letter,
          })
          expect(w.vm.response_channel).toBe(ResponseChannel.LETTER)
        })
      })
    })
  })
})

function getApplicantTestData(applicant, includeData) {
  const includes = {
    email: false,
    mobile: false,
    letter: false,
    phone: false,
    ...includeData,
  }
  const letter = {
    street_type: 'Carrer',
    street: 'Gran via',
    number: '22',
    floor: '1',
    door: 'A',
    scale: '2',
    postal_code: '08035',
    municipality: 'BARCELONA',
    province: 'BARCELONA',
  }
  return {
    id: 1,
    user_id: 'xxxx',
    created_at: '2019-10-16T10:20:29.204471+02:00',
    updated_at: '2019-10-16T18:08:46.882873+02:00',
    treatment: true,
    language: 'ca',
    phone_number: includes.phone ? '927262524' : '',
    mobile_number: includes.mobile ? '635856961' : '',
    email: includes.email ? 'algo@est.com' : '',
    enabled: true,
    authorization: false,
    applicant: applicant,
    ...(includes.letter ? letter : {}),
    response_channel: 1,
  }
}
