import vm from 'vm'
import axios from 'axios'
import encoding from 'encoding'
import musicAPI from 'music-api'
import Router from 'koa-router'

const ONE_DAY = 24 * 60 * 60 * 1000

const parseJsonp = data => vm.runInNewContext(`const JsonCallback = v => v; ${encoding.convert(data, 'utf8', 'gbk')}`)

let cache = {}

setInterval(() => (cache = {}), ONE_DAY)

const router = new Router({prefix: '/api'})
  .get('/:type(all|new)-songs', async ctx => {
    const key = ctx.url.includes('all') ? 'all' : 'newsong'

    let result = cache[key]

    if (!result) {
      const url = `https://music.qq.com/musicbox/shop/v3/data/hit/hit_${key}.js`
      result = cache[key] = parseJsonp((await axios.get(url, {responseType: 'arraybuffer'})).data).songlist
    }

    ctx.body = result
  })
  .get('/search-keyword', async ctx => {
    ctx.body = (await musicAPI.searchSong('netease', {key: ctx.query.key})).songList
      .map(({id, name: songName, album: {coverBig: albumImg}, artists}) => ({
        id,
        albumImg,
        singerName: artists[0].name,
        songName,
        wait: true
      }))
  })
  .get('/get-song-src', async ctx => {
    ctx.body = (await musicAPI.getSong('netease', {id: ctx.query.id})).url
  })

export default app => {
  app.use(router.routes())
  app.use(router.allowedMethods())
}
