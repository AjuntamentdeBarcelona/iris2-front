import SelectTable from './SelectTable.vue'
import { getSelectTableStore } from './SelectTable.vue'
import SelectColumn from './columns/SelectColumn.vue'
import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

describe('SelectTable', () => {
  const comp = mount(SelectTable)
  it('should add SelectColumn column', () => {
    const columns = comp.vm.getPluginColumns()
    expect(columns.selectable).toBeTruthy()
  })
  it('should provide selectStore to its hierachy', () => {
    expect(comp.vm._provided.selectStore).toEqual(comp.vm.selectStore)
  })
  it('should update selection when store is updated', () => {
    const selection = { id: 1 }
    comp.vm.selectStore.commit('selected', [true, selection])
    expect(comp.vm.selected).toEqual([selection])
  })
})

describe('Select store', () => {
  describe('initial values', () => {
    const store = getSelectTableStore()
    it('should be created empty', () => {
      expect(store.state.selected).toEqual({})
    })
    it("it should use 'id' as default idAttr", () => {
      expect(store.state.idAttr).toEqual('id')
    })
  })
  describe('Row id config for track selections', () => {
    const store = getSelectTableStore()
    it('should track selection by idAttr', () => {
      const TEST_ID = 'testId'
      const ROW_ID = 100
      const OTHER_ID = 2
      store.commit('setId', TEST_ID)
      store.commit('selected', [true, { id: OTHER_ID, [TEST_ID]: 100 }])
      expect(store.state.idAttr).toBe(TEST_ID)
      expect(store.state.selected[ROW_ID]).toBeTruthy()
      expect(store.state.selected['id']).toBeFalsy()
    })
  })
  describe('Add and remove from selection', () => {
    const store = getSelectTableStore()
    it('should add selection', () => {
      store.commit('selected', [true, { id: 2 }])
      store.commit('selected', [true, { id: 3 }])
      expect(Object.values(store.state.selected).length).toBe(2)
    })
    it('should remove selection', () => {
      const ROW_ID = 200
      store.commit('selected', [true, { id: ROW_ID }])
      expect(store.state.selected[ROW_ID]).toBeTruthy()
      store.commit('selected', [false, { id: ROW_ID }])
      expect(store.state.selected[ROW_ID]).toBe(undefined)
    })
  })
})
