import DetailEditForm from './DetailEditForm.vue'
import Vue from 'vue'

import MockAdapter from 'axios-mock-adapter'
import nuxtShallowMount from '~/assets/js/nuxt/testUtils.js'
import { getGroupStore } from '~/store/groups.test.js'

describe('Detail configuration form page', () => {
  const wrapper = nuxtShallowMount(
    DetailEditForm,
    {},
    { $store: getGroupStore() }
  )

  describe('Form Specification', () => {
    it('should be form schema', () => {
      expect(wrapper.vm.schemaDef).toBeTruthy()
    })
  })

  describe('Buttons', () => {
    it('should have only exit and save buttons', () => {
      expect(
        wrapper.vm.actionButtons.filter(
          btn =>
            btn.name != 'save' &&
            btn.name != 'exit' &&
            btn.name != 'save_and_stay'
        ).length
      ).toBe(0)
    })
  })
})
