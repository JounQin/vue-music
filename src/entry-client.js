import {app, router, store} from './app'
import {on} from 'utils'
import {throttle} from 'lodash'

window.__INITIAL_STATE__ && store.replaceState(window.__INITIAL_STATE__)

if (__DEV__) require('vconsole')

const {documentElement: docEl} = document

const resize = () => {
  store.dispatch('setSize', {winHeight: docEl.clientHeight, winWidth: docEl.clientWidth})
  docEl.style.fontSize = store.getters.fontSize + 'px'
}

on(window, 'resize', throttle(resize, 300))

resize()

router.onReady(() => {
  router.beforeResolve(async (to, from, next) => {
    const prevMatched = router.getMatchedComponents(from)
    const matched = router.getMatchedComponents(to)

    let diffed = false

    const activated = matched.filter((comp, index) => diffed || (diffed = (prevMatched[index] !== comp)))

    activated.length && await Promise.all(activated.map(({asyncData}) => asyncData && asyncData({store, route: to})))

    next()
  })

  app.$mount('#app')
})

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
