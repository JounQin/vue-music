<template lang="pug">
  #app
    hi-loading(v-if="progress")
    hi-progress(:progress="progress")
    .shadow-bottom.theme-bg(:class="$style.header")
      .text-center QQ音乐
        router-link.iconfont.icon-search(tag="span", to="/discover")
    .theme-bg(:class="$style.menus")
      ul.list-unstyled
        router-link(v-for="(name, path, index) of {'': '新歌榜', all: '总榜', discover: '发现'}",
        tag="li", :to="'/' + path", :key="index", replace, exact) {{ name }}
      div(:class="$style.border", :style="{left: 100 / 3 * activeIndex + '%'}")
    .scroll(:class="$style.content")
      transition(name="slide-fade")
        keep-alive
          router-view
    .theme-bg(v-if="showFooter", :class="$style.footer")
      .media
        .media-left
          img.media-object.img-circle(:src="albumImg", :class="{rotating: playing}")
        .media-body
          .media-heading
            h5.text-center {{ songIndex + 1 }}.
              span(v-html="' ' + singerName")
              |  -
              span(v-html="' ' + songName")
            .media
              .media
                .media-left {{ ~~currentTime | formatSeconds}}
                .media-body.media-middle
                  div(:class="$style.progress", @click="changeTime")
                    div(:style="{width: currentTime * 100 / songDuration + '%'}")
                .media-right {{ ~~songDuration | formatSeconds}}
        .media-right.media-middle
          button.theme-bg(:class="[$style.playAction, {[$style.active]: playing}]", @click="togglePlay()")
    audio(:src="songSrc", ref="audio",
    @durationchange="durationChange",
    @timeupdate="timeUpdate",
    @ended="playEnded")
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'

  import {formatSeconds, toNum} from 'utils'

  import HiLoading from 'HiLoading'
  import HiProgress from 'HiProgress'

  export default {
    name: 'app',
    filters: {
      formatSeconds
    },
    data() {
      return {
        activeIndex: 0
      }
    },
    computed: {
      ...mapGetters(['audio', 'playing', 'progress', 'singerName', 'songSrc',
        'songName', 'albumImg', 'songIndex', 'songDuration', 'currentTime', 'showFooter'])
    },
    watch: {
      $route(route) {
        this.activeIndex = ['', 'all', 'discover'].indexOf(route.fullPath.match(/^\/(all|discover)?/)[1] || '')
      }
    },
    created() {
      this.toggleSong({index: 0})
    },
    mounted() {
      this.initAudio(this.$refs.audio)
    },
    methods: {
      ...mapActions(['initAudio', 'durationChange', 'timeUpdate', 'togglePlay', 'playEnded', 'toggleSong']),
      changeTime(e) {
        const {target} = e
        const offsetX = e.clientX - target.offsetLeft
        this.timeUpdate(offsetX / toNum(getComputedStyle(target).width) * this.songDuration)
      }
    },
    components: {
      HiLoading,
      HiProgress
    }
  }
</script>
<style lang="stylus" module>
  .header, .menus
    flex 1
    display flex
    padding 10px
    align-items center
    justify-content center

  .header > div
    relative()
    flex 1

    span
      absolute(right)

  .menus
    relative()

    ul
      display flex
      width 100%
      margin-bottom 0

    li
      flex 1
      text-align center

  .border
    absolute(left, bottom)
    width (100 / 3) %
    height 1px
    background-color $back-light-color
    transition left .3s

  .footer
    flex 2

    > :global(.media .media-right)
      padding-right 10px

    :global(.media-object)
      size 70px

  .progress
    relative()
    width 100%
    height 5px
    border-radius 5px
    background-color alpha($back-light-color, .5)

    > div
      absolute()
      height 100%
      border-top-left-radius 5px
      border-bottom-left-radius 5px
      background-color $theme-green-darker
      pointer-events none

      &:before
        absolute(right)
        content ''
        height 100%
        width 2px
        transform translate3d(100%, 0, 0)
        background-color $back-light-color

  .play-action
    relative()
    borderRadius($reverse-color, 50px, 50px)
    size 40px
    outline 0

    &:after
      middleCenter(, scaleX(sqrt(3)))
      content ''
      border 8px solid transparent
      border-left-color $reverse-color
      border-right 0

    &.active:after
      middleCenter()
      content '| |'
      border 0
      line-height clearUnit($primary-size / $common-size)

  .header, .menus, .footer
    color $reverse-color

  .content
    relative()
    flex 20
</style>
