<template lang="pug">
  div(:class="$style.container")
    ol.list-unstyled
      li.media(v-for="({name, singer, src, img}, index) of musicList",
      :class="{'border-t': index, [$style.active]: index === musicIndex}",
      @click="toggleMusic({index, play: true})")
        .media-left
          img.media-object(:src="img")
        .media-body.media-middle {{ index + 1 }}.
          span(v-html="' ' + singer")
          |  -
          span(v-html="' ' + name")
        .media-right.media-middle(@click.stop="deleteMusic(index)")
          span.iconfont.icon-delete
      li 没有更多歌曲了~
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'

  const fetchMusicList = async ({axios, route, store}) => {
    const {data} = await axios.get(`/${route.params.all ? 'all' : 'new'}-songs`)
    store.dispatch('resetMusicList', data)
  }

  export default {
    name: 'song-list',
    preFetch: fetchMusicList,
    watch: {
      $route(route) {
        fetchMusicList({
          axios: this.$http,
          route,
          store: this.$store
        })
      }
    },
    computed: {
      ...mapGetters(['musicList', 'musicIndex'])
    },
    methods: {
      ...mapActions(['deleteMusic', 'toggleMusic'])
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
