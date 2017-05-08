import {leftPad} from 'utils'

import createApp from './app'

export default context => new Promise((resolve, reject) => {
  const start = __DEV__ && Date.now()

  const {app, router, store} = createApp()

  router.push(context.url)

  router.onReady(async () => {
    await Promise.all(router.getMatchedComponents().map(({asyncData}) => asyncData && asyncData({
      store,
      route: router.currentRoute
    })))

    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)

    await store.dispatch('toggleTheme', {
      context,
      theme: Math.random() < 0.5 ? ['blue', 'green', 'purple', 'red'][~~(Math.random() * 4)]
        : '#' + leftPad((~~(Math.random() * 0xffffff)).toString(16), 6, 0)
    })

    context.state = store.state

    resolve(app)
  }, reject)
})
