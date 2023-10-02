export const state = () => ({
  collapse: localStorage.getItem('navigation_collapsed') == '1',
})

export const mutations = {
  setCollapsed: (state, collapsed) => {
    state.collapse = collapsed
    localStorage.setItem('navigation_collapsed', collapsed ? '1' : '0')
  },
}

export const actions = {}
