import axios from 'axios'

import {app, router, store} from './app'

export default context => {
  const start = __DEV__ && Date.now()

  return new Promise((resolve, reject) => {
    router.push(context.url)

    router.onReady(async () => {
      const matched = router.getMatchedComponents()

      if(!matched.length) return reject(new Error({status: 404}))

      await Promise.all(matched.map(({asyncData}) => asyncData && asyncData({
        axios,
        route: router.currentRoute,
        store
      })))

      __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
      context.state = store.state
      resolve(app)
    }, reject)
  })
}
