<template lang="pug">
  #app
    hi-loading(v-if="progress")
    hi-progress(:progress="progress")
    .theme-bg(:class="$style.header")
      .text-center QQ音乐
        span 搜索
    ul.list-unstyled.theme-bg(:class="$style.menus")
      li 我的
      li 发现
    .scroll(:class="$style.content")
      transition(name="slide-fade")
        keep-alive
          router-view
    .theme-bg(:class="$style.footer")
      .media
        .media-left
          img.media-object.img-circle(:src="musicImg")
        .media-body
          .media-heading
            h5.text-center {{ musicName || '暂无选择任何音乐' }}
            .media
              .media
                .media-left {{ ~~currentTime | formatSeconds}}
                .media-body.media-middle
                  div(:class="$style.progress", @click="changeTime")
                    div(:style="{width: currentTime * 100 / musicDuration + '%'}")
                .media-right {{ ~~musicDuration | formatSeconds}}
        .media-right.media-middle
          button.theme-bg(:class="[$style.playAction, {[$style.active]: playing}]", @click="togglePlay()")
    audio(:src="musicSrc", ref="audio",
    @canplay="togglePlay(true)",
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
    computed: {
      ...mapGetters(['audio', 'playing', 'progress', 'musicSrc', 'musicName', 'musicImg', 'musicDuration', 'currentTime'])
    },
    mounted() {
      this.initAudio(this.$refs.audio)
    },
    methods: {
      ...mapActions(['initAudio', 'durationChange', 'timeUpdate', 'togglePlay', 'playEnded']),
      changeTime(e) {
        const {target} = e
        const offsetX = e.clientX - target.offsetLeft
        this.timeUpdate(offsetX / toNum(getComputedStyle(target).width) * this.musicDuration)
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
    padding 10px
    display flex
    align-items center
    justify-content center

  .header > div
    relative()
    flex 1

    span
      absolute(right)

  .menus
    margin-bottom 0

  .menus
    > li
      flex 1
      text-align center

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
    flex 20
</style>
