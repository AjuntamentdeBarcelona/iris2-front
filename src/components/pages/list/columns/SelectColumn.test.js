import SelectColumn from './SelectColumn.vue'
import { getSelectTableStore } from '../SelectTable.vue'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('Select column', () => {
  const rowData = { id: 1 }
  const comp = shallowMount(SelectColumn, {
    propsData: {
      data: rowData,
      index: 1,
      column: 'test',
    },
    provide: {
      selectStore: getSelectTableStore(),
    },
  })
  it('should follow column interface', () => {
    expect(comp.vm.data).toBeTruthy()
    expect(comp.vm.index).toBeTruthy()
    expect(comp.vm.column).toBeTruthy()
  })
  it('should return data for selection', () => {
    expect(comp.vm.getSelectedRow(rowData)).toBeTruthy()
  })
  it('should have injected store', () => {
    expect(comp.vm.selectStore).toBeTruthy()
  })
  it('select changed will change store', () => {
    const spy = jest.spyOn(comp.vm.selectStore, 'commit')
    comp.vm.selectChanged()
    expect(spy).toHaveBeenCalledWith('selected', [
      comp.vm.selected,
      comp.vm.getSelectedRow(rowData),
    ])
  })
})
