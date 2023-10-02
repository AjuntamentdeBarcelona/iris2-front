import { shallowMountWithMasterStore } from '~/assets/js/nuxt/testMasters'
import { NUMBER, getMasks } from '~/assets/js/iris2/model/Masks.js'
import RecordCardSearch from './RecordCardSearchList.vue'

describe('RecordCardSearch with filters', () => {
  function factory() {
    return shallowMountWithMasterStore(RecordCardSearch, {
      url: 'test',
    })
  }

  describe('Proccess the different filters for a valid querystring', () => {
    describe('Attributes will be flatteng as individual get params', () => {
      const w = factory({})
      it('Should generate filters from attribute list with ilike_contains lookup', () => {
        const selectedAttrs = [
          {
            value: 'AASSAS',
            feature: 1,
          },
          {
            value: 'XHEK',
            feature: 3,
          },
        ]
        const result = w.vm.extractAttributesValues(selectedAttrs)
        for (let attr in selectedAttrs) {
          expect(result['valueic_' + attr]).toBe(selectedAttrs[attr].value)
          expect(result['feature_' + attr]).toBe(selectedAttrs[attr].feature)
        }
      })
      it('Should generate value without ilike_contains from numeric mask', () => {
        const selectedAttrs = [
          {
            value: '10000',
            feature: 101,
            mask: getMasks()[`${NUMBER}`],
          },
        ]
        const result = w.vm.extractAttributesValues(selectedAttrs)
        for (let attr in selectedAttrs) {
          expect(result['value_' + attr]).toBe(selectedAttrs[attr].value)
          expect(result['feature_' + attr]).toBe(selectedAttrs[attr].feature)
        }
      })
    })
  })
})
