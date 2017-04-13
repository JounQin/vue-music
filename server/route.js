import vm from 'vm'
import axios from 'axios'
import encoding from 'encoding'

const parseJsonp = data => vm.runInNewContext(`const JsonCallback = v => v; ${encoding.convert(data, 'utf8', 'gbk')}`)

export default router => {
  router.get('/new-songs', async ctx => {
    ctx.body = parseJsonp((await axios.get('https://music.qq.com/musicbox/shop/v3/data/hit/hit_newsong.js', {
      responseType: 'arraybuffer'
    })).data).songlist
  })
}
