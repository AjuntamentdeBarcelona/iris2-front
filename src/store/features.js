import { getMasks } from '~/assets/js/iris2/model/Masks.js'
import { loadMaster } from './masters.js'

export const state = () => ({
  maskList: [],
  masks: getMasks(),
})

export const mutations = {
  /**
   * Assigns the mask list and combine them with the default masks.
   * Currently it only accepts the kwown masks defined at the getMasks function.
   * @todo generalize the regexp, error and description fields to server.
   */
  setMasks: (state, maskList) => {
    const defaultMasks = getMasks()
    const masks = Object.assign.apply(
      {},
      maskList.filter(defaultMasks[mask.id] != null).map(mask => {
        return { [mask.id]: Object.assign(defaultMasks[mask.id], mask) }
      })
    )
    state.masks = masks
    state.maskList = maskList
  },
}

export const actions = {
  async retrieveMasks({ commit, state }) {
    loadMaster(
      this,
      commit,
      state,
      'maskList',
      'loadProcesses',
      '/api/features/masks/'
    )
  },
}
