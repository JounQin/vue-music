<template lang="pug">
  div(:class="$style.container")
    ol.list-unstyled
      li.media(v-for="({id, albumId, songName, singerName}, index) of songList",
      :class="{'border-t': index, [$style.active]: index === songIndex}",
      :key="id",
      @click="toggleMusic({index, play: true})")
        .media-left
          img.media-object(:src="`http://imgcache.qq.com/music/photo/album_300/${albumId % 100}/300_albumpic_${albumId}_0.jpg`")
        .media-body.media-middle {{ index + 1 }}.
          span(v-html="' ' + singerName")
          |  -
          span(v-html="' ' + songName")
        .media-right.media-middle(@click.stop="deleteSong(index)")
          span.iconfont.icon-delete
      li 没有更多歌曲了~
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'

  const fetchSongList = async ({route, store}) => store.dispatch('resetSongList', +!!route.params.all)

  export default {
    name: 'song-list',
    preFetch: fetchSongList,
    watch: {
      $route(route) {
        fetchSongList({
          route,
          store: this.$store
        })
      }
    },
    computed: {
      ...mapGetters(['songList', 'songIndex'])
    },
    methods: {
      ...mapActions(['deleteSong', 'toggleMusic'])
    }
  }
</script>
<style lang="stylus" module>
  .container
    li
      padding 0 10px

      &:last-child
        scaleSize($small-size)
        color $remark-color
        text-align center

    :global
      .media
        padding-top 10px
        padding-bottom 10px
        margin-top 0

      .media-object
        size 50px
        border-radius 5px

      .iconfont
        font-size 20px

  .active
    background-color $remark-color
    color $reverse-color
</style>
