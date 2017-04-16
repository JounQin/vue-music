import Router from 'koa-router'
import vm from 'vm'
import axios from 'axios'
import encoding from 'encoding'
import musicAPI from 'music-api'

const router = new Router({
  prefix: '/api'
})

const parseJsonp = data => vm.runInNewContext(`const JsonCallback = v => v; ${encoding.convert(data, 'utf8', 'gbk')}`)

export default app => {
  router.get('/:type(all|new)-songs', async ctx => {
    const url = `https://music.qq.com/musicbox/shop/v3/data/hit/hit_${ctx.url.includes('all') ? 'all' : 'newsong'}.js`
    ctx.body = parseJsonp((await axios.get(url, {
      responseType: 'arraybuffer'
    })).data).songlist
  })

  router.get('/search-keyword', async ctx => {
    ctx.body = (await musicAPI.searchSong('netease', {
      key: ctx.query.key
    })).songList.map(({id, name: songName, album: {coverBig: albumImg}, artists}) => ({
      id,
      albumImg,
      singerName: artists[0].name,
      songName,
      wait: true
    }))
  })

  router.get('/get-song-src', async ctx => {
    ctx.body = (await musicAPI.getSong('netease', {
      id: ctx.query.id
    })).url
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
