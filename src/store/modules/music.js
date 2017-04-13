import {generateGetters} from 'utils'

const RESET_MUSIC_LIST = 'RESET_MUSIC_LIST'
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
  musicSinger: null,
  musicName: null,
  musicImg: null,
  musicIndex: 0,
  musicDuration: 0,
  musicList: []
}

const getters = generateGetters(Object.keys(state))

const actions = {
  resetMusicList({commit}, musicList) {
    commit(RESET_MUSIC_LIST, musicList)
    commit(TOGGLE_MUSIC, 0)
  },
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
  playEnded({dispatch, state}) {
    const musicLength = state.musicList.length
    const musicIndex = state.musicIndex + 1
    dispatch('toggleMusic', {
      index: musicIndex < musicLength ? musicIndex : 0,
      play: true
    })
  }
}

const mutations = {
  [RESET_MUSIC_LIST](state, musicList) {
    state.musicList = (musicList || [])
      .map(({id, albumId, singerName, songName}) => ({
        src: `http://ws.stream.qqmusic.qq.com/${id}.m4a?fromtag=46`,
        singer: singerName,
        name: songName,
        img: `http://imgcache.qq.com/music/photo/album_300/${albumId % 100}/300_albumpic_${albumId}_0.jpg`
      }))
  },
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
    music && Object.assign(state, {
      currentTime: 0,
      musicSrc: music.src,
      musicSinger: music.singer,
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
