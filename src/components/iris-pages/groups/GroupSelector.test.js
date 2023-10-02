import {
  fakeGroup,
  fakeGroups,
  getGroupAxiosMock,
  getGroupStore,
} from '~/store/groups.test.js'
import nuxtShallowMount from '~/assets/js/nuxt/testUtils.js'
import GroupSelect from './GroupSelector.vue'
import Vue from 'vue'

describe('Group selector', () => {
  const axiosMock = getGroupAxiosMock()
  const groupStore = getGroupStore()
  function mount(extraProps) {
    return nuxtShallowMount(GroupSelect, extraProps, {
      $axios: axiosMock.axiosInstance,
      $store: groupStore,
    })
  }

  describe('Component without loaded groups', () => {
    const comp = mount()
    it('should work without errors', () => {
      expect(comp.vm.selected).toBe(null)
    })
  })

  describe('Non anonymous group', () => {
    beforeEach(() => {
      groupStore.dispatch('groups/loadGroups')
    })
    const comp = mount()
    it('should map groups', () => {
      expect(comp.vm.groups).toEqual(fakeGroups.groups)
      expect(comp.vm.selected).toEqual(fakeGroup)
    })

    it('should have work as group method mapped from store', () => {
      expect(comp.vm.workAsGroup).toBeTruthy()
    })

    it('should work with selected', () => {
      expect(comp.vm.selected.description).toBeTruthy()
      expect(comp.vm.selected.profile_ctrl_user_id).toBeTruthy()
    })

    it('should allow to select another group different than selected', () => {
      expect(comp.vm.selectableGroups.length).toBeTruthy()
      // Check if selected is in the list
      expect(
        comp.vm.selectableGroups.filter(
          group =>
            group.profile_ctrl_user_id == comp.vm.selected.profile_ctrl_user_id
        ).length
      ).toBe(0)
    })

    it('should not be anonymous group', () => {
      expect(comp.vm.isAnonymous).toBe(false)
    })
  })
})
