import vm from 'vm'
import axios from 'axios'
import encoding from 'encoding'

let proxy

try {
  proxy = require('./proxy').default
} catch (e) {}

const parseJsonp = data => vm.runInNewContext(`const JsonCallback = v => v; ${encoding.convert(data, 'utf8', 'gbk')}`)

export default router => {
  router.get('/:type(all|new)-songs', async ctx => {
    const url = `http://music.qq.com/musicbox/shop/v3/data/hit/hit_${ctx.url.includes('all') ? 'all' : 'newsong'}.js`
    ctx.body = parseJsonp((await axios.get(url, {
      responseType: 'arraybuffer',
      proxy
    })).data).songlist
  })
}