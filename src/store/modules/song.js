import axios from 'axios'

import {generateGetters} from 'utils'

const RESET_SONG_LIST = 'RESET_SONG_LIST'
const INIT_AUDIO = 'INIT_AUDIO'
const TOGGLE_PLAY = 'TOGGLE_PLAY'
const DELETE_SONG = 'DELETE_SONG'
const TOGGLE_SONG = 'TOGGLE_SONG'
const DURATION_CHANGE = 'DURATION_CHANGE'
const TIME_UPDATE = 'TIME_UPDATE'

const state = {
  audio: null,
  playing: false,
  currentTime: 0,
  songSrc: null,
  singerName: null,
  songName: null,
  songImg: null,
  songIndex: 0,
  songDuration: 0,
  songList: [],
  songs: []
}

const getters = generateGetters(Object.keys(state))

const actions = {
  async resetSongList({commit, state}, index) {
    const {songs} = state

    let cache = songs[index]

    if (!cache) {
      console.log('no-cache')
      cache = songs[index] = (await axios.get(`/${index ? 'all' : 'new'}-songs`)).data
    }

    commit(RESET_SONG_LIST, cache)
    commit(TOGGLE_SONG, 0)
  },
  initAudio({commit}, audio) {
    commit(INIT_AUDIO, audio)
  },
  togglePlay({commit}, force) {
    commit(TOGGLE_PLAY, force)
  },
  deleteMusic({commit}, index) {
    commit(DELETE_SONG, index)
  },
  toggleMusic({commit}, {index, play}) {
    state.songIndex === index || commit(TOGGLE_SONG, index)
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
    const musicLength = state.songList.length
    const songIndex = state.songIndex + 1
    dispatch('toggleMusic', {
      index: songIndex < musicLength ? songIndex : 0,
      play: true
    })
  }
}

const mutations = {
  [RESET_SONG_LIST](state, songList) {
    state.songList = (songList || [])
  },
  [INIT_AUDIO](state, audio) {
    state.audio = audio
  },
  [TOGGLE_PLAY](state, force) {
    if (!state.songSrc) return
    state.audio[(state.playing = force || !state.playing) ? 'play' : 'pause']()
  },
  [DELETE_SONG](state, index) {
    state.songList.splice(index, 1)
  },
  [TOGGLE_SONG](state, index) {
    const song = state.songList[index]
    song && Object.assign(state, {
      currentTime: 0,
      songSrc: `http://ws.stream.qqmusic.qq.com/${song.id}.m4a?fromtag=46`,
      singerName: song.singerName,
      songName: song.songName,
      songImg: `http://imgcache.qq.com/music/photo/album_300/${song.albumId % 100}/300_albumpic_${song.albumId}_0.jpg`,
      songIndex: index,
      songDuration: 0,
      playing: false
    })
  },
  [DURATION_CHANGE](state) {
    state.songDuration = state.audio.duration
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
