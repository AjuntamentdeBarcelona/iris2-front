import nuxtMount from '~/assets/js/nuxt/testUtils'
import RecordThemeLabel from './RecordThemeLabel.vue'

describe('RecordThemeLabel component', () => {
  const DESCRIPTION = 'TEST DESC'
  function getComponent(model) {
    return nuxtMount(RecordThemeLabel, {
      model: model,
    })
  }

  function shouldHaveDescription(w) {
    it('should have description', () => {
      expect(w.vm.label).toBe(DESCRIPTION)
    })
  }

  describe('If the record can perform the theme change action', () => {
    const w = getComponent({
      actions: {
        'theme-change': {
          can_perform: true,
        },
      },
      element_detail_id: {
        id: 200,
        description: DESCRIPTION,
      },
    })
    it('should compute can perform true', () => {
      expect(w.vm.canPerform).toBe(true)
    })
    shouldHaveDescription(w)
  })

  describe('The record has no theme change permission', () => {
    const w = getComponent({
      actions: {
        'theme-change': {
          can_perform: false,
        },
      },
      element_detail_id: {
        id: 200,
        description: DESCRIPTION,
      },
    })
    it('should compute can perform true', () => {
      expect(w.vm.canPerform).toBe(false)
    })
    it('should not render button', () => {
      expect(w.vm.$refs.button).toBeFalsy()
    })
    shouldHaveDescription(w)
  })
})
