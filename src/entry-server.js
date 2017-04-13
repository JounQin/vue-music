import axios from 'axios'

import {app, router, store} from './app'

export default (context) => {
  const start = __DEV__ && Date.now()

  return new Promise((resolve, reject) => {
    router.push(context.url)

    router.onReady(() => {
      Promise.all(router.getMatchedComponents()
        .map(component => component.preFetch && component.preFetch({
          axios,
          router,
          route: router.currentRoute,
          store
        }))).then(() => {
          __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
          context.state = store.state
          resolve(app)
        }).catch(reject)
    })
  })
}
