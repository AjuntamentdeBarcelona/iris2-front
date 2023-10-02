import {
  parameters,
  shallowMountWithMasterStore,
  getMasterStore,
} from '~/assets/js/nuxt/testMasters'
import ReportPage from './index.vue'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('Reports page', () => {
  function factory(props, mocks) {
    return shallowMountWithMasterStore(ReportPage, props, mocks)
  }

  describe('BI Link props', () => {
    const w = factory({}, {})
    it('should load config', () => {
      expect(w.vm.biUrl).toBe(parameters._get('LINK_BI'))
      expect(w.vm.showBIUrls).toBeTruthy()
    })
    it('should show button when visualization is true', () => {
      expect(w.findAll('#bi').exists()).toBe(true)
    })
  })
})
