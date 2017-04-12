import {generateGetters} from 'utils'

const INIT_AUDIO = 'INIT_AUDIO'
const TOGGLE_PLAY = 'TOGGLE_PLAY'
const DELETE_MUSIC = 'DELETE_MUSIC'
const TOGGLE_MUSIC = 'TOGGLE_MUSIC'
const DURATION_CHANGE = 'DURATION_CHANGE'
const TIME_UPDATE = 'TIME_UPDATE'

const state = {
  audio: null,
  playing: false,
  currentTime: 0,
  musicSrc: null,
  musicName: null,
  musicImg: null,
  musicIndex: 0,
  musicDuration: 0,
  musicList: [
    {
      name: '李玉刚 - 刚好遇见你',
      src: 'http://m2.music.126.net/qv3RI4K7ABKJ0TyAdb3taw==/3250156397064860.mp3',
      img: 'http://p4.music.126.net/lDyytkTaPYVTb1Vpide6AA==/18591642115187138.jpg'
    },
    {
      name: '以冬 - 我的一个道姑朋友',
      src: 'http://m2.music.126.net/7WiRhPdirEJ2axW9Xm6uJQ==/1415071481819545.mp3',
      img: 'http://omratag7g.bkt.clouddn.com/%E6%B0%91%E8%B0%A3.jpg'
    },
    {
      name: '任素汐 - 我要你',
      src: 'http://m2.music.126.net/WhBIiLKYNa84TF3p5xx2FQ==/3265549607332004.mp3',
      img: 'http://omratag7g.bkt.clouddn.com/%E6%88%91%E8%A6%81%E4%BD%A0.jpg'
    },
    {
      name: '赵雷 - 成都',
      src: 'http://m2.music.126.net/7o5D4dA6271VktgawcbZFA==/18665309393829604.mp3',
      img: 'http://p4.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg'
    },
    {
      name: '韩安旭 - 多幸运',
      src: 'http://m2.music.126.net/N_2fJbqpi8QDnV1YJPCsuw==/3424978721721344.mp3',
      img: 'http://p3.music.126.net/U9RoJy0AUsoYuaKjmJbAzQ==/3386495814257685.jpg'
    },
    {
      name: '李健 - 假如爱有天意',
      src: 'http://m2.music.126.net/sOdeUJ8DrQJpbJjjVogKuw==/7957165651997665.mp3',
      img: 'http://omratag7g.bkt.clouddn.com/%E6%9D%8E%E5%81%A5.jpg'
    },
    {
      name: '七月上',
      src: 'http://m2.music.126.net/K1SFXCvWf8BO9VEpSvx2ew==/7967061257205150.mp3',
      img: 'http://p3.music.126.net/9kZl6NRj3HxmQQ8DqTjZ4Q==/17729624997966923.jpg'
    },
    {
      name: '咱们屯里人(粤语版)',
      src: 'http://m2.music.126.net/XbGWv4O15b0c1-w4pCtwgA==/3300733908037356.mp3',
      img: 'http://omratag7g.bkt.clouddn.com/%E5%A4%8F%E6%B4%9B%E7%89%B9%E7%83%A6%E6%81%BC.jpg'
    }
  ]
}

const getters = generateGetters(Object.keys(state))

const actions = {
  initAudio({commit}, audio) {
    commit(INIT_AUDIO, audio)
  },
  togglePlay({commit}, force) {
    commit(TOGGLE_PLAY, force)
  },
  deleteMusic({commit}, index) {
    commit(DELETE_MUSIC, index)
  },
  toggleMusic({commit}, {index, play}) {
    commit(TOGGLE_MUSIC, index)
    play && setTimeout(() => commit(TOGGLE_PLAY, true), 0)
  },
  durationChange({commit}) {
    commit(DURATION_CHANGE)
  },
  timeUpdate({commit}, currentTime) {
    isNaN(currentTime) || (state.audio.currentTime = currentTime)
    commit(TIME_UPDATE)
  },
  playEnded({commit, state}) {
    const musicLength = state.musicList.length
    const musicIndex = state.musicIndex + 1
    commit(TOGGLE_MUSIC, musicIndex < musicLength ? musicIndex : 0)
  }
}

const mutations = {
  [INIT_AUDIO](state, audio) {
    state.audio = audio
  },
  [TOGGLE_PLAY](state, force) {
    if (!state.musicSrc) return
    state.audio[(state.playing = force || !state.playing) ? 'play' : 'pause']()
  },
  [DELETE_MUSIC](state, index) {
    state.musicList.splice(index, 1)
  },
  [TOGGLE_MUSIC](state, index) {
    const music = state.musicList[index]
    Object.assign(state, {
      currentTime: 0,
      musicSrc: music.src,
      musicName: music.name,
      musicImg: music.img,
      musicIndex: index,
      musicDuration: 0
    })
  },
  [DURATION_CHANGE](state) {
    state.musicDuration = state.audio.duration
  },
  [TIME_UPDATE](state) {
    state.currentTime = state.audio.currentTime
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}