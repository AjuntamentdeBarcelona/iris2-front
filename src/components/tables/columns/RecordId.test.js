import nuxtShallowMount from '~/assets/js/nuxt/testUtils'
import RecordId from './RecordId.vue'

describe('Record id Column', () => {
  const normalizedRecordId = '2222XXX'

  function getComponent(dataSource) {
    return nuxtShallowMount(RecordId, {
      index: 0,
      column: 'normalized_record_id',
      data: dataSource,
    })
  }

  function shouldHaveRecordId(w, normalizedRecordId) {
    it('should calculate record id', () => {
      expect(w.vm.recordId).toBe(normalizedRecordId)
    })
  }

  function shouldReturnDetailUrl(w, normalized_record_id) {
    it('should return detail url', () => {
      expect(w.vm.detailUrl).toBeTruthy()
      expect(w.vm.detailUrl.name).toBe('backoffice-records-id')
      expect(w.vm.detailUrl.params.id).toBe(normalized_record_id)
    })
  }

  describe('when data is a record card object', () => {
    const description = 'TEST_DESC'
    const w = getComponent({
      id: 1,
      normalized_record_id: normalizedRecordId,
      description: description,
    })
    shouldHaveRecordId(w, normalizedRecordId)
    shouldReturnDetailUrl(w, normalizedRecordId)
    it('should have description', () => {
      expect(w.vm.description).toBe(description)
    })
  })
  describe('when data is a record card normalized record id', () => {
    const w = getComponent({
      normalized_record_id: normalizedRecordId,
    })
    shouldHaveRecordId(w, normalizedRecordId)
    shouldReturnDetailUrl(w, normalizedRecordId)
  })
})
