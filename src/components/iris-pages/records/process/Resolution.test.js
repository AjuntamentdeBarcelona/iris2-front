import Resolution from './Resolution.vue'
import nuxtShallowMount from '~/assets/js/nuxt/testUtils.js'
import { testProcessStep } from './ProcessStepTest.js'
import moment from 'moment'

describe('Process Plan', () => {
  const RESOLVE_URL = 'RESOLVE_URL'
  const process = {
    ideal_path: [
      'pending_validate',
      'validate',
      'planifiying',
      'resolute',
      'answer',
    ],
    current_step: 'resolute',
    actions: {
      resolute: { action_url: RESOLVE_URL },
    },
    element_detail: {
      requires_appointment: true,
    },
  }

  function mountResolution(process, extraProps) {
    return nuxtShallowMount(Resolution, {
      process: process,
      step: {
        transition: 'resolute',
      },
      detail: process.element_detail,
      ...extraProps,
    })
  }

  testProcessStep(process, mountResolution, 'resolute')

  describe('Appointment', () => {
    describe('Detail requires appointment', () => {
      it('should select appointment time and date', () => {
        process.element_detail.requires_appointment = true
        const comp = mountResolution(process)
        expect(comp.vm.schemaDef.fields.resolution_date.required).toBe(true)
        expect(comp.vm.schemaDef.fields.resolution_time.required).toBe(true)
        expect(comp.vm.schemaDef.fields.service_person_incharge.required).toBe(
          true
        )
      })
    })
    describe('Detail does not require appointment', () => {
      it('should not select appointment date', () => {
        process.element_detail.requires_appointment = false
        const comp = mountResolution(process)
        expect(comp.vm.schemaDef.fields.resolution_date.required).toBeFalsy()
        expect(comp.vm.schemaDef.fields.resolution_time.required).toBeFalsy()
        expect(
          comp.vm.schemaDef.fields.service_person_incharge.required
        ).toBeFalsy()
      })
    })
  })

  describe('Save data', () => {
    process.element_detail.requires_appointment = true
    const comp = mountResolution(process)
    it('should transform resolution date', () => {
      const result = comp.vm.getSaveData({
        resolution_date: moment('11/03/2019', 'DD/MM/YYYY'),
      })
      expect(result.resolution_date).toBe('2019-03-11 00:00')
    })
  })
})
