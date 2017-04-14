<template lang="pug">
  main
    .shadow-bottom(:class="$style.header")
      form(@submit.prevent="search()")
        .input-group
          span.input-group-addon
            span.iconfont.icon-search
          input.form-control(v-model="keyword", placeholder="搜索歌曲", @focus="active = true")
          span.input-group-addon(v-if="active", @click="cancelSearch") 取消
    div(v-if="searched",:class="$style.searched")
      ol.list-unstyled
        li.media.border-b(v-for="({id, albumId, albumImg, songName, singerName}, index) of songList",
        :class="{[$style.active]: index === songIndex}",
        :key="id",
        @click="getSongSrc(id, index)")
          .media-left
            img.media-object(:src="albumImg")
          .media-body.media-middle
            span(v-text="' ' + singerName")
            |  -
            span(v-text="' ' + songName")
      div(:class="$style.noMore") 没有更多歌曲了~
    div(v-else, :class="$style.hotKeywords")
      h5 热门搜索
      ul.list-unstyled
        li(v-for="keyword of hotKeywords")
          button.btn(@click="search(keyword)") {{ keyword }}
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'

  const KEY_WORDS = ['歌手', '张杰', '赵雷', '李健', '林志炫', '张碧晨', '梁博',
    '周笔畅', '张靓颖', '陈奕迅', '周杰伦', '王力宏', 'TFBoys', '李玉刚', '魏晨', '薛之谦']

  export default {
    name: 'discover',
    data() {
      const hotKeywords = []
      while (hotKeywords.length < 6) {
        hotKeywords.push(KEY_WORDS.splice(~~(Math.random() * KEY_WORDS.length), 1)[0])
      }
      return {
        active: false,
        hotKeywords,
        keyword: null,
        searched: false
      }
    },
    computed: {
      ...mapGetters(['showFooter', 'songList', 'songIndex'])
    },
    beforeRouteLeave(to, from, next) {
      this.searched = false
      this.toggleFooter(true)
      next()
    },
    methods: {
      ...mapActions(['restSongList', 'toggleSong', 'toggleFooter', 'setSongSrc']),
      async search(keyword) {
        const key = this.keyword = keyword || this.keyword

        if (!key) return

        this.active = true
        this.searched = true

        const {data} = await this.$http.get(`/search-keyword`, {params: {key}})
        this.restSongList(data)
        this.toggleFooter(false)
      },
      cancelSearch() {
        this.searched = false
        this.active = false
      },
      async getSongSrc(id, index) {
        const song = this.songList[index]

        if (!song.songSrc) {
          this.setSongSrc(song.songSrc = (await this.$http.get('/get-song-src', {params: {id}})).data)
        }

        this.toggleSong({index, play: true})
        this.toggleFooter(true)
      }
    }
  }
</script>
<style lang="stylus" module>
  .searched
    li
      padding 0 10px

    :global
      .media
        padding-top 10px
        padding-bottom 10px
        margin-top 0

      .media-object
        size 50px
        border-radius 5px

  .no-more
    scaleSize($small-size)
    color $remark-color
    text-align center
    margin-bottom 10px

  .header
    padding 20px
    background-color $bg-color

  .hot-keywords
    padding 0 10px

    li
      display inline-block
      width (100 / 3) %
      text-align center
      padding 0 10px 10px

      &:first-child button
        color $highlight-color
        border-color $highlight-color

      button
        width 100%
        border 1px solid $border-color
        bbColor(, $border-color, $back-light-color)
        bbActive(, $morning-color, $back-light-color)
</style>
