<template lang="pug">
  #app
    hi-loading(v-if="progress")
    hi-progress(:progress="progress")
    .theme-bg(:class="$style.header")
      .text-center QQ音乐
        .pull-right 搜索
    ul.list-unstyled.theme-bg(:class="$style.menus")
      li 我的
      li 发现
      li 一个
    div(:class="$style.content")
    .theme-bg(:class="$style.footer")
    transition(name="slide-fade")
      keep-alive
        router-view
</template>
<script>
  import {mapGetters} from 'vuex'

  import HiLoading from 'HiLoading'
  import HiProgress from 'HiProgress'

  export default {
    name: 'app',
    computed: {
      ...mapGetters(['progress'])
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
    flex 1

  .menus
    margin-bottom 0

  .footer
    flex 2

  .header, .menus, .footer
    color $reverse-color

  .menus
    > li
      flex 1
      text-align center

  .content
    flex 20
</style>
