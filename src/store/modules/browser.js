import {generateGetters} from 'utils'

const TOGGLE_THEME = 'TOGGLE_THEME'
const SET_SIZE = 'SET_SIZE'

export default () => {
  const state = {
    baseWidth: 375,
    baseFontSize: 16,
    dpi: 1,
    winHeight: 667,
    winWidth: 375,
    appWidth: 375,
    rem: 1,
    fontSize: 16,
    logicWidth: 375,
    threshold: 768,
    mode: true,
    theme: null
  }

  const getters = generateGetters(Object.keys(state))

  const actions = {
    async toggleTheme({commit}, payload) {
      commit(TOGGLE_THEME, payload.theme)
      ;(await import('plugins/theme')).default(payload)
    },
    setSize({commit}, {winHeight, winWidth}) {
      const size = {winHeight, winWidth}
      const baseWidth = state.baseWidth
      size.dpi = window.devicePixelRatio
      const mode = size.mode = winWidth < state.threshold
      let logicWidth
      size.rem = (logicWidth = size.logicWidth =
          mode ? winWidth : baseWidth) / baseWidth
      size.fontSize = logicWidth * state.baseFontSize / baseWidth
      size.appWidth = Math.min(1024, winWidth)
      commit(SET_SIZE, size)
    }
  }

  const mutations = {
    [TOGGLE_THEME](state, theme) {
      state.theme = theme
    },
    [SET_SIZE](state, size) {
      Object.assign(state, size)
    }
  }

  return {
    state,
    getters,
    actions,
    mutations
  }
}
