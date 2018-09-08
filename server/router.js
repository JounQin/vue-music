import musicAPI from 'music-api'
import Router from 'koa-router'

const ONE_DAY = 24 * 60 * 60 * 1000

let cache = {}

setInterval(() => (cache = {}), ONE_DAY)

const router = new Router({ prefix: '/api' })
  .get('/:type(all|new)-songs', async ctx => {
    const key = ctx.url.includes('all') ? 'all' : 'newsong'

    let result = cache[key]

    if (!result) {
      result = (await musicAPI.searchSong('netease', {
        key: '林俊杰',
      })).songList.map(
        ({ id, name: songName, album: { coverBig: albumImg }, artists }) => ({
          id,
          albumImg,
          singerName: artists[0].name,
          songName,
          wait: true,
        }),
      )
    }

    ctx.body = result
  })
  .get('/search-keyword', async ctx => {
    ctx.body = (await musicAPI.searchSong('netease', {
      key: ctx.query.key,
    })).songList.map(
      ({ id, name: songName, album: { coverBig: albumImg }, artists }) => ({
        id,
        albumImg,
        singerName: artists[0].name,
        songName,
        wait: true,
      }),
    )
  })
  .get('/get-song-src', async ctx => {
    ctx.body = (await musicAPI.getSong('netease', { id: ctx.query.id })).url
  })

export default app => app.use(router.routes()).use(router.allowedMethods())
