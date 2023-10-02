import Process from './Process.vue'
import nuxtShallowMount from '~/assets/js/nuxt/testUtils.js'

describe('Process', () => {
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
      planifiying: 'URL',
    },
    element_detail: {
      requires_appointment: true,
    },
  }

  function mountProcess(process) {
    return nuxtShallowMount(Process, {
      process: process,
    })
  }

  it('should compute ideal path', () => {
    const comp = mountProcess(process)
    expect(comp.vm.idealPath.length).toBeGreaterThan(0)
    for (let step of comp.vm.idealPath) {
      expect(step.transition).not.toBeNull()
      expect(step.id).not.toBeNull()
      expect(step.ready).not.toBeNull()
    }
  })
  it('should have valid actions', () => {
    const comp = mountProcess(process)
    expect(comp.vm.actionsPath.map(path => path.transition)).toEqual([
      'planifying',
      'resolute',
      'answer',
    ])
  })
  it('should compute index of current bassed on valid actions', () => {
    const comp = mountProcess(process)
    expect(comp.vm.indexOfCurrent).toBe(0) // Must be one, since planifiying is the first process action
  })
  it('should compute actions path', () => {})
})
