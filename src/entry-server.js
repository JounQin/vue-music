import axios from 'axios'

import {app, router, store} from './app'

export default context => {
  const start = __DEV__ && Date.now()

  return new Promise((resolve, reject) => {
    router.push(context.url)

    router.onReady(async () => {
      try {
        await Promise.all(router.getMatchedComponents()
          .map(({asyncData}) => asyncData && asyncData({
            axios,
            route: router.currentRoute,
            store
          })))
      } catch (e) {
        return reject(e)
      }

      __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
      context.state = store.state
      resolve(app)
    }, reject)
  })
}
