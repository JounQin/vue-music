import _debug from 'debug'
import koaWebpack from 'koa-webpack'
import MFS from 'memory-fs'
import webpack from 'webpack'

import { resolve } from '../build/config'

import clientConfig from '../build/vue-client.babel'
import serverConfig from '../build/vue-server.babel'

const debug = _debug('hi:server:dev')

export default after => {
  let _resolve
  let clientManifest
  let bundle
  let fs

  // eslint-disable-next-line promise/param-names
  const readyPromise = new Promise(r => {
    _resolve = r
  })

  const ready = (...args) => {
    _resolve()
    after(...args)
  }

  const clientCompiler = webpack(clientConfig)

  const webpackMiddlewarePromise = koaWebpack({
    compiler: clientCompiler,
  })

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(debug)
    stats.warnings.forEach(debug)

    if (stats.errors.length) {
      return
    }

    webpackMiddlewarePromise.then(webpackMiddleware => {
      fs = webpackMiddleware.devMiddleware.fileSystem
      clientManifest = JSON.parse(
        fs.readFileSync(resolve('dist/vue-ssr-client-manifest.json')),
      )

      if (bundle) {
        ready({ bundle, clientManifest, fs })
      }
    })
  })

  const mfs = new MFS()
  const serverCompiler = webpack(serverConfig)
  serverCompiler.outputFileSystem = mfs

  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err
    }

    stats = stats.toJson()

    if (stats.errors.length) {
      return
    }

    bundle = JSON.parse(
      mfs.readFileSync(resolve('dist/vue-ssr-server-bundle.json')),
    )

    if (clientManifest) {
      ready({ bundle, clientManifest, fs })
    }
  })

  return { readyPromise, webpackMiddlewarePromise }
}
