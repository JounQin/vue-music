import 'styles/bootstrap'
import 'styles/app'
import(`styles/theme-${['blue', 'green', 'purple', 'red'][~~(Math.random() * 4)]}.styl`)

/* eslint-disable import/first */
import {app, router, store} from './app'
import {on} from 'utils'
import {throttle} from 'lodash'
/* eslint-enable import/first */

window.__INITIAL_STATE__ && store.replaceState(window.__INITIAL_STATE__)

if (__PROD__) require('vconsole')

const {documentElement: docEl} = document

const resize = () => {
  store.dispatch('setSize', {winHeight: docEl.clientHeight, winWidth: docEl.clientWidth})
  docEl.style.fontSize = store.getters.fontSize + 'px'
}

on(window, 'resize', throttle(resize, 300))

resize()

router.onReady(() => app.$mount('#app'))

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
