import Plan from './Plan.vue'
import nuxtShallowMount from '~/assets/js/nuxt/testUtils.js'
import { testProcessStep } from './ProcessStepTest.js'

describe('Process Plan', () => {
  const process = {
    ideal_path: [
      'pending_validate',
      'validate',
      'planifying',
      'resolute',
      'answer',
    ],
    current_step: 'planifying',
    actions: {
      planifying: { action_url: 'PLAN_URL' },
    },
    element_detail: {
      requires_appointment: true,
    },
  }

  function mountPlan(process, extraProps) {
    return nuxtShallowMount(Plan, {
      process: process,
      detail: process.element_detail,
      step: {
        transition: 'planifying',
      },
      ...extraProps,
    })
  }
  testProcessStep(process, mountPlan, 'planifying')
})
