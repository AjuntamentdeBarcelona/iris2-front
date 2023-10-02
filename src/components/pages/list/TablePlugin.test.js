import TablePlugin from './TablePlugin.vue'
import { mount } from '@vue/test-utils'

describe('Table plugin', () => {
  const COLUMN = 'a'
  const pluginColumns = {
    [COLUMN]: COLUMN,
  }
  describe('Column providing', () => {
    const comp = mount(TablePlugin, {
      provide: {
        pluginColumns: pluginColumns,
      },
    })
    it('should inject provided columns', () => {
      expect(comp.vm.pluginColumns).toBe(pluginColumns)
    })
    it('should provide injected columns', () => {
      expect(comp.vm._provided.pluginColumns).toBe(pluginColumns)
    })
    it('getPluginColumns should return empty columns', () => {
      expect(comp.vm.getPluginColumns()).toEqual({})
    })
  })

  describe('Chain column injection with its own columns', () => {
    const OWN_COLUMN = 'b'
    const extraColumns = { [OWN_COLUMN]: OWN_COLUMN }
    const DummyComponent = {
      name: 'Dummy',
      extends: TablePlugin,
      methods: {
        getPluginColumns() {
          return extraColumns
        },
      },
    }
    const comp = mount(DummyComponent, {
      provide: {
        pluginColumns: pluginColumns,
      },
    })

    it('own columns will be chained with parent provided columns', () => {
      expect(comp.vm._provided.pluginColumns).toEqual({
        ...pluginColumns,
        ...extraColumns,
      })
    })
  })
})
