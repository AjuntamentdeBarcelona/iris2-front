import fieldSelectRecordType from './fieldSelectRecordType.vue'
import {
  shallowMountWithMasterStore,
  recordTypes,
} from '~/assets/js/nuxt/testMasters.js'

describe('Select record type', () => {
  describe('Load values', () => {
    const wrapper = shallowMountWithMasterStore(fieldSelectRecordType, {
      model: {},
      schema: { model: 'test' },
    })
    it('Should receive options', () => {
      expect(wrapper.vm.loaded).toBeTruthy()
      expect(wrapper.vm.recordTypes).toEqual(recordTypes)
    })
    it('should take select label from description', () => {
      expect(wrapper.vm.internalSchema.selectOptions.name).toEqual(
        'description'
      )
    })
  })

  describe('Model updated', () => {
    const wrapper = shallowMountWithMasterStore(fieldSelectRecordType, {
      model: { test: 1 },
      schema: { model: 'test' },
    })
    it('Should change value', () => {
      wrapper.vm.internalModel = { value: 3 }
      wrapper.vm.modelUpdated()
      expect(wrapper.vm.value).toBe(3)
    })
  })

  describe('External value change', () => {
    const wrapper = shallowMountWithMasterStore(fieldSelectRecordType, {
      model: { test: 1 },
      schema: { model: 'test' },
    })
    it('Should change internal value', () => {
      expect(wrapper.vm.internalModel.value).toBe(1)
      wrapper.setProps({
        model: { test: 2 },
        schema: { model: 'test' },
      })
      expect(wrapper.vm.internalModel.value).toBe(2)
    })
  })
})
